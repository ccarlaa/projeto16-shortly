import { Router } from "express"
import { usersMiddleware } from "../Middlewares/UsersMiddlewares.js"
import { usersController } from "../Controllers/UsersControllers.js"

const usersRoute = Router()

usersRoute.get('/users/:id', usersMiddleware, usersController)

export default usersRoute