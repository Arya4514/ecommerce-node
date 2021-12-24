var sequelize = require('../config/sequelize');
var errors = require('../config/errors');
var error = errors.errors;
const Op = sequelize.Sequelize.Op;
const helpers = require('../helpers/validations');
const logger = require('../helpers/logger').logger
const { successRes, errorsRes, validation } = require('../helpers/responseApi');

module.exports = {
    activityLog: async (req) => {
        var usersips = req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            (req.connection.socket ? req.connection.socket.remoteAddress : null);

        let ip = usersips.split(",")[0]
        console.log("Json stringify ip >> " + JSON.stringify(ip))

        var ipData = await helpers.findLocationThroughIp(ip);
        var log = {
            name: req.name,
            date: req._startTime.toString(),
            account_type: req.user_type,
            activity: req.activity,
            previous_data: req.previous_data,
            current_data: req.current_data,
            browser: req.useragent.browser,
            country: ipData.country,
            region: ipData.continent,
            state: ipData.subdivision,
            city: ipData.city,
            time_zone: ipData.time_zone,
            update_for: req.update_for,
            created_for: req.created_for
        }

        await sequelize.ActivityLog.create(log)
    }
}