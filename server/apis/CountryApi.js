'use strict';

var sequelize = require('../config/sequelize');
var errors = require('../config/errors');
var error = errors.errors;
const logger = require('../helpers/logger').logger;
const activityLog = require('../helpers/activitylog');
const { successRes, errorsRes, validation } = require('../helpers/responseApi');

module.exports = {

    createCountry: async (req, res) => {

        sequelize.sequelize.transaction(async (t1) => {

            if (!req.body.name) {
                logger.warn(error.MANDATORY_FIELDS);
                return res.status(401).json(errorsRes(error.MANDATORY_FIELDS, res.statusCode));
            }
            req.body.is_active = true
            let Country = await sequelize.Country.findOne({
                where: {
                    name: req.body.name
                }, attributes: { exclude: ['token', 'sessiontoken'] }
            });

            if (!Country) {
                Country = await sequelize.Country.create(req.body);

                // req.name = req.userDetails.first_name + " " + req.userDetails.last_name
                // req.user_type = req.userDetails.user_type
                // req.activity = `${req.userDetails.first_name + " " + req.userDetails.last_name} created Country ${Country.name}`
                // await activityLog.activityLog(req)

                let result = error.OK;
                result.data = Country;
                logger.info(result);
                return res.status(200).json(successRes(error.OK, res.statusCode));

            } else {
                logger.warn(error.ENTITY_EXIST);
                return res.status(403).json(errorsRes(error.ENTITY_EXIST, res.statusCode));
            }
        }).catch(async function (err) {
            logger.error(err);
            return res.status(500).json(errorsRes(error.SERVER_ERROR, res.statusCode));
        });
    },

    getCountry: async (req, res) => {

        sequelize.sequelize.transaction(async (t1) => {

            let Country = await sequelize.Country.findAll({
                where: { is_active: true },
                attributes: { exclude: ['token', 'sessiontoken'] }
            });

            let result = error.OK;
            result.data = Country;

            logger.info(result);
            return res.status(200).json(successRes(error.OK, res.statusCode));
        }).catch(async function (err) {
            logger.error(err);
            return res.status(500).json(errorsRes(error.SERVER_ERROR, res.statusCode));
        });
    },

    getCountryById: async (req, res) => {

        sequelize.sequelize.transaction(async (t1) => {

            let Country = await sequelize.Country.findOne({
                where: {
                    id: req.params.id,
                    is_active: true
                }, attributes: { exclude: ['token', 'sessiontoken'] }
            });

            let result = error.OK;
            result.data = Country;

            logger.info(result);
            return res.status(200).json(successRes(error.OK, res.statusCode));
        }).catch(async function (err) {
            logger.error(err);
            return res.status(500).json(errorsRes(error.SERVER_ERROR, res.statusCode));
        });
    },

    editCountry: async (req, res) => {

        sequelize.sequelize.transaction(async (t1) => {

            if (!req.body.name) {
                logger.warn(error.MANDATORY_FIELDS);
                return res.status(401).json(errorsRes(error.MANDATORY_FIELDS, res.statusCode));
            }
            let id = req.body.id;

            let checkCountry = await sequelize.Country.findOne({
                where: {
                    id: id,
                },
                attributes: { exclude: ['token', 'sessiontoken'] }
            })

            checkCountry = checkCountry.get();
            if (checkCountry) {
                let Country = await sequelize.Country.update(req.body, {
                    where: {
                        id: id
                    }, attributes: { exclude: ['token', 'sessiontoken'] },
                    returning: true, plain: true
                });

                // req.name = req.userDetails.first_name + " " + req.userDetails.last_name
                // req.user_type = req.userDetails.user_type
                // req.previous_data = checkCountry
                // req.current_data = Country.name
                // req.activity = `${req.userDetails.first_name + " " + req.userDetails.last_name} updated country data ${Country.name}`
                // await activityLog.activityLog(req)

                let result = error.OK;
                result.data = Country;

                logger.info(result);
                return res.status(200).json(successRes(error.OK, res.statusCode));
            }
            else {
                logger.warn(error.DATA_NOT_FOUND);
                return res.status(401).json(errorsRes(error.DATA_NOT_FOUND, res.statusCode));;
            }
        }).catch(async function (err) {
            logger.error(err);
            return res.status(500).json(errorsRes(error.SERVER_ERROR, res.statusCode));
        });

    },

    updateCountryStatus: async (req, res) => {
        if (!req.body.id || !req.body.status) {
            return res.status(422).json(errorsRes(error.MANDATORY_FIELDS, res.statusCode));
        }

        sequelize.sequelize.transaction(async (t1) => {

            let data = await sequelize.Country.findOne({
                where: {
                    id: req.body.id
                },
                attributes: { exclude: ['token', 'sessiontoken'] }
            });

            if (data) {

                let result = {};
                result.is_active = req.body.status;

                // req.name = req.userDetails.first_name + " " + req.userDetails.last_name
                // req.user_type = req.userDetails.user_type
                // req.activity = `${req.userDetails.first_name + " " + req.userDetails.last_name} updated status to ${result.is_active} for country ${data.name}`
                // await activityLog.activityLog(req)

                await sequelize.Country.update(result, { where: { id: req.body.id } });
                return res.status(200).json(successRes(error.OK, res.statusCode));
            }
            else {
                return res.status(422).json(errorsRes(error.DATA_NOT_FOUND, res.statusCode));
            }
        }).catch(async function (err) {
            console.log(err)
            return res.status(500).json(errorsRes(error.SERVER_ERROR, res.statusCode));
        });
    }

}