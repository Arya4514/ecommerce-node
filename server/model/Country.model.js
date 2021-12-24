'use strict';

module.exports = function (sequelize, DataTypes) {

    const Country = sequelize.define('Country', {
        name: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        iso3: {
            type: DataTypes.STRING,
            allowNull: true
        },
        iso2: {
            type: DataTypes.STRING,
            allowNull: true
        },
        phone_code: {
            type: DataTypes.STRING,
            allowNull: true
        },
        capital: {
            type: DataTypes.STRING,
            allowNull: true
        },
        currency: {
            type: DataTypes.STRING,
            allowNull: true
        },
        native: {
            type: DataTypes.STRING,
            allowNull: true
        },
        region: {
            type: DataTypes.STRING,
            allowNull: true
        },
        subregion: {
            type: DataTypes.STRING,
            allowNull: true
        },
        timezones: {
            type: DataTypes.JSON,
            allowNull: true
        },
        emoji: {
            type: DataTypes.STRING,
            allowNull: true
        },
        emojiU: {
            type: DataTypes.STRING,
            allowNull: true
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            allowNull: true
        }
    });

    return Country

};
