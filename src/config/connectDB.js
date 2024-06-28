import { Sequelize } from 'sequelize';
import mysql2 from 'mysql2';
const sequelize = new Sequelize('data', 'root', null , {
    host: 'localhost',
    dialect: 'mysql',
    dialectModule: mysql2,
    define: {
    timestamps: false
  }
    
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