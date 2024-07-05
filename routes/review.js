const { Router } = require('express');
const reviewController = require('../controller/reviewController');
const router = Router();

const reviewApiEndpoints = {
    addReview: "/addReview",
    getReviews: "/getReviews/:productId"
};

router.post(reviewApiEndpoints.addReview, reviewController.addReview);
router.get(reviewApiEndpoints.getReviews, reviewController.getReviews);

module.exports = router;
