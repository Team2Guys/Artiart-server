const { schema } = require("../model/productModel");

const validate = (schema)=async (req, res, next)=>{
    try{
const parsebody = await schema.parsebody(req.body)
    }catch(error){
        return res.status(400).json({
            error
        });
    }
}


module.exports = validate