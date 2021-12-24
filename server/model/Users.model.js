'use strict';

module.exports = function (sequelize, DataTypes) {

    const Users = sequelize.define('Users', {
        first_name: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        last_name: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        email: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        password: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        address: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        city_id: {
            type: DataTypes.INTEGER(),
            allowNull: true
        },
        state_id: {
            type: DataTypes.INTEGER(),
            allowNull: true
        },
        country_id: {
            type: DataTypes.INTEGER(),
            allowNull: true
        },
        role: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        user_type: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        phone: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        img: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        created_by: {
            type: DataTypes.INTEGER(),
            allowNull: true,
        },
        signup_token: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        timezone: {
            type: DataTypes.STRING,
            allowNull: true
        },
        last_login: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        is_confirmed: {
            type: DataTypes.BOOLEAN,
            allowNull: true
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            allowNull: true
        }
    });

    return Users
};
