import { DataTypes, Sequelize } from "sequelize";

class MySQLConnection {
  private readonly host: string;
  private readonly port: number;
  private readonly username: string;
  private readonly password: string;
  private readonly database: string;
  private sequelize: Sequelize;
  private LocalsModel: any;

  constructor() {
    this.host = process.env.DB_HOST || "localhost";
    this.port = Number(process.env.DB_PORT) || 3306;
    this.username = process.env.DB_USER || "root";
    this.password = process.env.DB_PASS || "";
    this.database = process.env.DB_NAME || "almox_wli";

    this.sequelize = new Sequelize(
      this.database,
      this.username,
      this.password,
      {
        host: this.host,
        port: this.port,
        dialect: "mysql",
      }
    );
    this.LocalsModel = this.sequelize.define("locals", {
      sector_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      sector_locals: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
    });
  }

  public async connect(): Promise<void> {
    try {
      await this.sequelize.authenticate();
      console.log("Connection has been established successfully.");
    } catch (error) {
      console.error("Unable to connect to the database:", error);
    }
  }

  public async updateLocal(
    localId: number | undefined,
    updates: { sector_name?: string; sector_locals?: string }
  ): Promise<void> {
    try {
      const Local = this.LocalsModel;
      let localToUpdate;

      if (localId) {
        localToUpdate = await Local.findByPk(localId);
      }
      if (updates.sector_name) {
        localToUpdate = await Local.findOne({
          where: { sector_name: updates.sector_name },
        });
      }

      if (!localToUpdate) {
        localToUpdate = await Local.create(updates);
      } else {
        await localToUpdate.update(updates);
      }
    } catch (error) {
      console.error(`Error updating local with id ${localId}:`, error);
    }
  }

  public async getLocals(): Promise<any> {
    try {
      const Local = this.LocalsModel;
      const data = await Local.findAll();
      return data;
    } catch (error) {
      console.error(`Error gettinf `, error);
    }
  }

  public async createLocalsModel(): Promise<void> {
    await this.sequelize.sync();
  }
}

export default MySQLConnection;
