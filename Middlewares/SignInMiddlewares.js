import connection from "../db.js"
import joi from "joi"
import bcrypt from 'bcrypt'

export async function signInMiddleware(req, res, next) {
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
            res.locals.user = userRows
        } else {
            res.status(401).send('Senha incorreta')
            return 
        }
    } catch (err) {
        res.status(500).send(err)
    }
    next()
}
