
import { MySQLConnection } from './mysql.connection';
import { Pool } from 'mysql2/promise';

export abstract class MySQLRepository {
  protected pool: Pool;

  constructor() {
    this.pool = MySQLConnection.getInstance().getPool();
  }

  protected async query<T>(sql: string, params?: any[]): Promise<T> {
    const [rows] = await this.pool.query(sql, params);
    return rows as T;
  }

  protected async execute(sql: string, params?: any[]): Promise<any> {
    const [result] = await this.pool.execute(sql, params);
    return result;
  }
}