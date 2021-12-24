'use strict';

module.exports = function (sequelize, DataTypes) {

    const VerifyOtp = sequelize.define('VerifyOtp', {
        session_token: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        email: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        otp: {
            type: DataTypes.INTEGER(),
            allowNull: false
        },
        otp_generate_time: {
            type: DataTypes.DATE,
            allowNull: true
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        }
    }, { freezeTableName: true, name: { singular: 'VerifyOtp' } });
    return VerifyOtp
};
