import { createPool, Pool } from 'mysql2/promise';
import { databaseConfig } from '../../config/database.config';

export class MySQLConnection {
  private static instance: MySQLConnection;
  private pool: Pool;

  private constructor() {
    this.pool = createPool(databaseConfig);
  }

  public static getInstance(): MySQLConnection {
    if (!MySQLConnection.instance) {
      MySQLConnection.instance = new MySQLConnection();
    }
    return MySQLConnection.instance;
  }

  public getConnection(): Pool {
    return this.pool;
  }

  public getPool(): Pool {
    return this.pool;
  }
}