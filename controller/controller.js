const Productdb = require('../model/model.js');
require("dotenv").config(); 
const AWS = require('aws-sdk');

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
    console.log('req body', req.body.id);
    const { id } = req.body
    try {
        let products = await Productdb.findByIdAndDelete(id);
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


// exports.addProductImage = async ( req, res)=> {
// try{
//     const s3 = new AWS.S3();
//       const files = req.files;

//       if (!files || files.length === 0) {
//         return res.status(400).send('No files uploaded.');
//       }
    
      
//       // Upload each file to S3
//       files.forEach((file) => {
//         console.log(file, "file")
//         const params = {
//           Bucket: '2guysproducts',
//           Key: file.originalname,
//           Body: require('fs').createReadStream(file.path),
//           ContentType: file.mimetype,
//         };
    
//         // Upload file to S3
//         s3.upload(params, (err, data) => {
//           if (err) {
//             console.error('Error uploading file:', err);
//             return res.status(500).send('Error uploading file to S3.');
//           }
//           console.log('File uploaded successfully:', data.Location);
//     return res.status(200).send('File uploaded successfully.', data.Location);

//         });
//       });
// }catch(err){
//     console.log(err, "err")
//     return res.status(500).send('Error uploading file to S3.');

// }
      
// }

const s3 = new AWS.S3();
exports.addProductImage = async (req, res) => {
    try {
      const files = req.files;
  
      if (!files || files.length === 0) {
        return res.status(400).send('No files uploaded.');
      }
  
      // Upload each file to S3
      for (const file of files) {
        const params = {
          Bucket: '2guysproducts',
          Key: file.originalname,
          Body: require('fs').createReadStream(file.path), 
          ContentType: file.mimetype
        };
  
        // Upload file to S3
        const data = await s3.upload(params).promise();
  
        console.log('File uploaded successfully:', data.Location);
      }
  
      res.status(200).send('Files uploaded successfully.');
    } catch (err) {
      console.error('Error uploading files to S3:', err);
      res.status(500).send('Internal Server Error');
    }
  };
