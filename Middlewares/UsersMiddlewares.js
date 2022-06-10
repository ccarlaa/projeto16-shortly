import connection from "../db.js"

export async function usersMiddleware(req, res, next) {
    const { authorization } = req.headers
    const userId  = req.params.id
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
        if(tokenValidation.rows[0].userId != userId){
            res.status(404).send("Usuário não encontrado")
            return 
        }
    } catch (err) {
        res.status(500).send(err)
    }
    next()
}