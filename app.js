import express from "express"
import cors from "cors"
import dotenv from "dotenv"

import signInRoute from "./Routes/SignInRoutes.js"
import signUpRoute from "./Routes/SignUpRoutes.js"
import urlsRoute from "./Routes/UrlsRoutes.js"
import usersRoute from "./Routes/UsersRoute.js"
import rankingRoute from "./Routes/RankingRoutes.js"

const app = express()
app.use(express.json())
app.use(cors())

dotenv.config()

app.use(signInRoute)
app.use(signUpRoute)
app.use(urlsRoute)
app.use(usersRoute)
app.use(rankingRoute)

const port = process.env.PORT
app.listen(port, () => {
    console.log(`|-----------------------------------|`)
    console.log(`| Running at http://localhost:${port}  |`)
    console.log(`|-----------------------------------|`)
})