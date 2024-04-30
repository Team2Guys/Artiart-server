const {users} = require('../model/usr');
let jwt = require('jsonwebtoken');
let seckey = 'seckey';
require('dotenv').config();

const signup = (req, res) => {
  const email = req.body.email;
  users.findOne({email: email}).then(resp => {
    if (!resp) {
      const user = new users(req.body);
      user.save().then(resp => {
        if (resp) {
          return res.status(200).json({
            message: 'You have sucessfully signup',
            user,
          });
        }
      });
    } else {
      return res.status(401).json({
        message: 'user has been already exists',
      });
    }
  });
};

const login = (req, res) => {
  const email = req.body.email;
  users
    .findOne({email: email})
    .then(resp => {
      if (resp) {
        console.log(resp,"resp")
        
        if(resp.password !== req.body.password)  return res.status(401).json({
          message: 'Invalid username or password',
     
        });
        let token = jwt.sign({email}, seckey);
        return res.status(200).json({
          message: 'You have sucessfully login',
          token,
        });
      } else {
        return res.status(404).json({
          message: 'user not found',
        });
      }
    })
    .catch(error => {
      return res.status(401).json({
        message: 'error while login',
        error: error.message,
      });
    });
};

// const passwordReset = async (req, res) => {
//   console.log(req.body, 'body');
//   try {
//     const schema = Joi.object({email: Joi.string().email().required()});
//     const {error} = schema.validate(req.body);
//     if (error) return res.status(400).send(error.details[0].message);

//     const user = await users.findOne({email: req.body.email});
//     if (!user) {
//       return res.status(400).send("user with given email doesn't exist");
//     }
//     return res.status(200).json({
//       message: 'user found',
//       user,
//     });
//   } catch (error) {
//     res.send('An error occured');
//     console.log(error);
//   }
// };

const userHandler = async(req, res) =>{
    try {
        
        const user = await users.findOne({email: req.body.email});
        if (!user) {
          return res.status(400).json({
          message: "user with given email doesn't exist"
          
            });
        
        }
    
       ;
        await user.save();
        return res.status(200).json({
        message: 'user found',
          user
        });
      } catch (error) {
        res.send('An error occured');
        return res.status(400).json({
          message: "An error occured",
          error
          
            });
      }
}

const passwordReset2 = async (req, res) => {
  try {
    const user = await users.findOne({email: req.body.email});
    if (!user) {
      return res.status(400).json({
        message: "user with given email doesn't exist"
        
          });
    }

    user.password = req.body.password;
    await user.save();
    return res.status(200).json({
      message: 'Password is reseted!',
      user
    });
  } catch (error) {

    return res.status(500).json({
      message: "An error occured",
      error
      
        });
  }
};



module.exports = {
  signup,
  login,
  passwordReset2,
  userHandler

};