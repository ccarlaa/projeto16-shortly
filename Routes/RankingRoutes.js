import { Router } from "express"
import { rankingGetController } from "../Controllers/RankingControllers.js"

const rankingRoute = Router()

rankingRoute.get('/ranking', rankingGetController)

export default rankingRoute