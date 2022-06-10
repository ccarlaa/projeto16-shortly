import connection from "../db.js"
import { v4 as uuid } from 'uuid';

export async function signInController(req, res) {
    const { user } = res.locals
    try {
        const token = uuid()
        const id = user.id
        await connection.query(`
            INSERT INTO 
                keys ("userId", token) 
            VALUES 
                ($1, $2)
        `, [id, token])
        const infos = {
            name: user.name,
            token
        }
        res.status(201).send(infos)
    } catch (err) {
        res.status(500).send(err)
    }
}