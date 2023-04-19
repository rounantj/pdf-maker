import MySQLConnection from "../core/sequelize";

export async function getconn() {
    const connection = new MySQLConnection();
    await connection.connect();
    await connection.createLocalsModel();
  }