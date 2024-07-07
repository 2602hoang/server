import { Sequelize } from 'sequelize';
import mysql2 from 'mysql2';
const sequelize = new Sequelize('bulbsbsafacvv5oilkfu', 'uzglsm7dg4xnna5y', 'mQDkBV5hR3iwtjJKJRCv' , {
    host: 'bulbsbsafacvv5oilkfu-mysql.services.clever-cloud.com',
    dialect: 'mysql',
    dialectModule: mysql2,
    define: {
    timestamps: false
  }
  // DB_HOST = bulbsbsafacvv5oilkfu-mysql.services.clever-cloud.com
  // DB_NAME = bulbsbsafacvv5oilkfu
  // DB_USER = uzglsm7dg4xnna5y
  // DB_PASS = mQDkBV5hR3iwtjJKJRCv
  });
  async function check() {
    try {
      await sequelize.authenticate();
      console.log('Connection has been established successfully.');
    } catch (error) {
      console.error('Unable to connect to the database:', error);
      throw error; // Re-throw the error after logging it
    }
  }
  
  export { check }; // Named export for check function
  export default sequelize;