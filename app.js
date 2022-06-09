import express from "express"
import cors from "cors"
import dotenv from "dotenv"

const app = express()
app.use(express.json())
app.use(cors())

dotenv.config()

import connection from "./db.js"
import { v4 as uuid } from 'uuid';
import bcrypt from 'bcrypt';
import joi from "joi";

app.post('/signup', async (req, res) => {
    const { name, email, password } = req.body
    const signUpSchema = joi.object({
        name: joi.string() 
        .required(),
        email: joi.string() 
            .email()
            .required(),
        password: joi.string()
            .min(4)
            .pattern(/^[0-9a-zA-Z$*&_/@#]{4,}$/)
            .required(),
        confirmPassword: joi.valid(password)
            .required()
    })
    const validation = signUpSchema.validate(req.body)
    if(validation.error){
        res.status(422).send(validation.error.details[0].message);
        return
    }
    try {
        const repetedUser = await connection.query(`
            SELECT 
                * 
            FROM 
                users 
            WHERE 
                email = ($1)
        `, [email])
        if(repetedUser.rowCount !== 0) {
            res.status(422).send("Já existe um usuário cadastrado com esse email");
            return
        }
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
})


const port = process.env.PORT
app.listen(port, () => {
    console.log(`|-----------------------------------|`)
    console.log(`| Running at http://localhost:${port}  |`)
    console.log(`|-----------------------------------|`)
})