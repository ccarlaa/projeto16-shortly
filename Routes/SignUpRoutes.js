import { Router } from "express"
import { signUpMiddleware } from "../Middlewares/SignUpMiddleware.js"
import { signUpController } from "../Controllers/SignUpControllers.js"

const signUpRoute = Router()

signUpRoute.post('/signup', signUpMiddleware, signUpController )

export default signUpRoute