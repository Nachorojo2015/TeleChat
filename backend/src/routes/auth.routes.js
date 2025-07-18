import { Router } from "express";
import { login, logout, refreshToken, register } from "../controllers/auth.controller.js";
import { authenticateToken } from "../middlewares/authenticateToken.middleware.js";

const authRouter = Router()

authRouter.post('/register', register)

authRouter.post('/login', login)

authRouter.post('/refresh', refreshToken)

authRouter.post('/logout', authenticateToken, logout)

export { authRouter }