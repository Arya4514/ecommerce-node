'use strict';

const sequelize = require('../config/sequelize');
const errors = require('../config/errors');
const error = errors.errors;
const logger = require('../helpers/logger').logger;
const { successRes, errorsRes, validation } = require('../helpers/responseApi');

module.exports = {
    getAllActivityLogs: async (req, res) => {
        sequelize.sequelize.transaction(async (t1) => {

            let data = await sequelize.ActivityLog.findAll({
                order: [['createdAt', 'DESC']],
            });

            let result = error.OK
            result.data = data

            logger.info(result)
            return res.status(200).json(successRes(result, res.statusCode));
        }).catch(async function (err) {
            logger.error(err)
            console.log(err)
            return res.status(500).json(errorsRes(error.SERVER_ERROR, res.statusCode));
        })

    },

    getActivityById: async (req, res) => {
        sequelize.sequelize.transaction(async (t1) => {

            let data = await sequelize.ActivityLog.findOne({
                where: {
                    id: req.params.id
                }
            });

            let result = error.OK
            result.data = data

            logger.info(result)
            return res.status(200).json(successRes(result, res.statusCode));
        }).catch(async function (err) {
            logger.error(err)
            console.log(err)
            return res.status(500).json(errorsRes(error.SERVER_ERROR, res.statusCode));
        })

    }
}
