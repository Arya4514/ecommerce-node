'use strict';

module.exports = function (sequelize, DataTypes) {

    const State = sequelize.define('State', {
        name: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        country_id: {
            type: DataTypes.INTEGER(),
            allowNull: true,
            references: {
                model: 'Country',
                key: 'id'
            }
        },
        state_code: {
            type: DataTypes.STRING,
            allowNull: true
        },
        country_code: {
            type: DataTypes.STRING,
            allowNull: true
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            allowNull: true
        }
    });

    return State

};
