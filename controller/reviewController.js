const Review = require('../model/reviewModel');

exports.addReview = async (req, res) => {
    console.log("Reached to add review")
    try {
        const { productId, name, star, description } = req.body;

        if (!productId || !name || !star || !description) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const newReview = new Review({
            productId,
            name,
            star,
            description
        });

        await newReview.save();

        res.status(200).json({ message: 'Review added successfully', review: newReview });
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err });
    }
};

exports.getReviews = async (req, res) => {
    try {
        const { productId } = req.params;

        const reviews = await Review.find({ productId }).sort({ createdAt: -1 });

        if (!reviews) {
            return res.status(404).json({ message: 'No reviews found' });
        }

        res.status(200).json({ reviews });
    } catch (err) {
        res.status(500).json({ message: 'Internal server error', error: err });
    }
};
