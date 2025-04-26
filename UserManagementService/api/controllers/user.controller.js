import  jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import bcryptjs from "bcryptjs";
import nodemailer from "nodemailer";


export const test = (req, res) => {
  res.json({
    message: 'API is working'
  });
};


export const signup = async (req, res, next) => {
  const { username, email, password, mobile, adress} = req.body;
  console.log(username, email, password, mobile, adress)

  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const mobileRegex = /^(071|076|077|075|078|070|074|072)\d{7}$/;
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+.])[A-Za-z\d!@#$%^&*()_+.]{6,9}$/;


  if (!username || !email || !password || !mobile || !adress ||
      username === "" || email === "" || password === "" || mobile === "" || adress === "" ) {
      return next(errorHandler(400, 'All fields are required'));
  } else if (!emailRegex.test(email)) {
      return next(errorHandler(400, 'Invalid email format'));
  } else if (!mobileRegex.test(mobile)) {
      return next(errorHandler(400, 'Invalid mobile number format'));
  } else if (!passwordRegex.test(password)) {
    return next(errorHandler(400, 'Password should be between 6 and 9 characters long and contain at least one uppercase letter, one digit, and one symbol (!@#$%^&*()_+.).'));

  }else if (username.length < 7 || req.body.username.length > 50) {
    return next(errorHandler(400, 'Username must be between 7 and 50 characters'));
}

  const hashedPassword = bcryptjs.hashSync(password, 10);
  const newUser = new User({ username, email, password: hashedPassword, adress, mobile });

  try {
      await newUser.save();
      res.status(201).json({ message: "User created successfully" });
  } catch (err) {
      next(err);
  }
};



export const signin = async(req,res,next)=>{
  const {email,password} = req.body;
  if(!email || !password || email==="" || password===""){
    next(errorHandler(400,"All fields are required"));
  }
  try{
    const validUser = await User.findOne({email});
    if(!validUser) return next(errorHandler(404,'User not found!'));
    const validPassword = bcryptjs.compareSync(password,validUser.password);
    if(!validPassword) return next(errorHandler(400,'Invalid Credentials!'));
    const token = jwt.sign({id:validUser._id , isAdmin:validUser.isAdmin},process.env.JWT_SECRET);
    const{password:hashedPassword, ...rest} = validUser._doc;
    const expiryDate = new Date(Date.now()+3600000);
    res.cookie('acess_token',token,{httpOnly:true,expires:expiryDate}).status(200).json(rest);
  }catch(error){
    next(error);
  }
}

export const google = async (req,res,next) => {
  try{
    const user = await User.findOne({email:req.body.email});
    if (user){
      const token = jwt.sign({id:user._id , isAdmin:user.isAdmin},process.env.JWT_SECRET);
      const{password:hashedPassword, ...rest} = user._doc;
      
      res.cookie('acess_token',token,{httpOnly:true}).status(200).json(rest);
    }else{
        const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
        const hashedPassword = bcryptjs.hashSync(generatedPassword,10);
        const newUser = new User({username:req.body.name.split("").join("").toLowerCase()+Math.random().toString(36).slice(-8), 
        email:req.body.email, password: hashedPassword, profilePicture:req.body.photo });

        await newUser.save();
         const token = jwt.sign({id:newUser._id , isAdmin:newUser.isAdmin},process.env.JWT_SECRET);
         const{password:hashedPassword2, ...rest} = newUser._doc;
         const expiryDate = new Date(Date.now()+3600000);
         res.cookie('acess_token',token,{httpOnly:true,expires:expiryDate}).status(200).json(rest);
    }
  }catch(error){
    next(error);
  }
}



const transporter = nodemailer.createTransport({
  service:"gmail",
  auth: {
    user: "sanjana.nim2001@gmail.com",
    pass: "vjse jalj inva azdf",
},
}) 

export const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.id) {
      return next(errorHandler(401, 'You can update only your Account'));
  }

  try {
      
      if (req.body.password) {
          const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+.])[A-Za-z\d!@#$%^&*()_+.]{6,9}$/;
          if (!passwordRegex.test(req.body.password)) {
              return next(errorHandler(400, 'Password should be between 6 and 9 characters long and contain at least one uppercase letter, one digit, and one symbol (!@#$%^&*()_+.).'));
          }
          req.body.password = bcryptjs.hashSync(req.body.password, 10);
      }

   
      if (req.body.username) {
          if (req.body.username.length < 7 || req.body.username.length > 50) {
              return next(errorHandler(400, 'Username must be between 7 and 50 characters'));
          }
      }

    
      if (req.body.mobile) {
          const mobileRegex = /^(071|076|077|075|078|070|074|072)\d{7}$/;
          if (!mobileRegex.test(req.body.mobile)) {
              return next(errorHandler(400, 'Invalid mobile number format.'));
          }
      }

    
      if (req.body.events) {
          const invalidEvents = req.body.events.some(event => 
              !event.name || !event.description
          );
          
          if (invalidEvents) {
              return next(errorHandler(400, 'Each event must have both a name and description'));
          }
      }

     
      if (req.body.workImages && req.body.workImages.length > 4) {
          return next(errorHandler(400, 'Maximum 4 work images allowed'));
      }


      const updateData = {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          profilePicture: req.body.profilePicture,
          adress: req.body.adress,
          mobile: req.body.mobile,
          age: req.body.age,
          serviceAreas: req.body.serviceAreas || [],
          IdNumber: req.body.IdNumber,
          description: req.body.description || '',
          events: req.body.events || [],
          workImages: req.body.workImages || []  
      };

      
      Object.keys(updateData).forEach(key => {
          if (updateData[key] === undefined) {
              delete updateData[key];
          }
      });

      const updatedUser = await User.findByIdAndUpdate(
          req.params.id,
          { $set: updateData },
          { new: true }
      );

    
      const { password, ...rest } = updatedUser._doc;
      res.status(200).json(rest);
  } catch (error) {
      next(error);
  }
};
export const deleteUser = async(req,res,next)=>{
  if (!req.user.isAdmin && req.user.id !== req.params.id) {
    return next(errorHandler(403, 'You are not allowed to delete this user'));
  }

  try {
      await User.findByIdAndDelete(req.params.id);
      res.status(200).json("User has been Deleted...")
  } catch (error) {
      next(error)
  }
}
export const signout = (req, res, next) => {
  try {
    res.clearCookie('access_token').status(200).json('User has been signed out');
  } catch (error) {
    next(error);
  }
};




