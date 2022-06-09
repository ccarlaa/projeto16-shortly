import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import { nanoid } from 'nanoid'

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

app.post('/signin', async (req, res) => {
    const { email, password } = req.body
    const signInSchema = joi.object({
        email: joi.string() 
            .email()
            .required(),
        password: joi.string()
            .required()
    })
    const validation = signInSchema.validate({ email, password })
    if(validation.error){
        res.status(422).send(validation.error.details[0].message)
        return
    }
    try {
        const user = await connection.query(`
            SELECT 
                * 
            FROM 
                users 
            WHERE 
                users."email" = ($1)
        `, [email])
        const userRows = user.rows[0]
        if(user.rowCount == 0){
            res.status(401).send("Usuário não encontrado")
        }
        if(bcrypt.compareSync(password, userRows.password)){
            const token = uuid()
            const id = userRows.id
            console.log(id + " --- " + token)
            await connection.query(`
                INSERT INTO 
                    keys ("userId", token) 
                VALUES 
                    ($1, $2)
            `, [id, token])
            const infos = {
                name: userRows.name,
                token
            }
            res.status(201).send(infos)
        } else {
            res.status(401).send('Senha incorreta')
            return 
        }
    } catch (err) {
        res.status(500).send(err)
    }
})

app.post('/urls/shorten', async (req, res) => {
    const { authorization } = req.headers
    const { url } = req.body
    const urlSchema = joi.object({
        url: joi.string()
            .uri()
            .required()
    })
    const urlValidation = urlSchema.validate({url})
    if(urlValidation.error){
		res.status(422).send(urlValidation.error.details[0].message)
        return
    }
    const token = authorization?.replace('Bearer ', '')
    if(!token){
        res.status(401).send('Token invalido')
        return;
    }

    try {
        const tokenValidation = await connection.query(`
            SELECT 
                * 
            FROM 
                keys 
            WHERE 
                keys."token" = ($1)
        `, [token])
        if(tokenValidation.rowCount == 0){
            res.status(401).send("Token não encontrado")
        }
        const userId = tokenValidation.rows[0].userId
        const shortUrl = nanoid(8)
        await connection.query(`
            INSERT INTO 
                urls ("userId", url, "shortUrl") 
            VALUES 
                ($1, $2, $3)
        `, [userId, url, shortUrl])
        res.status(201).send({shortUrl: shortUrl})
    } catch (err) {
        res.status(500).send(err)
    }
})


const port = process.env.PORT
app.listen(port, () => {
    console.log(`|-----------------------------------|`)
    console.log(`| Running at http://localhost:${port}  |`)
    console.log(`|-----------------------------------|`)
})