import User from "../models/user.model.js";
import bcrypt from 'bcryptjs';
import { generateToken } from "../lib/utils.js";
import cloudinary from "../lib/cloudinary.js";
export const signup = async (req, res) => {
    const { email, fullName, password } = req.body;
    try {
     if(!email || !fullName || !password){
      res.status(400).send("All input is required");
     }
     if(password < 6){
      res.status(400).send("Password must be at least 6 characters long");
     }
      const user = await User.findOne({email});
      if(user){
        res.status(400).json({message:'Email already exists'});
      }
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, salt);

      const newUser = new User({
        fullName,
        email,
        password:hashPassword
      });

      if(newUser){
        generateToken(newUser._id,res);
        await newUser.save();
        res.status(201).json({ message:'User created successfully',
            _id:newUser._id,
            fullName:newUser.fullName,
            email:newUser.email,
            profilePic:newUser.profilePic,
        });
      }else{
        res.status(400).json({message:'Invalid user data'});
      }
    } catch (error) {
     console.log("error in signup controller", error.message);
    }
};

export const login = async (req, res) => {  
     const {email, password} = req.body;

     try {
        const user = await User.findOne({email});

        if(!user){
            res.status(400).json({message:'Invalid email or password'});
        }
        const validPassword = await bcrypt.compare(password, user.password);

        if(!validPassword){
            res.status(400).json({message:'Invalid email or password'});
        }
        generateToken(user._id,res);
        res.status(201).json({message:'User logged in successfully',
            _id:user._id,
            fullName:user.fullName,
            email:user.email,
            profilePic:user.profilePic,
        });
     } catch (error) {
        console.log("error in login controller", error.message);
        res.status(500).json({message:'Internal server error'});
     }
}

export const logout = async (req, res) => { 
   try {
    res.cookie("jwt","",{maxAge:0});
    res.status(200).json({message:'User logged out successfully'});
   } catch (error) {
    console.log("Error in logout controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
   }
}

export const updateProfile = async (req,res) => {
    try {
        const {profilePic, fullName,email} = req.body;
       const userId= req.user._id;

       if(!profilePic || !fullName || !email){
        res.status(400).json({message:'All input is required'});
       }
       const uploadResponse = await cloudinary.upload(profilePic)
       const updatedUser=await User.findByIdAndUpdate(userId, {
        profilePic:uploadResponse.secure_url,
        fullName,
        email,
       },
         {
          new:true,
         }
    );
    res.status(200).json({
        _id:updatedUser._id,
        fullName:updatedUser.fullName,
        email:updatedUser.email,
        profilePic:updatedUser.profilePic,
    });
    } catch (error) {
        console.log("Error in updateProfile controller", error.message);
        res.status(500).json({message:'Internal server error'});
    }
}

export const checkAuth = (req,res) =>{
    try {
        res.status(200).json(req.user);
    } catch (error) {
        console.log("Error in checkAuth controller", error.message);
        res.status(500).json({message:'Internal server error'});
    }
}