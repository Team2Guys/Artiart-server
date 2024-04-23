require("dotenv").config();
const AWS = require('aws-sdk');
const Productdb = require('../model/productModel.js');
const CategoryDb = require('../model/categoriesModel.js');
const cloudinary = require('cloudinary').v2;


AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

cloudinary.config({
    cloud_name: process.env.cloud_name,
    api_key: process.env.api_key,
    api_secret: process.env.api_secret,
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
    try {
        let products = await Productdb.find();
        if(!products){
            return res.status(200).json({message: "No products found"})      
        }
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
        if(!products){
            return res.status(404).json({
                message: "Product not found",
            })        
        }
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
if(!category){
    return res.status(404).json({ error: 'No Category found' });
}
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
            return res.status(404).json({ error: 'category not found' });
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
        if(!category) return res.status(404).json({ error: "Category not found", })

        return res.status(200).json({ message: "category has been deleted", category })
    } catch (err) {
        return res.status(500).json({ error: "errror Occured", })

    }

}

exports.addProductImage = async (req, res) => {
    try {
        const files = req.files;
const productImageUrl = []
        if (!files || files.length === 0) {
            return res.status(400).send('No files uploaded.');
        }


        for (const file of files) {
            // const params = {
            //     Bucket: process.env.BUCKETNAME,
            //     Key: `${folderName}/${file.originalname}`,
            //     Body: file.buffer,
            //     ContentType: file.mimetype
            // };
            console.log(file.path, "file")
            

            const result = await cloudinary.uploader.upload(file.path, {
                folder: "2guysProducts" // Specify the dynamic folder name
            });
            console.log('File uploaded successfully:', result);
           let Image_detail= {
     public_id: result.public_id,
     ImageUrl: result.url
            }

         productImageUrl.push(Image_detail)
        }

        res.status(200).json({
            productsImageUrl : productImageUrl
        });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).send('Internal Server Error');
    }
};


exports.deleteProductImage = async (req, res) => {
    try {
        const imageUrl = req.body.imageUrl;
    console.log(imageUrl, "imageUrl")
        if (!imageUrl) {
            return res.status(400).send('Image URL is required.');
        }
    
        let result=  await cloudinary.uploader.destroy(imageUrl);
        
        console.log('Image deleted successfully:', result);
    
        res.status(200).send('Image deleted successfully.');
    } catch (err) {
        console.error('Error:', err);
        res.status(500).send('Internal Server Error');
    }

};

