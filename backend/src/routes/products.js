import express from "express";
import productController from "../controllers/productsController.js";
import multer from "multer";


const router = express.Router();

const upload = multer({ dest: "public/" });

router.route("/by-category")
 .get(productController.getProductsByCategory);
 
router.route("/")
  .get(productController.getProducts)
  .post(upload.single("image"), productController.createProduct);

router.route("/:id")
  .get(productController.getProductById)
  .put(upload.single("image"), productController.updateProduct)
  .delete(productController.deleteProduct);


export default router;