export const forgetpassword = async (req, res, next) => {
  const { email } = req.body;
  try {
   
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ status: 401, message: "User not found" });
    }

    
    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

  
    user.verifytoken = token;
    
    await user.save();
    

   
    const mailOptions = {
      from: "sanjana.nim2001@gmail.com",
      to: email,
      subject: "Password Reset",
      text: `Use the following link to reset your password: http://localhost:5173/resetpassword/${user._id}/${token}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        return res.status(500).json({ status: 500, message: "Email not sent" });
      }
      
      res.status(201).json({ status: 201, message: "Email sent successfully" });
    });
  } catch (error) {
    console.error("Forget password error:", error);
    next(error);
  }
};

export const resetpassword = async (req, res, next) => {
  const { id, token } = req.params;
  
  

  try {
    const validuser = await User.findOne({_id: id, verifytoken: token});
   
    const verifyToken = jwt.verify(token, process.env.JWT_SECRET);


    if (validuser && verifyToken.id) {
      res.status(201).json({ status: 201, validuser });
    } else {
      res.status(401).json({ status: 401, message: "User does not exist" });
    }
  } catch (error) {
    console.error("Error in resetpassword controller:", error);
    res.status(500).json({ status: 500, message: "Internal server error" });
  }
};

export const updateResetPassword = async (req, res, next) => {
  const { id, token } = req.params;
  const { password } = req.body;

  try {
      const validuser = await User.findOne({ _id: id, verifytoken: token });
      const verifyToken = jwt.verify(token, process.env.JWT_SECRET);

      if (validuser && verifyToken.id) {
          
          const newpassword = await bcryptjs.hash(password, 10);

          await User.findByIdAndUpdate(id, { password: newpassword });

          res.status(201).json({ status: 201, message: "Password updated successfully" });
      } else {
          res.status(401).json({ status: 401, message: "User does not exist or invalid token" });
      }
  } catch (error) {
      res.status(500).json({ status: 500, error: error.message });
  }

};

export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return next(errorHandler(404, 'User not found'));
    }
    const { password, ...rest } = user._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

export const getAdmins = async (req, res, next) => {
  try {
    
    const admins = await User.find({ isAdmin: true });
    res.status(200).json({ admins });
  } catch (error) {
    console.error("Error in getAdmins controller:", error);
    res.status(500).json({ status: 500, message: "Internal server error" });
  }
};


export const getTeams = async (req, res, next) => {
  try {
    
    const teams = await User.find({ isTeam: true });
    res.status(200).json({ teams });
  } catch (error) {
    console.error("Error in getAdmins controller:", error);
    res.status(500).json({ status: 500, message: "Internal server error" });
  }
};

export const getRiders = async (req, res, next) => {
  try {
    
    const admins = await User.find({ isRider: true });
    res.status(200).json({ admins });
  } catch (error) {
    console.error("Error in getRiders controller:", error);
    res.status(500).json({ status: 500, message: "Internal server error" });
  }
};
export const getCustomers = async (req, res, next) => {
  try {
    
    const admins = await User.find({ isAdmin: false });
    res.status(200).json({ admins });
  } catch (error) {
    console.error("Error in getAdmins controller:", error);
    res.status(500).json({ status: 500, message: "Internal server error" });
  }
};
export const assignAdmin = async (req, res, next) =>{
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) {
      return next(errorHandler(404, 'User not found'));
    }
    user.isAdmin = true;
    await user.save();
    res.status(200).json({ message: 'User assigned admin privileges successfully' });
  } catch (error) {
    next(error);
  }

};
export const resignAdmin = async (req, res, next) =>{

  const { id } = req.params;

  try {
    const user = await User.findById(id);
    if (!user) {
      return next(errorHandler(404, 'User not found'));
    }
    user.isAdmin = false;
    await user.save();
    res.status(200).json({ message: 'User resigned admin privileges successfully' });
  } catch (error) {
    next(error);
  }
  
};

export const getUserById = async (req, res) => {
  try {
    const userId = req.params.userId;
    
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Respond with the user's username
    res.status(200).json({ username: user.username });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getShopById = async (req, res) => {
  try {
    const userId = req.params.userId;

    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ _id: user._id, shopName: user.username }); // Including _id for better mapping
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};



export const HandOvergetRiders = async (req, res, next) => {
  try {
      const riders = await User.find({ isRider: true }).select('-password');
      res.status(200).json(riders);
  } catch (error) {
      next(error);
  }
}







