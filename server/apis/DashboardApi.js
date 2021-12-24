'use strict';

var sequelize = require('../config/sequelize');
const Op = sequelize.Sequelize.Op;
var errors = require('../config/errors');
var error = errors.errors;
const logger = require('../helpers/logger').logger;
const { successRes, errorsRes, validation } = require('../helpers/responseApi');

module.exports = {
    totalStation: async (req, res) => {

        sequelize.sequelize.transaction(async (t1) => {
            let stations = await sequelize.Stations.count({
                where: { [Op.not]: [{ type: "SUPER_ORGANIZATION" }] },
                attributes: { exclude: ['token', 'sessiontoken'] }
            });

            let result = error.OK;
            result.data = stations

            logger.info(result);
            return res.status(200).json(successRes(result, res.statusCode));
        }).catch(async function (err) {
            logger.error(err);
            return res.status(500).json(errorsRes(error.SERVER_ERROR, res.statusCode));
        })

    },

    totalGasolineEntryReports: async (req, res) => {

        sequelize.sequelize.transaction(async (t1) => {
            if (req.userDetails.role_name === "ADMIN") {
                let gasolineEntry = await sequelize.GasolineEntry.count({
                    attributes: { exclude: ['token', 'sessiontoken'] }
                });

                let result = error.OK;
                result.data = gasolineEntry

                logger.info(result);
                return res.status(200).json(successRes(result, res.statusCode));
            } else if (req.userDetails.role_name === "USER") {

                let gasolineEntry = await sequelize.GasolineEntry.count({
                    where: {
                        user_id: req.userDetails.id
                    },
                    attributes: { exclude: ['token', 'sessiontoken'] }
                });

                let result = error.OK;
                result.data = gasolineEntry

                logger.info(result);
                return res.status(200).json(successRes(result, res.statusCode));
            }
        }).catch(async function (err) {
            logger.error(err);
            return res.status(500).json(errorsRes(error.SERVER_ERROR, res.statusCode));
        })

    },

    totalPendingGasolineEntryReports: async (req, res) => {

        sequelize.sequelize.transaction(async (t1) => {
            if (req.userDetails.role_name === "ADMIN") {
                let gasolineEntry = await sequelize.GasolineEntry.count({
                    where: { report_status: "pending" },
                    attributes: { exclude: ['token', 'sessiontoken'] }
                });

                let result = error.OK;
                result.data = gasolineEntry

                logger.info(result);
                return res.status(200).json(successRes(result, res.statusCode));
            } else if (req.userDetails.role_name === "USER") {

                let gasolineEntry = await sequelize.GasolineEntry.count({
                    where: {
                        user_id: req.userDetails.id,
                        report_status: "pending"
                    },
                    attributes: { exclude: ['token', 'sessiontoken'] }
                });

                let result = error.OK;
                result.data = gasolineEntry

                logger.info(result);
                return res.status(200).json(successRes(result, res.statusCode));
            }
        }).catch(async function (err) {
            logger.error(err);
            return res.status(500).json(errorsRes(error.SERVER_ERROR, res.statusCode));
        })

    },

    totalVerifiedGasolineEntryReports: async (req, res) => {

        sequelize.sequelize.transaction(async (t1) => {
            let gasolineEntry = await sequelize.GasolineEntry.count({
                where: { report_status: "approved" },
                attributes: { exclude: ['token', 'sessiontoken'] }
            });

            let result = error.OK;
            result.data = gasolineEntry

            logger.info(result);
            return res.status(200).json(successRes(result, res.statusCode));
        }).catch(async function (err) {
            logger.error(err);
            return res.status(500).json(errorsRes(error.SERVER_ERROR, res.statusCode));
        })

    },

    totalRejectededGasolineEntryReports: async (req, res) => {

        sequelize.sequelize.transaction(async (t1) => {
            if (req.userDetails.role_name === "ADMIN") {
                let gasolineEntry = await sequelize.GasolineEntry.count({
                    where: { report_status: "rejected" },
                    attributes: { exclude: ['token', 'sessiontoken'] }
                });

                let result = error.OK;
                result.data = gasolineEntry

                logger.info(result);
                return res.status(200).json(successRes(result, res.statusCode));
            } else if (req.userDetails.role_name === "USER") {

                let gasolineEntry = await sequelize.GasolineEntry.count({
                    where: {
                        user_id: req.userDetails.id,
                        report_status: "rejected"
                    },
                    attributes: { exclude: ['token', 'sessiontoken'] }
                });

                let result = error.OK;
                result.data = gasolineEntry

                logger.info(result);
                return res.status(200).json(successRes(result, res.statusCode));
            }
        }).catch(async function (err) {
            logger.error(err);
            return res.status(500).json(errorsRes(error.SERVER_ERROR, res.statusCode));
        })
    },

    totalUsers: async (req, res) => {

        sequelize.sequelize.transaction(async (t1) => {
            let users = await sequelize.Users.count({
                attributes: { exclude: ['token', 'sessiontoken'] }
            });

            let result = error.OK;
            result.data = users

            logger.info(result);
            return res.status(200).json(successRes(result, res.statusCode));
        }).catch(async function (err) {
            logger.error(err);
            return res.status(500).json(errorsRes(error.SERVER_ERROR, res.statusCode));
        })

    },

    getLastEnteredGasolineData: async (req, res) => {

        sequelize.sequelize.transaction(async (t1) => {
            let data = await sequelize.GasolineEntry.findAll({
                attributes: { exclude: ['token', 'sessiontoken'] },
                include: [
                    {
                        model: sequelize.GasolineReportData,
                        as: 'GasolineReportData'
                    },
                    sequelize.Stations,
                    sequelize.DailyGasolineMeterAnalysisDiesel,
                    sequelize.DailyGasolineMeterAnalysisUnleadedSuper,
                    sequelize.DailyGasolineMeterAnalysisUnleadedRegular,
                    sequelize.UnleadedPlusDailyGasolineMeterAnalysis,
                    sequelize.DailyGasolineMeterAnalysisKerosene,
                    sequelize.DailyGasolineMeterAnalysisUnleadedUltra,
                    sequelize.GasolineReconcilationUnleadedRegular,
                    sequelize.GasolineReconcilationUnleadedPremium,
                    sequelize.GasolineReconcilationUnleadedUltra,
                    sequelize.GasolineReconcilationDiesel,
                    sequelize.GasolineReconcilationKerosene,
                    sequelize.GasolineSalesJounral,
                    sequelize.GasolineExpenseJournal

                ],
                order: [['date', 'DESC']],
                limit: 1
            });
            let result = error.OK
            result.data = data

            logger.info(result);
            return res.status(200).json(successRes(result, res.statusCode));
        }).catch(async function (err) {
            logger.warn(err)
            console.log(err)
            return res.status(500).json(errorsRes(error.SERVER_ERROR, res.statusCode));
        });

    }
}
