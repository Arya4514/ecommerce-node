'use strict';

var sequelize = require('../config/sequelize');
var errors = require('../config/errors');
var error = errors.errors;
const logger = require('../helpers/logger').logger;
const activityLog = require('../helpers/activitylog');
const { successRes, errorsRes, validation } = require('../helpers/responseApi');

module.exports = {

    createCity: async (req, res) => {

        sequelize.sequelize.transaction(async (t1) => {

            if (!req.body.name ||
                !req.body.state_id) {
                logger.warn(error.MANDATORY_FIELDS);
                return res.status(401).json(errorsRes(error.MANDATORY_FIELDS, res.statusCode));
            }
            req.body.is_active = true

            let City = await sequelize.City.findOne({
                where: {
                    name: req.body.name
                }, attributes: { exclude: ['token', 'sessiontoken'] }
            });
            if (!City) {
                City = await sequelize.City.create(req.body);


                // req.name = req.userDetails.first_name + " " + req.userDetails.last_name
                // req.user_type = req.userDetails.user_type
                // req.activity = `${req.userDetails.first_name + " " + req.userDetails.last_name} created city ${City.name}`
                // await activityLog.activityLog(req)

                let result = error.OK;
                result.data = City;
                logger.info(result);
                return res.status(200).json(successRes(result, res.statusCode));

            } else {
                logger.warn(error.ENTITY_EXIST);
                return res.status(403).json(errorsRes(error.ENTITY_EXIST, res.statusCode));
            }
        }).catch(async function (err) {
            logger.error(err);
            return res.status(500).json(errorsRes(error.SERVER_ERROR, res.statusCode));
        });
    },

    getCity: async (req, res) => {

        sequelize.sequelize.transaction(async (t1) => {
            let City = await sequelize.City.findAll({
                where: {
                    is_active: true
                },
                include: [
                    { model: sequelize.State, include: [sequelize.Country] }
                ],
                attributes: {
                    exclude:
                        ['token', 'sessiontoken']
                },
                order: [['updatedAt', 'DESC']],
            });

            let result = error.OK;
            result.data = City;

            logger.info(result);
            return res.status(200).json(successRes(result, res.statusCode));
        }).catch(async function (err) {
            logger.error(err);
            return res.status(500).json(errorsRes(error.SERVER_ERROR, res.statusCode));
        });

    },

    getCityById: async (req, res) => {

        sequelize.sequelize.transaction(async (t1) => {

            let City = await sequelize.City.findOne({
                where: {
                    id: req.params.id,
                    is_active: true
                },
                include: [
                    { model: sequelize.State, include: [sequelize.Country] }
                ],
                attributes: { exclude: ['token', 'sessiontoken'] }
            });

            let result = error.OK;
            result.data = City;

            logger.info(result);
            return res.status(200).json(successRes(result, res.statusCode));
        }).catch(async function (err) {
            logger.error(err);
            return res.status(500).json(errorsRes(error.SERVER_ERROR, res.statusCode));
        });
    },

    getCityByState: async (req, res) => {

        sequelize.sequelize.transaction(async (t1) => {

            let id = req.params.id;

            let City = await sequelize.City.findAll({
                where: {
                    state_id: id,
                    is_active: true
                }, attributes: { exclude: ['token', 'sessiontoken'] },
                order: [['updatedAt', 'DESC']]
            });

            let result = error.OK;
            result.data = City;

            logger.info(result);
            return res.status(200).json(successRes(result, res.statusCode));

        }).catch(async function (err) {
            logger.error(err);
            return res.status(500).json(errorsRes(error.SERVER_ERROR, res.statusCode));
        });

    },

    editCity: async (req, res) => {

        sequelize.sequelize.transaction(async (t1) => {

            if (!req.body.name ||
                !req.body.state_id) {
                logger.warn(error.MANDATORY_FIELDS);
                return res.status(401).json(errorsRes(error.MANDATORY_FIELDS, res.statusCode));
            }

            let id = req.body.id;

            let checkCity = await sequelize.City.findOne({
                where: {
                    id: id,
                },
                attributes: { exclude: ['token', 'sessiontoken'] }
            })
            checkCity = checkCity.get();
            if (checkCity) {
                let City = await sequelize.City.update(req.body, {
                    where: {
                        id: id
                    },
                    returning: true, plain: true
                });

                // req.name = req.userDetails.first_name + " " + req.userDetails.last_name
                // req.user_type = req.userDetails.user_type
                // req.previous_data = checkCity
                // req.current_data = City.name
                // req.activity = `${req.userDetails.first_name + " " + req.userDetails.last_name} updated city data ${City.name}`
                // await activityLog.activityLog(req)

                let result = error.OK;
                result.data = City;

                logger.info(result);
                return res.status(200).json(successRes(result, res.statusCode));
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

    updateCityStatus: async (req, res) => {
        if (!req.body.id || !req.body.status) {
            return res.status(422).json(errorsRes(error.MANDATORY_FIELDS, res.statusCode));
        }

        sequelize.sequelize.transaction(async (t1) => {

            let data = await sequelize.City.findOne({
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
                // req.activity = `${req.userDetails.first_name + " " + req.userDetails.last_name} updated status to ${result.is_active} for city ${data.name}`
                // await activityLog.activityLog(req)

                await sequelize.City.update(result, { where: { id: req.body.id } });
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