import pg from "pg";
import { DB_USER, DB_HOST, DB_PASSWORD, DB_NAME } from "../../config/variables.js";

export const pool = new pg.Pool({
    user: DB_USER,
    host: DB_HOST,
    password: DB_PASSWORD,
    database: DB_NAME,
    port: '5432'
})