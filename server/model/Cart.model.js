'use strict';

module.exports = function (sequelize, DataTypes) {

    const Cart = sequelize.define('Cart', {
        user_id: {
            type: DataTypes.INTEGER(),
            allowNull: false,
            references: {
                model: 'Users',
                key: 'id'
            }
        },
        products: {
            type: DataTypes.JSON,
            allowNull: true
        }
    });
    return Cart
};
