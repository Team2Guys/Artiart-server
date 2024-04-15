const { Router } = require('express');
const controller = require('../controller/controller')
const router = Router();
const ApiEndPoints = {
    addProduct: "/addProduct",
    getAllproducts: "/getAllproducts",
    deleteProduct: "/deleteProduct",
}

router.post(ApiEndPoints.addProduct, controller.addProduct)
router.get(ApiEndPoints.getAllproducts, controller.getAllproducts)
router.delete(ApiEndPoints.deleteProduct, controller.deleteProduct)

module.exports = router;