'use strict';

var sequelize = require('../config/sequelize');
var errors = require('../config/errors');
var error = errors.errors;
const logger = require('../helpers/logger').logger;
const activityLog = require('../helpers/activitylog');
const { successRes, errorsRes, validation } = require('../helpers/responseApi');

module.exports = {

    createProduct: async (req, res) => {

        sequelize.sequelize.transaction(async (t1) => {

            if (!req.body.name) {
                logger.warn(error.MANDATORY_FIELDS);
                return res.status(401).json(errorsRes(error.MANDATORY_FIELDS, res.statusCode));
            }
            req.body.is_active = true

            let Product = await sequelize.Product.findOne({
                where: {
                    name: req.body.name
                },
                attributes: { exclude: ['token', 'sessiontoken'] }
            });
            if (!Product) {
                Product = await sequelize.Product.create(req.body, {
                    attributes: { exclude: ['token', 'sessiontoken'] }
                });


                // req.name = req.userDetails.first_name + " " + req.userDetails.last_name
                // req.user_type = req.userDetails.user_type
                // req.activity = `${req.userDetails.first_name + " " + req.userDetails.last_name} created city ${City.name}`
                // await activityLog.activityLog(req)

                let result = error.OK;
                result.data = Product;
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

    getProduct: async (req, res) => {

        sequelize.sequelize.transaction(async (t1) => {
            let Product = await sequelize.Product.findAll({
                attributes: {
                    exclude:
                        ['token', 'sessiontoken']
                },
                order: [['updatedAt', 'DESC']]
            });

            if (Product.length == 0) {
                return res.status(401).json(errorsRes(error.DATA_NOT_FOUND, res.statusCode));
            }

            let result = error.OK;
            result.data = Product;

            logger.info(result);
            return res.status(200).json(successRes(result, res.statusCode));
        }).catch(async function (err) {
            logger.error(err);
            return res.status(500).json(errorsRes(error.SERVER_ERROR, res.statusCode));
        });

    },

    getProductById: async (req, res) => {

        sequelize.sequelize.transaction(async (t1) => {

            let Product = await sequelize.Product.findOne({
                where: {
                    id: req.params.id
                },
                attributes: { exclude: ['token', 'sessiontoken'] }
            });

            if (!Product) {
                return res.status(401).json(errorsRes(error.DATA_NOT_FOUND, res.statusCode));
            }

            let result = error.OK;
            result.data = Product;

            logger.info(result);
            return res.status(200).json(successRes(result, res.statusCode));
        }).catch(async function (err) {
            logger.error(err);
            return res.status(500).json(errorsRes(error.SERVER_ERROR, res.statusCode));
        });
    },

    editProduct: async (req, res) => {

        sequelize.sequelize.transaction(async (t1) => {

            if (!req.body.name) {
                logger.warn(error.MANDATORY_FIELDS);
                return res.status(401).json(errorsRes(error.MANDATORY_FIELDS, res.statusCode));
            }

            let id = req.body.id;

            let checkProduct = await sequelize.Product.findOne({
                where: {
                    id: id,
                },
                attributes: { exclude: ['token', 'sessiontoken'] }
            })
            checkProduct = checkProduct.get();
            if (checkProduct) {

                let Product = await sequelize.Product.update(req.body, {
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
                result.data = Product;

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

    updateProductStatus: async (req, res) => {
        if (!req.body.id || !req.body.status) {
            return res.status(422).json(errorsRes(error.MANDATORY_FIELDS, res.statusCode));
        }

        sequelize.sequelize.transaction(async (t1) => {

            if (req.body.status == "false") {
                req.body.status = false
            } else if (req.body.status == "true") {
                req.body.status = true
            }

            let data = await sequelize.Product.findOne({
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

                await sequelize.Product.update(result, { where: { id: req.body.id } });
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