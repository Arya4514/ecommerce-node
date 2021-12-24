'use strict';

const sequelize = require('../config/sequelize');
const errors = require('../config/errors');
const error = errors.errors;
const helpers = require('../helpers/validations');
const email = require('../helpers/email');
const logger = require('../helpers/logger').logger;
const activityLog = require('../helpers/activitylog');
const { successRes, errorsRes, validation, authSuccess } = require('../helpers/responseApi');
const role = require('../helpers/role');
const userType = require('../helpers/userType');

module.exports = {
    signIn: async (req, res) => {

        if (req.body.body_encrypted) {
            let original_data = helpers.decrypt(req.body.body_encrypted);
            req.body = original_data;
        }

        if (!req.body.email || !req.body.password) {
            logger.warn(error.MANDATORY_FIELDS)
            return res.status(401).json(errorsRes(error.MANDATORY_FIELDS, res.statusCode));
        }

        sequelize.sequelize.transaction(async (t1) => {

            let user = await sequelize.Users.findOne({
                where: {
                    email: req.body.email,
                    is_active: true,
                    is_confirmed: true
                }
            });

            if (!user) {
                logger.warn(error.USER_NOT_FOUND)
                return res.status(401).json(errorsRes(error.USER_NOT_FOUND, res.statusCode));
            }

            if (!helpers.comparePassword(user.password, req.body.password)) {
                logger.warn(error.INVALID_CREDENTIAL)
                return res.status(401).json(errorsRes(error.INVALID_CREDENTIAL, res.statusCode));
            }
            else {

                let last_login = {
                    last_login: helpers.getUTCDateTime()
                }
                await sequelize.Users.update(last_login, { where: { id: user.id } })


                delete user.password;

                const tokenOriginal = helpers.generateUserToken(
                    user.id, user.email, user.user_type, user.role, user.first_name, user.last_name, user.phone, user.city_id,
                    user.state_id, user.country_id
                );

                var result = error.OK;
                result.token = tokenOriginal;
                logger.info(result)
                return res.status(200).json(await authSuccess(result, res.statusCode));
            }
        }).catch(async function (err) {
            logger.error(err)
            console.log(err)
            return res.status(500).json(errorsRes(error.SERVER_ERROR, res.statusCode));
        });
    },

    verifyOTP: async (req, res) => {

        if (req.body.body_encrypted) {
            let original_data = helpers.decrypt(req.body.body_encrypted);
            console.log(original_data);
            req.body = original_data;
        }

        if (!req.headers.sessiontoken || !req.body.otp) {
            return res.status(401).json(error.MANDATORY_FIELDS);
        }

        sequelize.sequelize.transaction(async (t1) => {

            var token = await sequelize.VerifyOtp.findOne({
                where: {
                    session_token: req.headers.sessiontoken,
                    is_active: true,
                }
            });

            if (!token) {
                return res.status(401).send(error.SESSION_TOKEN_NOT_VALID);
            }
            else if (token) {

                var currentDate = new Date(new Date().toUTCString());
                var otpGenerateDate = new Date(new Date(token.otp_generate_time).toUTCString());
                const dateDifference = helpers.dateDifference(currentDate, otpGenerateDate);

                if (token.otp !== parseInt(req.body.otp)) {
                    return res.status(401).send(error.VERIFICATION_FAILURE);
                }
                else if (dateDifference.seconds() > 600) {
                    return res.status(200).send(error.OTP_EXPIRED);
                }
                else {

                    await sequelize.VerifyOtp.update({ is_active: false }, { where: { email: token.email } });

                    let data = {};
                    data.is_confirmed = true;
                    data.updated_at = helpers.getUTCDateTime();
                    data.signup_token = null;
                    await sequelize.Users.update(data, { where: { email: token.email } });
                    await email.registrationSuccess({ data: { email: token.email } })

                    var result = error.OK;

                    return res.status(200).send(await successRes(result, res.statusCode));
                }

            }

        }).catch(function (err) {
            console.log(err)
            return res.status(500).send(error.SERVER_ERROR);
        });
    },

    signUp: async (req, res) => {

        if (req.body.body_encrypted) {
            let original_data = helpers.decrypt(req.body.body_encrypted);
            req.body = original_data;
        }

        if (!req.body.first_name || !req.body.last_name || !req.body.email || !req.body.address ||
            !req.body.city_id || !req.body.state_id || !req.body.country_id || !req.body.phone ||
            !req.body.password) {
            logger.warn(error.MANDATORY_FIELDS)
            return res.status(401).json(errorsRes(error.MANDATORY_FIELDS, res.statusCode));
        }

        sequelize.sequelize.transaction(async (t1) => {

            let user = await sequelize.Users.findOne({
                where: {
                    email: req.body.email,
                    is_active: true,
                    is_confirmed: true
                }
            });

            if (!user) {

                req.body.password = helpers.hashPassword(req.body.password)
                req.body.user_type = userType.SUPER_ADMIN
                req.body.role = role.USER
                req.body.signup_token = new Date().getTime();
                req.body.is_active = true;
                req.body.is_confirmed = false;

                let user = await sequelize.Users.create(req.body);

                const sessionToken = helpers.generateSessionToken();
                const generateOTP = helpers.generateOTP();
                var VerifyOtp = {};
                VerifyOtp.session_token = sessionToken;
                VerifyOtp.is_active = true
                VerifyOtp.email = req.body.email;
                VerifyOtp.otp = generateOTP;
                VerifyOtp.otp_generate_time = helpers.getUTCDateTime();
                VerifyOtp.created_at = helpers.getUTCDateTime();
                VerifyOtp.updated_at = helpers.getUTCDateTime();


                await sequelize.VerifyOtp.destroy({ where: { email: user.email } });
                await sequelize.VerifyOtp.create(VerifyOtp)

                let last_login = {
                    last_login: helpers.getUTCDateTime()
                }

                await sequelize.Users.update(last_login, { where: { id: user.id } })

                await email.otpTokenEmail(VerifyOtp);

                var result = error.OK;
                result.data = {}
                result.data.sessiontoken = sessionToken;
                logger.info(result)
                return res.status(200).json(await successRes(result, res.statusCode));

            }
            else {
                logger.warn(error.EMAIL_ID_ALREADY_EXITS);
                return res.status(401).json(errorsRes(error.EMAIL_ID_ALREADY_EXITS, res.statusCode));
            }
        }).catch(async function (err) {
            logger.error(err)
            console.log(err)
            return res.status(500).json(errorsRes(error.SERVER_ERROR, res.statusCode));
        });
    }
}