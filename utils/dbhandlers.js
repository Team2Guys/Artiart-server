const Products = require('../model/productModel.js');

const getPaginatedUsers = async (page, limit) => {
  let skipLimit = (page - 1) * limit;

  try {
    const products = await Products.find()
      .skip(skipLimit)
      .limit(limit)
      .exec();
    
    const count = await Products.countDocuments();
    return {
      products,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalProducts:count
    };
  } catch (error) {
    console.error('Error fetching paginated users:', error);
    throw new Error('Error fetching paginated users: ' + error.message);
  }
};

module.exports = {
  getPaginatedUsers,
};
