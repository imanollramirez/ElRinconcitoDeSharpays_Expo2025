import express from "express";
import payment from "../controllers/payment.js";

const router = express.Router();

router.post("/token", payment.Token);

router.post("/paymentProcess", payment.PaymentProcess);

export default router;

