const { Admin } = require('../model/adminModel');
const PaymentDB = require('../model/payementModel');

let jwt = require('jsonwebtoken');
let seckey = 'seckey';
require('dotenv').config();


exports.adminhanlder = async (req, res) => {
  try {
    const { firstName, lastName, email, password, canAddProduct, canDeleteProduct, canAddCategory,canEditProduct,canEditCategory, canDeleteCategory } = req.body;

    if (!firstName || !lastName || !email || !password) return res.status(401).json({ message: "Mondatory fields are required" });

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: 'An admin with this email already exists' });
    }

    const newAdmin = new Admin({
      firstName,
      lastName,
      email,
      password,
      canAddProduct,
      canDeleteProduct,
      canAddCategory,
      canDeleteCategory,
      canEditCategory,
      canEditProduct,
    });
    const savedAdmin = await newAdmin.save();

    return res.status(201).json(savedAdmin);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}


exports.DeleteAdminHandler = async (req, res) => {
  try {
    const adminId = req.params.id;
    if (!adminId) res.status(401).json({ message: "id Not found" });


    const existingAdmin = await Admin.findById(adminId);
    if (!existingAdmin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    // Delete the admin from the database
    await Admin.findByIdAndDelete(adminId);

    res.status(200).json({ message: 'Admin deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.editAdminHandler = async (req, res) => {
  try {
    const adminId = req.params.id;
    const { firstName, lastName, email, password, canAddProduct, canDeleteProduct, canAddCategory,canEditProduct,canEditCategory, canDeleteCategory } = req.body;

    if (!firstName || !lastName || !email || !password) res.status(401).json({ message: "Mondatory fields are required" });


    let existingAdmin = await Admin.findById(adminId);
    if (!existingAdmin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    existingAdmin.firstName = firstName;
    existingAdmin.lastName = lastName;
    existingAdmin.email = email;
    existingAdmin.password = password;
    existingAdmin.canAddProduct = canAddProduct;
    existingAdmin.canDeleteProduct = canDeleteProduct;
    existingAdmin.canAddCategory = canAddCategory;
    existingAdmin.canDeleteCategory = canDeleteCategory;
    existingAdmin.canEditCategory = canEditCategory;
    existingAdmin.canEditProduct = canEditProduct;


    // Save the updated admin to the database
    const updatedAdmin = await existingAdmin.save();

    res.status(200).json(updatedAdmin);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAlladminsHandler = async (req, res) => {
  try {
    const admins = await Admin.find();

    if (!admins || admins.length === 0) {
      return res.status(404).json({ message: 'No admins found' });
    }

    res.status(200).json(admins);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};


exports.adminLoginhandler = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email || !req.body.password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ message: 'user not found' });
    }
    const isPasswordValid = admin.password === req.body.password
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }


    const token = jwt.sign({ email: email }, seckey);
    const { password, ...userWithoutPassword } = admin;

    // Send the token in the response
    res.status(200).json({ token, messsage: "User has been successfully loggedIn", user: userWithoutPassword._doc });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.getAdminHandler = async (req, res) => {
  try {
    const email = req.email;
    if (!email) {
      return res.status(400).json({ message: 'Email not found' });
    }

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(401).json({ message: 'user not found' });
    }

    const { password, ...userWithoutPassword } = admin;
    res.status(200).json({ messsage: "User found", user: userWithoutPassword._doc });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



exports.superAdminLoginhandler = async (req, res) => {
  try {
    let AdminEmail = process.env.AdminEmail;
    let Adminpassword = process.env.adminpassord

    const { email, password } = req.body;


    // Check if the email and password are provided
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    // Check if an admin with the provided email exists
    const admin = AdminEmail === email
    if (!admin) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check if the password matches
    const isPasswordValid = Adminpassword === password
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }


    const token = jwt.sign({ email: email }, seckey);

    // Send the token in the response
    res.status(200).json({ token, messsage: "User has been successfully loggedIn" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



exports.getAllorders = async (req, res) => {
  try {
    console.log('request received')
    let Orders = await PaymentDB.find()
    if (!Orders || Orders.length === 0) return res.status(404).json({ message: 'No Order found' });
    console.log(Orders, "Orders")
    return res.status(200).json({Orders})
  } catch (err) {
    console.log(err, "err")
    return res.status(500).json({ message: 'Internal server error', error: err });
  }
};