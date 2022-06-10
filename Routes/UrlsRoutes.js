import { Router } from "express"
import { urlsPostMiddleware, urlsGetIdMiddleware, urlsGetOpenMiddleware, urlsDeleteMiddleware } from "../Middlewares/UrlsMiddlewares.js"
import { urlsPostController, urlsGetIdController, urlsGetOpenController, urlsDeleteController } from "../Controllers/UrlsControllers.js"

const urlsRoute = Router()

urlsRoute.post('/urls/shorten', urlsPostMiddleware, urlsPostController )
urlsRoute.get('/urls/:id', urlsGetIdMiddleware, urlsGetIdController )
urlsRoute.get('/urls/open/:shortUrl', urlsGetOpenMiddleware, urlsGetOpenController )
urlsRoute.delete('/urls/:id', urlsDeleteMiddleware, urlsDeleteController )



export default urlsRoute