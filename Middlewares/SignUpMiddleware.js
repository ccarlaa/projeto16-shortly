import connection from "../db.js"
import joi from "joi"

export async function signUpMiddleware(req, res, next){
    const { email, password } = req.body
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
    } catch (err) {
        res.status(500).send(err);
    }
    next()
}