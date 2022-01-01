const faker = require('faker');
const sequelize = require('./server/config/sequelize');
var slugify = require('slugify');

const data = async () => {
    let products = []
    for (let index = 0; index < 100; index++) {
        let product = {
            "name": faker.commerce.productName(),
            "description": faker.commerce.productDescription(),
            "color": [faker.commerce.color(), faker.commerce.color(), faker.commerce.color()],
            "size": [faker.datatype.number(10), faker.datatype.number(10), faker.datatype.number(10)],
            "image": [faker.image.food(), faker.image.food(), faker.image.food()],
            "category_id": faker.random.arrayElement([1, 2, 3, 4]),
            "quantity": "150",
            "seller_id": "1",
            "stock": "105",
            "price": faker.commerce.price(150, 1000, 00, "$")
        }
        product.slug = slugify(product.name)

        console.log(product)
        products.push(product);
    }

    let data = [
        {
            name: "cloth"
        },
        {
            name: "kids"
        },
        {
            name: "mens"
        },
        {
            name: "womens"
        }
    ]
    // await sequelize.Category.bulkCreate(data);
    await sequelize.Product.bulkCreate(products);
}
data()