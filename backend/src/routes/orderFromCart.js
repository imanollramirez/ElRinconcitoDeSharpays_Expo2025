
import express from "express";
import multer from "multer";
import createOrderFromCart from "../controllers/createOrderFromCart.js";

const router = express.Router();


const upload = multer({ dest: "uploads/" });


router.post('/create-from-cart', upload.single("image"), createOrderFromCart);



export default router;
