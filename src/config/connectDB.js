import { Sequelize } from "sequelize";
import mysql2 from "mysql2";
const sequelize = new Sequelize(
  "data",
  "avnadmin",
  "AVNS_2jYKgBWgypVw5jQ92Mv",
  {
    host: "mysql-7048c9d-vuhuyhoanglol-2001.d.aivencloud.com",
    port: 21062,
    dialect: "mysql",
    dialectModule: mysql2,
    define: {
      timestamps: false,
    },
  }
);
async function check() {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
    throw error; // Re-throw the error after logging it
  }
}
export { check };
export default sequelize;
