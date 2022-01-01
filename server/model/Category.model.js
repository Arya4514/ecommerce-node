'use strict';

module.exports = function (sequelize, DataTypes) {

    const Category = sequelize.define('Category', {
        name: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            allowNull: true
        }
    });
    return Category
};
