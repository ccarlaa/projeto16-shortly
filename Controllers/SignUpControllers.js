import connection from "../db.js"
import bcrypt from 'bcrypt'

export async function signUpController(req, res) {
    const { name, email, password } = req.body
    try {
        const passwordHash = bcrypt.hashSync(password,10);
        await connection.query(`
            INSERT INTO 
                users (name, email, password) 
            VALUES 
                ($1, $2, $3)
        `, [name, email, passwordHash])
        res.status(201).send('Cadastro realizado com sucesso');
    } catch (err) {
        res.status(500).send(err);
    }
}