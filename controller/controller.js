const Productdb = require('../model/model.js')


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



