'use strict';
const Sequelize = require('sequelize');
const cls = require('cls-hooked');
const namespace = cls.createNamespace('my-very-own-namespace');
Sequelize.useCLS(namespace);
const config = require("../environments/index");
const seedData = require('../helpers/seedData');

/** 
 *  server connection settings
 */

var sequelize = new Sequelize(config.DB.database, config.DB.username, config.DB.password, {
  host: config.DB.host,
  dialect: config.DB.dialect,
  define: {
    timestamps: true,
    freezeTableName: true
  },
  logging: false
});


// var sequelize = new Sequelize(config.DB.database, config.DB.username, config.DB.password, {
//   host: config.DB.host,
//   dialect: config.DB.dialect,
//   operatorsAliases: false,
//   logging: false
// });


const db = {};

db.sequelize = sequelize;
db.Sequelize = Sequelize;


/**
 * checks the database connectivity
 */

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

/** 
 * create and connect theconnnect modal instance to database
 */

db.Users = require('../model/Users.model')(sequelize, Sequelize);
db.Country = require('../model/Country.model')(sequelize, Sequelize);
db.State = require('../model/State.model')(sequelize, Sequelize);
db.City = require('../model/City.model')(sequelize, Sequelize);
db.VerifyOtp = require('../model/VerifyOtp.model')(sequelize, Sequelize);
db.ActivityLog = require('../model/ActivityLog.model')(sequelize, Sequelize);
db.Product = require('../model/ProductList.model')(sequelize, Sequelize);

/**
 * Table Relations
 */

db.State.belongsTo(db.Country, { foreignKey: 'country_id', targetKey: 'id' });
db.City.belongsTo(db.Country, { foreignKey: 'country_id', targetKey: 'id' });
db.City.belongsTo(db.State, { foreignKey: 'state_id', targetKey: 'id' });

db.Users.belongsTo(db.City, { onDelete: "cascade", foreignKey: "city_id" });

db.sequelize.sync({ force: false, alter: true }).then(async (data) => {
  console.log("Drop and re-sync db.");
  seedData.initial();
}).catch(err => console.log(err));;

module.exports = db;
