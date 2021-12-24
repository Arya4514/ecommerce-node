var bcrypt = require("bcryptjs");
const fse = require('fs-extra');
const path = require("path");
const role = require("./role");
const userType = require("./userType");

const initial = async () => {
    try {
        var sequelize = require('../config/sequelize');

        var WorldCountry = await sequelize.Country.findAll();
        if (WorldCountry.length === 0) {
            let configFile = path.join(__dirname, "../../country-data/countries.json")
            let data = await fse.readJson(configFile);
            WorldCountry = await sequelize.Country.bulkCreate(data)
            await sequelize.Country.update({ is_active: true }, {
                where: {
                    is_active: null
                }
            })
        }
        console.log("WorldCountry Data is Added")

        var WorldState = await sequelize.State.findAll();
        if (WorldState.length === 0) {
            let configFile = path.join(__dirname, "../../country-data/states.json")
            let data = await fse.readJson(configFile);
            WorldState = await sequelize.State.bulkCreate(data)
            await sequelize.State.update({ is_active: true }, {
                where: {
                    is_active: null
                }
            })
        }
        console.log("WorldState Data is Added")

        var WorldCities = await sequelize.City.findAll();
        if (WorldCities.length === 0) {
            let configFile = path.join(__dirname, "../../country-data/cities.json")
            let data = await fse.readJson(configFile);
            WorldCities = await sequelize.City.bulkCreate(data)
            await sequelize.City.update({ is_active: true }, {
                where: {
                    is_active: null
                }
            })
        }

        console.log("Station Data is Added")
        var User = await sequelize.Users.findOne({ where: { email: "admin@gmail.com" } });
        if (!User) {

            await sequelize.Users.create({
                first_name: "Super",
                last_name: "Admin",
                user_name: "admin",
                email: "admin@gmail.com",
                city_id: '134096',
                state_id: '4030',
                country_id: '101',
                role: role.SUPER_ADMIN,
                user_type: userType.SUPER_ADMIN,
                phone: "1234567891",
                address: "322 silver bussiness hub",
                password: bcrypt.hashSync("admin", 10),
                is_active: "true",
                personal_pin: "123456",
                is_confirmed: "true",
                signup_token: new Date().getTime()
            });

        }
    } catch (e) {
        console.log("error", e)
    }
}

var seedData = {
    initial
}

module.exports = seedData