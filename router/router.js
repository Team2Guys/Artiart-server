const { Router } = require('express');
const controller = require('../controller/controller');
const upload = require('../middleware/ImageUpload')
const router = Router();
const ApiEndPoints = {
    addProduct: "/addProduct",
    getAllproducts: "/getAllproducts",
    deleteProduct: "/deleteProduct",
    addProductImage: "/addProductImage",
}



router.post(ApiEndPoints.addProduct, controller.addProduct)
router.get(ApiEndPoints.getAllproducts, controller.getAllproducts)
router.delete(ApiEndPoints.deleteProduct, controller.deleteProduct)
router.post(ApiEndPoints.addProductImage, upload.array('image'), controller.addProductImage)

module.exports = router;