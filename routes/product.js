const { Router } = require('express');
const controller = require('../controller/controller');
const upload = require('../middleware/ImageUpload')
const router = Router();


const ApiEndPoints = {
    addProduct: "/addProduct",
    getAllproducts: "/getAllproducts",
    deleteProduct: "/deleteProduct/:id",
    addProductImage: "/addProductImage",
    updateProduct: "/updateProduct/:id",
    getPaginateProducts: "/getPaginateProducts",


    // Categories
    AddCategory: "/AddCategory",
    getAllcategories: "/getAllcategories",
    deleteCategory: "/deleteCategory/:id",
    updateCategory: '/updateCategory/:id',
    getCategory: '/getCategory/:id',

    Removeimage: "/removeProductImage",

    // email
    email: "/sendEmail",

}

router.post(ApiEndPoints.addProduct, controller.addProduct)
router.get(ApiEndPoints.getAllproducts, controller.getAllproducts)
router.delete(ApiEndPoints.deleteProduct, controller.deleteProduct)
router.get(ApiEndPoints.getPaginateProducts, controller.getPaginateProducts)
router.post(ApiEndPoints.addProductImage, upload.array('image'), controller.addProductImage)
router.post(ApiEndPoints.updateProduct, controller.productHanler)
router.delete(ApiEndPoints.Removeimage, controller.deleteProductImage)
router.post(ApiEndPoints.email, controller.sendEmailHandler)




// Categories

router.post(ApiEndPoints.AddCategory, controller.AddCategory);
router.get(ApiEndPoints.getAllcategories, controller.getAllcategories);
router.post(ApiEndPoints.updateCategory, controller.editCategoryHandler);
router.delete(ApiEndPoints.deleteCategory, controller.deleteCategory);
router.get(ApiEndPoints.getCategory, controller.getCategory);


module.exports = router;
