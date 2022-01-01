'use strict';

var sequelize = require('../config/sequelize');
var errors = require('../config/errors');
var error = errors.errors;
const logger = require('../helpers/logger').logger;
const activityLog = require('../helpers/activitylog');
const { successRes, errorsRes, validation } = require('../helpers/responseApi');

module.exports = {

    createCart: async (req, res) => {

        sequelize.sequelize.transaction(async (t1) => {

            if (!req.userDetails.id || !req.body.products) {
                logger.warn(error.MANDATORY_FIELDS);
                return res.status(401).json(errorsRes(error.MANDATORY_FIELDS, res.statusCode));
            }

            let Cart = await sequelize.Cart.findOne({
                where: {
                    user_id: req.userDetails.id
                }, attributes: { exclude: ['token', 'sessiontoken'] }
            });
            if (!Cart) {
                req.body.user_id = req.userDetails.id
                Cart = await sequelize.Cart.create(req.body);

                let result = error.OK;
                result.data = Cart;
                logger.info(result);
                return res.status(200).json(successRes(result, res.statusCode));

            } else {
                let result = error.OK;
                result.data = Cart;
                logger.info(result);
                return res.status(200).json(successRes(result, res.statusCode));
            }
        }).catch(async function (err) {
            logger.error(err);
            console.log(err)
            return res.status(500).json(errorsRes(error.SERVER_ERROR, res.statusCode));
        });
    },

    getCartByUserId: async (req, res) => {

        sequelize.sequelize.transaction(async (t1) => {
            let Cart = await sequelize.Cart.findAll({
                where: {
                    user_id: req.userDetails.id
                },
                attributes: {
                    exclude:
                        ['token', 'sessiontoken']
                },
                order: [['updatedAt', 'DESC']],
            });

            let result = error.OK;
            result.data = Cart;

            logger.info(result);
            return res.status(200).json(successRes(result, res.statusCode));
        }).catch(async function (err) {
            logger.error(err);
            console.log(err)
            return res.status(500).json(errorsRes(error.SERVER_ERROR, res.statusCode));
        });

    },

    getCartById: async (req, res) => {

        sequelize.sequelize.transaction(async (t1) => {

            let Cart = await sequelize.Cart.findOne({
                where: {
                    id: req.params.id,
                    is_active: true
                },
                attributes: { exclude: ['token', 'sessiontoken'] }
            });

            let result = error.OK;
            result.data = Cart;

            logger.info(result);
            return res.status(200).json(successRes(result, res.statusCode));
        }).catch(async function (err) {
            logger.error(err);
            return res.status(500).json(errorsRes(error.SERVER_ERROR, res.statusCode));
        });
    },

    editCart: async (req, res) => {

        sequelize.sequelize.transaction(async (t1) => {

            if (!req.userDetails.id) {
                logger.warn(error.MANDATORY_FIELDS);
                return res.status(401).json(errorsRes(error.MANDATORY_FIELDS, res.statusCode));
            }

            let user_id = req.userDetails.id;

            let checkCart = await sequelize.Cart.findOne({
                where: {
                    user_id: user_id,
                },
                attributes: { exclude: ['token', 'sessiontoken'] }
            })

            if (checkCart) {
                let Cart = await sequelize.Cart.update(req.body, {
                    where: {
                        user_id: user_id
                    }
                });

                let result = error.OK;
                result.data = Cart;

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
    }
}