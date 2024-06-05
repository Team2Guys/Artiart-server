const bcrypt = require('bcrypt');

const comparePassword = async (plaintextPassword, hashedPasswordFromDB) => {
    try {
      const result = await bcrypt.compare(plaintextPassword, hashedPasswordFromDB);
      console.log(result, "result")
      if (result) {
        return result;
      } else {
        throw new Error('Password is incorrect');
      }
    } catch (error) {
      console.error('Error comparing passwords:', error);
      throw new Error(error.message);
    }
  };
  



  
module.exports = {
    comparePassword
  
  };
