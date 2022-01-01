'use strict';

var sequelize = require('../config/sequelize');
var errors = require('../config/errors');
var error = errors.errors;
const logger = require('../helpers/logger').logger;
const activityLog = require('../helpers/activitylog');
const { successRes, errorsRes, validation } = require('../helpers/responseApi');

module.exports = {

    createCategory: async (req, res) => {

        sequelize.sequelize.transaction(async (t1) => {

            if (!req.body.name) {
                logger.warn(error.MANDATORY_FIELDS);
                return res.status(401).json(errorsRes(error.MANDATORY_FIELDS, res.statusCode));
            }
            req.body.is_active = true

            let Category = await sequelize.Category.findOne({
                where: {
                    name: req.body.name
                }, attributes: { exclude: ['token', 'sessiontoken'] }
            });
            if (!Category) {
                Category = await sequelize.Category.create(req.body);

                let result = error.OK;
                result.data = Category;
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

    getCategory: async (req, res) => {

        sequelize.sequelize.transaction(async (t1) => {
            let Category = await sequelize.Category.findAll({
                order: [['updatedAt', 'DESC']],
            });

            let result = error.OK;
            result.data = Category;

            logger.info(result);
            return res.status(200).json(successRes(result, res.statusCode));
        }).catch(async function (err) {
            logger.error(err);
            console.log(err)
            return res.status(500).json(errorsRes(error.SERVER_ERROR, res.statusCode));
        });

    },

    getCategoryById: async (req, res) => {

        sequelize.sequelize.transaction(async (t1) => {

            let Category = await sequelize.Category.findOne({
                where: {
                    id: req.params.id
                },
                attributes: { exclude: ['token', 'sessiontoken'] }
            });

            let result = error.OK;
            result.data = Category;

            logger.info(result);
            return res.status(200).json(successRes(result, res.statusCode));
        }).catch(async function (err) {
            logger.error(err);
            return res.status(500).json(errorsRes(error.SERVER_ERROR, res.statusCode));
        });
    },

    editCategory: async (req, res) => {

        sequelize.sequelize.transaction(async (t1) => {

            if (!req.body.name) {
                logger.warn(error.MANDATORY_FIELDS);
                return res.status(401).json(errorsRes(error.MANDATORY_FIELDS, res.statusCode));
            }

            let id = req.body.id;

            let checkCategory = await sequelize.Category.findOne({
                where: {
                    id: id,
                },
                attributes: { exclude: ['token', 'sessiontoken'] }
            })
            checkCategory = checkCategory.get();
            if (checkCategory) {
                let Category = await sequelize.Category.update(req.body, {
                    where: {
                        id: id
                    },
                    returning: true, plain: true
                });

                let result = error.OK;
                result.data = Category;

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

    updateCategoryStatus: async (req, res) => {
        if (!req.body.id || !req.body.status) {
            return res.status(422).json(errorsRes(error.MANDATORY_FIELDS, res.statusCode));
        }

        sequelize.sequelize.transaction(async (t1) => {

            let data = await sequelize.Category.findOne({
                where: {
                    id: req.body.id
                },
                attributes: { exclude: ['token', 'sessiontoken'] }
            });

            if (data) {

                let result = {};
                result.is_active = req.body.status;

                await sequelize.Category.update(result, { where: { id: req.body.id } });
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