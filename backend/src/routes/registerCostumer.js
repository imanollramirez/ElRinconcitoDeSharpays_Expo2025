import express from "express";
import registerCostumerController from "../controllers/registerCostumerController.js";

const router = express.Router();


router.route("/").post(registerCostumerController.register);

router.route("/verifyAccount").post(registerCostumerController.verifyAccount);

 //router.post("/register-verify", registerCostumerController.registerWithVerification);
 //router.post("/verify-email", registerCostumerController.verifyCostumerEmail);

export default router;
