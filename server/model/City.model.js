'use strict';

module.exports = function (sequelize, DataTypes) {

    const City = sequelize.define('City', {
        name: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        state_id: {
            type: DataTypes.INTEGER(),
            allowNull: true,
            references: {
                model: 'State',
                key: 'id'
            }
        },
        state_code: {
            type: DataTypes.STRING,
            allowNull: true
        },
        country_id: {
            type: DataTypes.INTEGER(),
            allowNull: true
        },
        country_code: {
            type: DataTypes.STRING,
            allowNull: true
        },
        latitude: {
            type: DataTypes.STRING,
            allowNull: true
        },
        longitude: {
            type: DataTypes.STRING,
            allowNull: true
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            allowNull: true
        }
    });
    return City
};
