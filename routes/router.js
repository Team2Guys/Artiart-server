const { Router } = require('express');
const controller = require('../controller/controller');
const upload = require('../middleware/ImageUpload')
const router = Router();


const ApiEndPoints = {
    addProduct: "/addProduct",
    getAllproducts: "/getAllproducts",
    deleteProduct: "/deleteProduct",
    addProductImage: "/addProductImage",
    updateProduct: "/updateProduct",

    // Categories
    AddCategory: "/AddCategory",
    getAllcategories: "/getAllcategories",
    deleteCategory: "/deleteCategory/:id",
    updateCategory: '/updateCategory/:id',
    getCategory: "/getCategory",
    Removeimage: "/removeProductImage/:imageUrl"
}

router.post(ApiEndPoints.addProduct, controller.addProduct)
router.get(ApiEndPoints.getAllproducts, controller.getAllproducts)
router.delete(ApiEndPoints.deleteProduct, controller.deleteProduct)
router.post(ApiEndPoints.addProductImage, upload.array('image'), controller.addProductImage)
router.put(ApiEndPoints.updateProduct, controller.productHanler)
router.delete(ApiEndPoints.Removeimage, controller.deleteProductImage)




// Categories

router.post(ApiEndPoints.AddCategory, controller.AddCategory);
router.get(ApiEndPoints.getAllcategories, controller.getAllcategories);
router.put(ApiEndPoints.updateCategory, controller.editCategoryHandler);
router.delete(ApiEndPoints.deleteCategory, controller.deleteCategory);


module.exports = router;
