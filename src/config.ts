import dotenv from "dotenv";
dotenv.config();

// const DATABASE_URL_TEST = process.env.DATABASE_URL_TEST;
const DATABASE_URL = process.env.DATABASE_URL;
const JWT_SECRET = process.env.JWT_SECRET;
export const saltRounds = 10;
export const PORT = 3000;

if (!JWT_SECRET) {
  throw new Error("Error fetching JWT_SECRET from environment variables");
}

if (!DATABASE_URL) {
  throw new Error("Error fetching DATABASE URL from environment variables");
}

export const DATABASE_URL_STR: string = DATABASE_URL;
export const JWT_SECRET_STR: string = JWT_SECRET;
