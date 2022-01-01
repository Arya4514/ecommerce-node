'use strict';

var sequelize = require('../config/sequelize');
const Op = sequelize.Sequelize.Op;
const Role = require('../helpers/role');
var errors = require('../config/errors');
var error = errors.errors;
const helpers = require('../helpers/validations');
const logger = require('../helpers/logger').logger;
const email = require('../helpers/email');
const fs = require('fs');
const activityLog = require('../helpers/activitylog')
const { successRes, errorsRes, validation } = require('../helpers/responseApi');
const userType = require('../helpers/userType');
const role = require('../helpers/role');
const { forgorPasswordEmail } = require('../helpers/email');

module.exports = {

    createUser: async (req, res) => {
        sequelize.sequelize.transaction(async (t1) => {

            if (!req.body.first_name || !req.body.last_name || !req.body.email || !req.body.address ||
                !req.body.city_id || !req.body.state_id || !req.body.country_id || !req.body.phone ||
                !req.body.password || !req.body.personal_pin || !req.body.user_name || !req.body.timezone
                // || !req.body.Features || !req.body.Features.length || !req.body.Features.length === 0
            ) {
                logger.warn(error.MANDATORY_FIELDS);
                return res.status(401).json(errorsRes(error.MANDATORY_FIELDS, res.statusCode));
            }

            if (req.body.personal_pin.length === 6) {

                let email = await sequelize.Users.findOne({
                    where: {
                        email: req.body.email,
                    },
                    attributes: { exclude: ['password', 'signup_token', 'personal_pin'] }
                });

                let user_name = await sequelize.Users.findOne({
                    where: {
                        user_name: req.body.user_name
                    },
                    attributes: { exclude: ['password', 'signup_token', 'personal_pin'] }
                });

                if (email) {
                    logger.warn(error.EMAIL_ID_ALREADY_EXITS);
                    return res.status(401).json(errorsRes(error.EMAIL_ID_ALREADY_EXITS, res.statusCode));
                }
                else if (user_name) {
                    logger.warn(error.USERNAME_ALREADY_EXITS);
                    return res.status(401).json(errorsRes(error.USERNAME_ALREADY_EXITS, res.statusCode));
                }
                else {
                    req.body.password = helpers.hashPassword(req.body.password)
                    req.body.user_type = "USER"
                    req.body.role_id = "3"
                    req.body.signup_token = new Date().getTime();
                    req.body.is_active = true;
                    req.body.is_confirmed = true;
                    req.body.created_at = new Date();
                    req.body.updated_at = new Date();

                    let user = await sequelize.Users.create(req.body);

                    user.setRoles(req.body.role_id)

                    req.name = req.userDetails.first_name + " " + req.userDetails.last_name
                    req.user_type = req.userDetails.user_type
                    req.activity = `${req.userDetails.first_name + " " + req.userDetails.last_name} created new user ${req.body.first_name + " " + req.body.last_name}`

                    await activityLog.activityLog(req)

                    // let feature_body_list = [];
                    // for (let index = 0; index < req.body.Features.length; index++) {
                    //     let feature_body = {
                    //         user_id: user.id,
                    //         feature_id: req.body.Features[index],
                    //         created_at: new Date(),
                    //         updated_at: new Date()
                    //     }
                    //     feature_body_list.push(feature_body);
                    // }

                    // await sequelize.UserFeatures.bulkCreate(feature_body_list);

                    // await email.signupEmail(req.body);

                    let result = error.OK;
                    logger.info(result);
                    return res.status(200).json(successRes(result, res.statusCode));

                }
            } else {
                logger.warn(error.LENGTH_OF_PERSONAL_PIN_NOT_VALIDE);
                return res.status(500).json(errorsRes(error.LENGTH_OF_PERSONAL_PIN_NOT_VALIDE, res.statusCode));
            }
        }).catch(async function (err) {
            logger.error(err);
            console.log(err)
            return res.status(500).json(errorsRes(error.SERVER_ERROR, res.statusCode));
        });

    },

    createSeller: async (req, res) => {
        sequelize.sequelize.transaction(async (t1) => {

            if (!req.body.first_name || !req.body.last_name || !req.body.email || !req.body.address ||
                !req.body.city_id || !req.body.state_id || !req.body.country_id || !req.body.phone ||
                !req.body.password
            ) {
                logger.warn(error.MANDATORY_FIELDS);
                return res.status(401).json(errorsRes(error.MANDATORY_FIELDS, res.statusCode));
            }

            let user = await sequelize.Users.findOne({
                where: {
                    email: req.body.email,
                },
                attributes: { exclude: ['password', 'signup_token'] }
            });

            if (email) {
                logger.warn(error.EMAIL_ID_ALREADY_EXITS);
                return res.status(401).json(errorsRes(error.EMAIL_ID_ALREADY_EXITS, res.statusCode));
            }
            else {
                req.body.password = helpers.hashPassword(req.body.password)
                req.body.user_type = userType.SELLER
                req.body.role = role.SELLER
                req.body.signup_token = new Date().getTime();
                req.body.is_active = true;
                req.body.is_confirmed = true;
                req.body.created_at = new Date();
                req.body.updated_at = new Date();

                user = await sequelize.Users.create(req.body);
                let data = {
                    email: user.email,
                    signup_token: req.body.signup_token
                }
                await email.signupEmail(data)

                let result = error.OK;
                logger.info(result);
                return res.status(200).json(successRes(result, res.statusCode));

            }
        }).catch(async function (err) {
            logger.error(err);
            console.log(err)
            return res.status(500).json(errorsRes(error.SERVER_ERROR, res.statusCode));
        });

    },

    confirmEmail: async (req, res) => {

        if (!req.body.encrypted_data || !req.body.password || req.body.password === "") {
            logger.error(error.MANDATORY_FIELDS);
            return res.status(422).json(errorsRes(error.MANDATORY_FIELDS, res.statusCode));
        }

        let original_data = helpers.decrypt(req.body.encrypted_data);

        if (!helpers.isValidEmail(original_data.email)) {
            logger.warn(error.INVALID_EMAIL)
            return res.status(422).json(errorsRes(error.INVALID_EMAIL, res.statusCode));
        }

        sequelize.sequelize.transaction(async (t1) => {

            let data = await sequelize.Users.findOne({ where: { email: original_data.email } });
            if (data) {

                if (Number(data.signup_token) == Number(original_data.token)) {
                    let result = {};
                    result.is_confirmed = true;
                    result.updated_at = helpers.getUTCDateTime();
                    result.signup_token = null;
                    result.password = helpers.hashPassword(req.body.password);
                    await sequelize.Users.update(result, { where: { email: original_data.email } });
                    logger.info(error.OK)
                    return res.status(200).json(successRes(error.OK, res.statusCode));
                }
                else {
                    logger.warn(error.UNAUTHORIZED);
                    return res.status(401).json(errorsRes(error.UNAUTHORIZED, res.statusCode));
                }
            }
            else {
                logger.warn(error.USER_NOT_FOUND)
                return res.status(404).json(errorsRes(error.USER_NOT_FOUND, res.statusCode));
            }
        }).catch(async function (err) {
            logger.error(err)
            console.log(err)
            return res.status(500).json(errorsRes(error.SERVER_ERROR, res.statusCode));
        });
    },

    resentconfirmationmail: async (req, res) => {
        console.log("req.body.id >>" + req.body.id);
        if (!req.body.id) {
            return res.status(422).json(errorsRes(error.MANDATORY_FIELDS, res.statusCode));
        }

        sequelize.sequelize.transaction(async (t1) => {

            let data = await sequelize.Users.findOne({
                where: {
                    id: req.body.id
                }
            });
            if (data) {

                await email.signupEmail(data);
                return res.status(200).json(successRes(error.OK, res.statusCode));
            }
            else {
                return res.status(422).json(errorsRes(error.USER_NOT_FOUND, res.statusCode));
            }
        }).catch(async function (err) {
            console.log(err)
            return res.status(500).json(errorsRes(error.SERVER_ERROR, res.statusCode));
        });
    },

    updateUserStatus: async (req, res) => {
        if (!req.body.id || !req.body.status) {
            return res.status(422).json(errorsRes(error.MANDATORY_FIELDS, res.statusCode));
        }

        sequelize.sequelize.transaction(async (t1) => {

            let data = await sequelize.Users.findOne({
                where: {
                    id: req.body.id
                }
            });

            if (data) {

                let result = {};
                result.is_active = req.body.status;

                req.name = req.userDetails.first_name + " " + req.userDetails.last_name
                req.user_type = req.userDetails.user_type
                req.activity = `${req.userDetails.first_name + " " + req.userDetails.last_name} updated status to ${result.is_active} for user ${data.first_name + " " + data.last_name}`

                await activityLog.activityLog(req)

                await sequelize.Users.update(result, { where: { id: req.body.id } });
                return res.status(200).json(successRes(error.OK, res.statusCode));
            }
            else {
                return res.status(422).json(errorsRes(error.USER_NOT_FOUND, res.statusCode));
            }
        }).catch(async function (err) {
            console.log(err)
            return res.status(500).json(errorsRes(error.SERVER_ERROR, res.statusCode));
        });
    },

    editUser: async (req, res) => {
        sequelize.sequelize.transaction(async (t1) => {

            if (!req.body.id) {
                logger.warn(error.MANDATORY_FIELDS);
                return res.status(401).json(errorsRes(error.MANDATORY_FIELDS, res.statusCode));
            }

            if (req.body.password) {
                delete req.body.password;
            }

            let user = await sequelize.Users.findOne({
                where: { id: req.body.id }
            });

            if (req.body.email || req.body.user_name) {
                let user = await sequelize.Users.findOne({
                    where: { email: req.body.email }
                });

                let userName = await sequelize.Users.findOne({
                    where: { user_name: req.body.user_name }
                });
                if (userName) {
                    logger.warn(error.USERNAME_ALREADY_EXITS);
                    return res.status(403).json(errorsRes(error.USERNAME_ALREADY_EXITS, res.statusCode));
                }
                if (!user) {
                    logger.warn(error.EMAIL_ID_ALREADY_EXITS);
                    return res.status(403).json(errorsRes(error.EMAIL_ID_ALREADY_EXITS, res.statusCode));
                }
            }
            if (!user) {
                logger.warn(error.DATA_NOT_FOUND);
                return res.status(403).json(errorsRes(error.DATA_NOT_FOUND, res.statusCode));
            }

            // await user.setRoles(req.body.role_id)
            req.name = req.userDetails.first_name + " " + req.userDetails.last_name
            req.user_type = req.userDetails.user_type
            // req.previous_data = checkCountry
            // req.current_data = Country.name
            req.activity = `${req.userDetails.first_name + " " + req.userDetails.last_name} updated user data ${user.first_name + " " + user.last_name}`
            await activityLog.activityLog(req)

            user = await sequelize.Users.update(req.body, {
                where: {
                    id: req.body.id
                }
            });

            // var feature_body_list = [];

            // for (let index = 0; index < req.body.Features.length; index++) {
            //     let feature_body = {
            //         user_id: req.body.id,
            //         feature_id: req.body.Features[index]
            //     }
            //     feature_body_list.push(feature_body);
            // }

            // await sequelize.UserFeatures.bulkCreate(feature_body_list, { updateOnDuplicate: ["user_id", "feature_id"] });

            let result = error.OK;
            result.data = user;
            logger.info(result);
            return res.status(200).json(successRes(result, res.statusCode));

        }).catch(async function (err) {
            logger.error(err);
            console.log(err);
            return res.status(500).json(errorsRes(error.SERVER_ERROR, res.statusCode));
        });

    },

    forgotPasswordByUsername: async (req, res) => {

        // if (req.body.body_encrypted) {
        //     let original_data = helpers.decrypt(req.body.body_encrypted);
        //     req.body = original_data;
        // }

        if (!req.body.user_name) {
            logger.warn(error.MANDATORY_FIELDS)
            return res.status(401).json(errorsRes(error.MANDATORY_FIELDS, res.statusCode));
        }

        // if (!helpers.isValidEmail(req.body.email)) {
        //     logger.warn(error.INVALID_EMAIL)
        //     return res.status(200).json(error.INVALID_EMAIL);
        // }

        sequelize.sequelize.transaction(async (t1) => {
            let user = await sequelize.Users.findOne({
                where: {
                    user_name: req.body.user_name,
                    is_active: true,
                    is_confirmed: true
                }
            });
            if (user) {
                // let result = {
                //     updated_at: helpers.getUTCDateTime(),
                //     signup_token: new Date().getTime()
                // };

                // let x = JSON.parse(JSON.stringify(result));

                // await sequelize.Users.update(result, { where: { email: req.body.email }, attributes: { exclude: ["seessiontoken", "token"] } });

                // let parameter = {};
                // parameter.signup_token = x.signup_token;
                // parameter.email = req.body.email;
                // parameter.name = user.first_name + " " + user.last_name;

                // await email.forgorPasswordEmail(parameter)
                logger.info(error.OK)
                return res.status(200).json(successRes(error.OK, res.statusCode));
            }
            else {
                logger.warn(error.USER_NOT_FOUND)
                return res.status(404).json(errorsRes(error.USER_NOT_FOUND, res.statusCode));
            }
        }).catch(async function (err) {
            logger.error(err)
            return res.status(500).json(errorsRes(error.SERVER_ERROR, res.statusCode));
        });
    },

    forgotPasswordEmail: async (req, res) => {

        if (req.body.body_encrypted) {
            let original_data = helpers.decrypt(req.body.body_encrypted);
            console.log(original_data);
            req.body = original_data;
        }

        if (!req.body.email) {
            return res.status(200).json(error.MANDATORY_FIELDS);
        }

        if (!helpers.isValidEmail(req.body.email)) {
            return res.status(200).json(error.INVALID_EMAIL);
        }

        sequelize.sequelize.transaction(async (t1) => {
            let user = await sequelize.Users.findOne({
                where: {
                    email: req.body.email,
                    is_active: true,
                    is_confirmed: true
                }
            });
            if (user) {
                let result = {
                    signup_token: new Date().getTime()
                };

                let x = JSON.parse(JSON.stringify(result));

                await sequelize.Users.update(result, { where: { email: req.body.email } });

                let parameter = {};
                parameter.signup_token = x.signup_token;
                parameter.email = req.body.email;
                parameter.name = user.first_name + " " + user.last_name;
                parameter.language = user.language;

                await forgorPasswordEmail(parameter)
                return res.status(200).send(successRes(error.OK, res.statusCode));
            }
            else {
                return res.status(200).send(errorsRes(error.USER_NOT_FOUND, res.statusCode));
            }
        }).catch(function (err) {
            console.log(err)
            return res.status(500).send(error.SERVER_ERROR);
        });
    },

    forgotPassword: async (req, res) => {
        sequelize.sequelize.transaction(async (t1) => {

            if (!req.body.password || req.body.password === ""
                ||!req.body.encrypted_data 
            ) {
                logger.warn(error.MANDATORY_FIELDS)
                return res.status(401).json(errorsRes(error.MANDATORY_FIELDS, res.statusCode));
            }

            let original_data = await helpers.decrypt(req.body.encrypted_data);

            if (!helpers.isValidEmail(original_data.email)) {
                logger.warn(error.INVALID_EMAIL)
                return res.status(200).json(error.INVALID_EMAIL);
            }


            let data = await sequelize.Users.findOne({
                where: {
                    email: original_data.email,
                    is_active: true,
                    is_confirmed: true,
                    signup_token: original_data.token.toString()
                }
            });

            if (data) {

                let result = {
                    signup_token: null,
                    password: helpers.hashPassword(req.body.password)
                };

                await sequelize.Users.update(result, { where: { email: original_data.email } });
                logger.info(error.OK)
                return res.status(200).json(successRes(error.OK, res.statusCode));
            }
            else {
                logger.warn(error.WENT_WRONG)
                return res.status(401).json(errorsRes(error.WENT_WRONG, res.statusCode));
            }
        }).catch(async function (err) {
            logger.error(err)
            console.log(err)
            return res.status(500).json(errorsRes(error.SERVER_ERROR, res.statusCode));
        });
    },

    forgotPersonalPin: async (req, res) => {
        // if (!req.userDetails || !req.userDetails.id) {
        //     logger.warn(error.UNAUTHORIZED)
        //     return res.status(422).json(error.UNAUTHORIZED);
        // }

        if (!req.body.personal_pin || req.body.personal_pin === ''
            || !req.body.password || req.body.password === '' || !req.body.user_name) {
            logger.warn(error.MANDATORY_FIELDS)
            return res.status(422).json(errorsRes(error.MANDATORY_FIELDS, res.statusCode));
        }

        sequelize.sequelize.transaction(async (t1) => {
            if (req.body.personal_pin.length === 6) {
                let data = await sequelize.Users.findOne({
                    where: {
                        user_name: req.body.user_name
                    }
                });

                if (!data) {
                    logger.warn(error.USER_NOT_FOUND)
                    return res.status(422).json(errorsRes(error.USER_NOT_FOUND, res.statusCode));
                }

                let result = {};

                if (!helpers.comparePassword(data.password, req.body.password)) {
                    logger.warn(error.PASSWORD_MISSMATCH)
                    return res.status(401).json(errorsRes(error.PASSWORD_MISSMATCH, res.statusCode));
                }

                result.personal_pin = req.body.personal_pin;
                await sequelize.Users.update(result, { where: { user_name: req.body.user_name } });
                logger.info(error.OK)
                return res.status(200).json(successRes(error.OK, res.statusCode));
            } else {
                logger.warn(error.LENGTH_OF_PERSONAL_PIN_NOT_VALIDE);
                return res.status(500).json(errorsRes(error.LENGTH_OF_PERSONAL_PIN_NOT_VALIDE, res.statusCode));
            }
        }).catch(async function (err) {
            logger.error(err)
            return res.status(500).json(errorsRes(error.SERVER_ERROR, res.statusCode));
        });
    },

    uploadImage: async (req, res) => {
        if (!req.body.file_byte) {
            logger.warn(error.MANDATORY_FIELDS)
            return res.status(401).json(errorsRes(error.MANDATORY_FIELDS, res.statusCode));
        }
        sequelize.sequelize.transaction(async (t1) => {
            let user = await sequelize.Users.findAll({
                where: {
                    id: req.userDetails.id
                }
            })
            if (user) {
                let data = {
                    "img": req.body.file_byte
                }
                user = await sequelize.Users.update(data, {
                    where: {
                        id: req.userDetails.id
                    }
                })

                let result = error.OK
                result.data = user

                logger.info(result);
                return res.status(200).json(successRes(result, res.statusCode));
            } else {
                logger.warn(error.USER_NOT_FOUND);
                return res.status(401).json(errorsRes(error.USER_NOT_FOUND, res.statusCode));
            }
        }).catch(async function (err) {
            console.log(err)
            return res.status(500).json(errorsRes(error.SERVER_ERROR, res.statusCode));
        })
    },

    editProfile: async (req, res) => {
        if (!req.userDetails || !req.userDetails.id) {
            logger.warn(error.MANDATORY_FIELDS)
            return res.status(422).json(errorsRes(error.MANDATORY_FIELDS, res.statusCode));
        }

        sequelize.sequelize.transaction(async (t1) => {
            let user = await sequelize.Users.findOne({
                where: { id: req.userDetails.id }
            });
            if (!user) {
                logger.warn(error.USER_NOT_FOUND)
                return res.status(401).json(errorsRes(error.USER_NOT_FOUND, res.statusCode));
            }
            else {

                delete req.body.password;
                delete req.body.role_id;
                delete req.body.email;
                delete req.body.img;
                delete req.body.station_id;
                delete req.body.is_confirmed;
                delete req.body.is_active;
                delete req.body.personal_pin;
                await sequelize.Users.update(req.body, { where: { id: req.userDetails.id } });

                req.name = req.userDetails.first_name + " " + req.userDetails.last_name
                req.user_type = req.userDetails.user_type
                // req.previous_data = checkCountry
                // req.current_data = Country.name
                req.activity = `${req.userDetails.first_name + " " + req.userDetails.last_name} updated user data ${user.first_name + " " + user.last_name}`
                await activityLog.activityLog(req)

                logger.info(error.OK)
                return res.status(200).json(successRes(error.OK, res.statusCode));
            }
        }).catch(async function (err) {
            logger.error(err);
            return res.status(500).json(errorsRes(error.SERVER_ERROR, res.statusCode));
        });
    },

    resetPassword: async (req, res) => {
        if (!req.userDetails || !req.userDetails.id) {
            logger.warn(error.UNAUTHORIZED)
            return res.status(422).json(errorsRes(error.UNAUTHORIZED, res.statusCode));
        }

        if (!req.body.password || req.body.password === ''
            || !req.body.old_password || req.body.old_password === '') {
            logger.warn(error.MANDATORY_FIELDS)
            return res.status(422).json(errorsRes(error.MANDATORY_FIELDS, res.statusCode));
        }

        sequelize.sequelize.transaction(async (t1) => {
            let data = await sequelize.Users.findOne({
                where: {
                    id: req.userDetails.id
                }
            });

            if (!data) {
                logger.warn(error.USER_NOT_FOUND)
                return res.status(401).json(errorsRes(error.USER_NOT_FOUND, res.statusCode));
            }

            let result = {};

            if (!helpers.comparePassword(data.password, req.body.old_password)) {
                logger.warn(error.PASSWORD_MISSMATCH)
                return res.status(401).json(errorsRes(error.PASSWORD_MISSMATCH, res.statusCode));
            }

            result.updated_at = helpers.getUTCDateTime();
            result.password = helpers.hashPassword(req.body.password);
            await sequelize.Users.update(result, { where: { id: req.userDetails.id } });
            logger.info(error.OK)
            return res.status(200).json(successRes(error.OK, res.statusCode));

        }).catch(async function (err) {
            logger.error(err)
            return res.status(500).json(errorsRes(error.SERVER_ERROR, res.statusCode));
        });
    },

    getUserByID: async (req, res) => {

        sequelize.sequelize.transaction(async (t1) => {

            if (!req.params.id) {
                logger.warn(error.MANDATORY_FIELDS);
                return res.status(401).json(errorsRes(error.MANDATORY_FIELDS, res.statusCode));
            }

            let user = await sequelize.Users.findOne({
                where: {
                    id: req.params.id
                },
                attributes: { exclude: ['password', 'signup_token', 'token', 'sessiontoken', 'personal_pin'] },
                include: [
                    {
                        model: sequelize.UserFeatures,
                        include: [sequelize.Features]
                    },
                    {
                        model: sequelize.UserRoles,
                        include: [sequelize.Roles]
                    },
                    {
                        model: sequelize.City,
                        include: [{
                            model: sequelize.State,
                            include: [sequelize.Country]
                        }]
                    },
                    {
                        model: sequelize.Stations
                    }
                ],
                order: [['updatedAt', 'DESC']],
            });

            let result = error.OK;
            result.data = user;
            logger.info(result);
            return res.status(200).json(successRes(result, res.statusCode));

        }).catch(async function (err) {
            logger.error(err);
            console.log(err)
            return res.status(500).json(errorsRes(error.SERVER_ERROR, res.statusCode));
        });
    },

    getUsersByStationID: async (req, res) => {
        sequelize.sequelize.transaction(async (t1) => {
            if (!req.body.id) {
                logger.warn(error.MANDATORY_FIELDS);
                return res.status(401).json(errorsRes(error.MANDATORY_FIELDS, res.statusCode));
            }

            let user = await sequelize.Users.findAll({
                where: {
                    station_id: req.body.id
                },
                order: [['updatedAt', 'DESC']],
            })

            let result = error.OK;
            result.data = user;
            logger.info(result);
            return res.status(200).json(successRes(result, res.statusCode));

        }).catch(async function (err) {
            logger.error(err);
            console.log(err)
            return res.status(500).json(errorsRes(error.SERVER_ERROR, res.statusCode));
        });
    },

    getUsers: async (req, res) => {

        sequelize.sequelize.transaction(async (t1) => {

            let user = await sequelize.Users.findAll({
                where: { [Op.not]: [{ user_type: Role.ADMIN }] },
                attributes: { exclude: ['password', 'signup_token', 'token', 'sessiontoken', 'personal_pin'] },
                include: [
                    {
                        model: sequelize.UserFeatures,
                        include: [sequelize.Features]
                    },
                    {
                        model: sequelize.UserRoles,
                        include: [sequelize.Roles]
                    },
                    {
                        model: sequelize.City,
                        include: [{
                            model: sequelize.State,
                            include: [sequelize.Country]
                        }]
                    },
                    {
                        model: sequelize.Stations
                    }
                ],
                order: [['updatedAt', 'DESC']],
            })
            let result = error.OK;
            result.data = user;
            logger.info(result);
            return res.status(200).json(successRes(result, res.statusCode));

        }).catch(async function (err) {
            logger.error(err);
            console.log(err)
            return res.status(500).json(errorsRes(error.SERVER_ERROR, res.statusCode));
        });
    }
}