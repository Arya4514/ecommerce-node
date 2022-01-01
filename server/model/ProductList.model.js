'use strict';

module.exports = function (sequelize, DataTypes) {

    const ProductList = sequelize.define('Product', {
        name: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        slug: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        color: {
            type: DataTypes.JSON,
            allowNull: true
        },
        size: {
            type: DataTypes.JSON,
            allowNull: true
        },
        image: {
            type: DataTypes.JSON,
            allowNull: true
        },
        brand: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        instruction: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        quantity: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        seller_id: {
            type: DataTypes.INTEGER(),
            allowNull: false,
            references: {
                model: 'Users',
                key: 'id'
            }
        },
        category_id: {
            type: DataTypes.INTEGER(),
            allowNull: false,
            references: {
                model: 'Category',
                key: 'id'
            }
        },
        stock: {
            type: DataTypes.JSON,
            allowNull: true
        },
        price: {
            type: DataTypes.STRING,
            allowNull: true
        }
    });
    return ProductList
};
