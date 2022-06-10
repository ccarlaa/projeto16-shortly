import connection from "../db.js"
import { nanoid } from 'nanoid'

export async function urlsPostController(req, res){
    const { userId } = res.locals
    const { url } = req.body
    try {
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
}

export async function urlsGetIdController(req, res){
    const { id, shortUrl, url } = res.locals.urls
    try {
        const answer = {
            id,
            shortUrl,
            url
        }
        res.status(200).send(answer) 
    } catch (err) {
        res.status(500).send(err)
    }
}

export async function urlsGetOpenController(req, res){
    const { url } = res.locals.url
    const { shortUrl } = req.params
    try {
        await connection.query(`
            UPDATE 
                urls 
            SET 
                views = (views + 1)
            WHERE 
                "shortUrl" = ($1)
        `, [shortUrl])
        res.redirect(200, url)
    } catch (err) {
        res.status(500).send(err)
    }
}

export async function urlsDeleteController(req, res){
    const { id } = req.params
    try {
        await connection.query(`
            DELETE FROM
                urls
            WHERE 
                id = ($1)
        `, [id])
        res.status(204).send("Url deletada") 
    } catch (err) {
        res.status(500).send(err)
    }
}