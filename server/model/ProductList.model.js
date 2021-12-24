'use strict';

module.exports = function (sequelize, DataTypes) {

    const ProductList = sequelize.define('ProductList', {
        name: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        disclaimer: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            allowNull: true
        }
    });
    return ProductList
};
