import { Router } from "express"
import { signInMiddleware } from "../Middlewares/SignInMiddlewares.js"
import { signInController } from "../Controllers/SignInControllers.js"

const signInRoute = Router()

signInRoute.post('/signin', signInMiddleware, signInController )

export default signInRoute