import pg from "pg"
import dotenv from "dotenv"

dotenv.config()

const { Pool } = pg
const db = {
  	user: "postgres",
	password: process.env.PASSWORD,
	database: "shortly"
}

const connection = new Pool(db)

export default connection