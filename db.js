import pg from "pg"
import dotenv from "dotenv"

dotenv.config()

const { Pool } = pg
const db = {
	connectionString: process.env.DATABASE_URL,
	// database: "dcsh2dhcbi0vg9",
  	username: process.env.EMAIL,
	password: process.env.PASSWORD,
}

if(process.env.MODE === "PROD"){
	db.ssl = {
		rejectUnauthorized: false
	}
}

const connection = new Pool(db)

export default connection