import connection from "../db.js"

export async function usersController(req, res) {
    const userId  = req.params.id
    let shortenedUrls = []
    let visitCountTotal = 0
    let answer
    try {
        const infos = await connection.query(`
            SELECT 
                users."id" AS "userId", users."name", urls."views" AS "visitCount", urls."id", urls."shortUrl", urls."url"
            FROM 
                users
            JOIN 
                urls
            ON
                urls."userId" = users."id"
            WHERE 
                urls."userId" = ($1)
            GROUP BY
                users."id", urls."id"
        `,[userId])
        const infosRows = infos.rows
        for(let info of infosRows){
            info = {
                ...info,
                id: info.id,
                shortUrl: info.shortUrl,
                url: info.url,
                visitCount: info.visitCount
            }
            visitCountTotal += info.visitCount
            shortenedUrls.push(info)
        }
        answer = {
            id: userId,
            name: infosRows[0].name,
            visitCount: visitCountTotal,
            ...{shortenedUrls}
        }
        res.status(200).send(answer) 
    } catch (err) {
        res.status(500).send(err)
    }
}