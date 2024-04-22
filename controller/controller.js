require("dotenv").config();
const AWS = require('aws-sdk');
const Productdb = require('../model/productModel.js');
const CategoryDb = require('../model/categoriesModel.js');


AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

exports.addProduct = async (req, res) => {
    console.log('req body', req.body)
    if (!req.body) return res.status(200).json({ message: "no product found" })
    const newProduct = new Productdb(req.body)
    await newProduct.save();
    return res.status(200).json({
        message: "products has been saved"
    })
}

exports.getAllproducts = async (req, res) => {
    console.log('req body', req.body);
    try {
        let products = await Productdb.find();
        return res.status(200).json({
            message: "products has been saved",
            products
        })


    } catch (err) {
        return res.status(500).json({
            error: "errror Occured",
        })

    }

}
exports.deleteProduct = async (req, res) => {
    const productId = req.params.id;
    try {
        let products = await Productdb.findByIdAndDelete(productId);
        return res.status(200).json({
            message: "product has been deleted",
            products
        })


    } catch (err) {
        return res.status(500).json({
            error: "errror Occured",
        })

    }

}

const s3 = new AWS.S3();
exports.addProductImage = async (req, res) => {
    try {
        const files = req.files;
const productImageUrl = []
        if (!files || files.length === 0) {
            return res.status(400).send('No files uploaded.');
        }
        const folderName = 'product_images';
        for (const file of files) {
            const params = {
                Bucket: process.env.BUCKETNAME,
                Key: `${folderName}/${file.originalname}`,
                Body: file.buffer,
                ContentType: file.mimetype
            };
            

          
            const data = await s3.upload(params).promise();
            productImageUrl.push(data.Location)
            console.log('File uploaded successfully:', data.Location);
        
        }

        res.status(200).json({
            productsImageUrl : productImageUrl
        });
    } catch (err) {
        console.error('Error uploading files to S3:', err);
        res.status(500).send('Internal Server Error');
    }
};
    
exports.productHanler = async (req, res) => {
    const productId = req.params.id;
    const updateData = req.body;

    try {
        const updatedProduct = await Productdb.findByIdAndUpdate(productId, updateData, { new: true });

        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }
        return res.status(200).json(updatedProduct);
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.getProduct = async (req, res) => {

    try {
        const productId = req.params.id;
        let product = await Productdb.findById(productId);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        return res.status(200).json({ product })

    } catch (err) {
        consoe.log(err, "err")
        return res.status(500).json({ error: 'internal Server error' });
    }


}

// Category 

exports.AddCategory = async (req, res) => {
    try {
        const { name } = req.body;
    if(!req.body) return res.status(401).json({ error: 'Data not found' });

        // Check if the category name already exists
        const existingCategory = await CategoryDb.findOne({ name });
        if (existingCategory) {
            return res.status(400).json({ error: 'Category already exists' });
        }

        // Create a new category
        const newCategory = new CategoryDb({ name });
        await newCategory.save();
        return res.status(201).json(newCategory);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

exports.getAllcategories = async (req, res) => {
    try {
        const Categories = await CategoryDb.find();

        return res.status(201).json(Categories);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

exports.getProductHandler = async (req, res) => {
    try {
        const categoryId = req.params.id;

        let category = await CategoryDb.findById(categoryId)

        return res.status(201).json(category);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

exports.editCategoryHandler = async (req, res) => {

    try {
        const categoryId = req.params.id;
        const updateData = req.body;
        const category = await CategoryDb.findByIdAndUpdate(categoryId, updateData, { new: true });
        if (!category) {
            return res.status(404).json({ message: 'category not found' });
        }
        return res.status(200).json(category);
    } catch (err) {
        console.log('error', err)
        return res.status(500).json({ message: 'Internal server error' });

    }


}


exports.deleteCategory = async (req, res) => {
    const categoryId = req.params.id;
    try {
        let category = await CategoryDb.findByIdAndDelete(categoryId);
        return res.status(200).json({ message: "category has been deleted", category })
    } catch (err) {
        return res.status(500).json({ error: "errror Occured", })

    }

}


exports.deleteProductImage = async (req, res) => {
    try {
        const imageUrl = req.params.imageUrl;
        console.log(imageUrl, "imageUrl")
        const key = imageUrl.split('amazonaws.com/')[1];

        const params = {
            Bucket: process.env.BUCKETNAME,
            Key: key
        };

        // Delete file from S3
        await s3.deleteObject(params).promise();
        res.status(200).send('File deleted successfully.');
    } catch (err) {
        console.error('Error deleting file from S3:', err);
        res.status(500).send('Internal Server Error');
    }
};
