import { config } from "dotenv";

config()

export const {
    PORT,
    DB_USER,
    DB_HOST,
    DB_PASSWORD,
    DB_NAME,
    SECRET_JWT_KEY,
    SECRET_JWT_REFRESH_KEY
} = process.env