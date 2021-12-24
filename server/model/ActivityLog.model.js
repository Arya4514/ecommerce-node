'use strict';

module.exports = function (sequelize, DataTypes) {

    const ActivityLog = sequelize.define('ActivityLog', {
        name: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        date: {
            type: DataTypes.STRING,
            allowNull: true
        },
        account_type: {
            type: DataTypes.STRING,
            allowNull: true
        },
        activity: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        previous_data: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        update_for: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        created_for: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        current_data: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        browser: {
            type: DataTypes.STRING,
            allowNull: true
        },
        country: {
            type: DataTypes.STRING,
            allowNull: true
        },
        region: {
            type: DataTypes.STRING,
            allowNull: true
        },
        state: {
            type: DataTypes.STRING,
            allowNull: true
        },
        city: {
            type: DataTypes.STRING,
            allowNull: true
        },
        time_zone: {
            type: DataTypes.STRING,
            allowNull: true
        }
    });
    return ActivityLog
};
