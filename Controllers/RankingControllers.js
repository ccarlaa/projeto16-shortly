import connection from "../db.js"

export async function rankingGetController(req, res){
    try {
        const answer = await connection.query(`
            SELECT 
                users."id" AS "id", users."name", COUNT(urls."views") AS "linksCount", SUM(urls."views") AS "visitCount"
            FROM 
                users
            JOIN 
                urls
            ON
                urls."userId" = users."id"
            GROUP BY
                users."id"
            ORDER BY
                SUM(urls."views") DESC
            LIMIT 
                10
        `)
        res.status(200).send(answer.rows)     
    } catch (err) {
        res.status(500).send(err)
    }
}