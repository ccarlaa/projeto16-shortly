import connection from "../db.js"
import joi from "joi"

export async function urlsPostMiddleware(req, res, next){
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
        return
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
            return
        }
        res.locals.userId = tokenValidation.rows[0].userId
    } catch (err) {
        res.status(500).send(err)
    }
    next()
}

export async function urlsGetIdMiddleware(req, res, next) {
    const idUrl = req.params.id
    try {
        const idValidation = await connection.query(`
            SELECT 
                * 
            FROM 
                urls 
            WHERE 
                id = ($1)
        `, [idUrl])
        if(idValidation.rowCount === 0){
            res.status(404).send("Url não encontrada")
            return 
        }
        res.locals.urls = idValidation.rows[0]
    } catch (err) {
        res.status(500).send(err)
    }
    next()
}

export async function urlsGetOpenMiddleware(req, res, next){
    const { shortUrl } = req.params
    try {
        const shortUrlValidation = await connection.query(`
            SELECT 
                * 
            FROM 
                urls 
            WHERE 
                "shortUrl" = ($1)
        `, [shortUrl])
        if(shortUrlValidation.rowCount === 0){
            res.status(404).send("Url não encontrada")
            return 
        }
        res.locals.url = shortUrlValidation.rows[0]
    } catch (err) {
        res.status(500).send(err)
    }
    next()
}

export async function urlsDeleteMiddleware(req, res, next) {
    const { authorization } = req.headers
    const { id } = req.params
    const token = authorization?.replace('Bearer ', '')
    if(!token){
        res.status(401).send('Token invalido')
        return
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
            return
        }
        const requisitionValidation = await connection.query(`
            SELECT 
                urls."shortUrl", urls."userId", keys."token"
            FROM 
                urls 
            JOIN 
                keys
            ON
                urls."userId" = keys."userId"
            WHERE 
                urls."id" = ($1)
        `, [id])
        if(requisitionValidation.rowCount === 0){
            res.status(404).send("Url não encontrada")
            return 
        }
        const urlToken = requisitionValidation.rows[0].token
        if(urlToken !== token){
            res.status(401).send("Essa url não pertence a esse usuário")
            return 
        }
    } catch (err) {
        res.status(500).send(err)
    }
    next()
}