import { Router } from "express";
import { blockUser, getMyUser, getUsersByUsername, unlockUser, updateProfilePicture } from "../controllers/users.controller.js";
import multer from "multer";
import { storage } from "../config/multerConfig.js";

const upload = multer({ storage })

const usersRouter = Router()

usersRouter.get('/myUser', getMyUser)

usersRouter.post('/block/:id', blockUser)

usersRouter.delete('/unlock/:id', unlockUser)

usersRouter.get('/:username', getUsersByUsername)

usersRouter.put('/profile-picture', upload.single('profile-picture'), updateProfilePicture)

export { usersRouter }