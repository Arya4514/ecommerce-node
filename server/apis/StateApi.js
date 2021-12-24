'use strict';

var sequelize = require('../config/sequelize');
var errors = require('../config/errors');
var error = errors.errors;
const logger = require('../helpers/logger').logger;
const { successRes, errorsRes, validation } = require('../helpers/responseApi');

module.exports = {

    createState: async (req, res) => {

        sequelize.sequelize.transaction(async (t1) => {

            if (!req.body.name ||
                !req.body.country_id) {
                logger.warn(error.MANDATORY_FIELDS);
                return res.status(401).json(errorsRes(error.MANDATORY_FIELDS, res.statusCode));
            }
            req.body.is_active = true

            let State = await sequelize.State.findOne({
                where: {
                    name: req.body.name
                }, attributes: { exclude: ['token', 'sessiontoken'] }
            });
            if (!State) {
                State = await sequelize.State.create(req.body);

                // req.name = req.userDetails.first_name + " " + req.userDetails.last_name
                // req.user_type = req.userDetails.user_type
                // req.activity = `${req.userDetails.first_name + " " + req.userDetails.last_name} created State ${State.name}`
                // await activityLog.activityLog(req)

                let result = error.OK;
                result.data = State;
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

    getState: async (req, res) => {

        sequelize.sequelize.transaction(async (t1) => {

            let State = await sequelize.State.findAll({
                where: {
                    is_active: true
                },
                include: [sequelize.Country],
                attributes: { exclude: ['token', 'sessiontoken'] }
            });

            let result = error.OK;
            result.data = State;

            logger.info(result);
            return res.status(200).json(successRes(result, res.statusCode));

        }).catch(async function (err) {
            logger.error(err);
            console.log(err);
            return res.status(500).json(errorsRes(error.SERVER_ERROR, res.statusCode));
        });

    },

    getStateById: async (req, res) => {

        sequelize.sequelize.transaction(async (t1) => {

            let State = await sequelize.State.findOne({
                where: {
                    id: req.params.id,
                    is_active: true
                },
                include: [sequelize.Country],
                attributes: { exclude: ['token', 'sessiontoken'] }
            });

            let result = error.OK;
            result.data = State;

            logger.info(result);
            return res.status(200).json(successRes(result, res.statusCode));
        }).catch(async function (err) {
            logger.error(err);
            return res.status(500).json(errorsRes(error.SERVER_ERROR, res.statusCode));
        });
    },

    getStateByCountry: async (req, res) => {

        sequelize.sequelize.transaction(async (t1) => {

            let id = req.params.id;

            let State = await sequelize.State.findAll({
                where: {
                    country_id: id,
                    is_active: true
                }, attributes: { exclude: ['token', 'sessiontoken'] }
            });

            let result = error.OK;
            result.data = State;

            logger.info(result);
            return res.status(200).json(successRes(result, res.statusCode));

        }).catch(async function (err) {
            logger.error(err);
            return res.status(500).json(errorsRes(error.SERVER_ERROR, res.statusCode));
        });

    },


    editState: async (req, res) => {

        sequelize.sequelize.transaction(async (t1) => {

            if (!req.body.id) {
                logger.warn(error.MANDATORY_FIELDS);
                return res.status(401).json(errorsRes(error.MANDATORY_FIELDS, res.statusCode));
            }

            let id = req.body.id;

            let checkState = await sequelize.State.findOne({
                where: {
                    id: req.body.id,
                    is_active: true
                }
            });

            checkState = checkState.get();
            if (checkState) {
                let State = await sequelize.State.update(req.body, {
                    where: {
                        id: id,
                        is_active: true
                    }, attributes: { exclude: ['token', 'sessiontoken'] },
                    returning: true, plain: true
                });
                State = State.filter((item) => item !== undefined);

                // req.name = req.userDetails.first_name + " " + req.userDetails.last_name
                // req.user_type = req.userDetails.user_type
                // req.previous_data = JSON.stringify(checkCountry);
                // req.current_data = JSON.stringify(State);
                // req.activity = `${req.userDetails.first_name + " " + req.userDetails.last_name} updated country data ${checkState.name}`

                // await activityLog.activityLog(req)

                let result = error.OK;
                result.data = State;

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

    updateStateStatus: async (req, res) => {
        if (!req.body.id || !req.body.status) {
            return res.status(422).json(errorsRes(error.MANDATORY_FIELDS, res.statusCode));
        }

        sequelize.sequelize.transaction(async (t1) => {

            let data = await sequelize.State.findOne({
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
                // req.activity = `${req.userDetails.first_name + " " + req.userDetails.last_name} updated status to ${result.is_active} for state ${data.name}`
                // await activityLog.activityLog(req)

                await sequelize.State.update(result, { where: { id: req.body.id } });
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