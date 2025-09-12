import express from "express"
import loginController from "../controllers/loginController.js"
const router = express.Router();

router.route("/private").post(loginController.loginPrivate)
router.route("/public").post(loginController.loginPublic)

export default router;