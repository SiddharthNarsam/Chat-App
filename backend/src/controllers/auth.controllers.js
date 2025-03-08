import cloudinary from "../libs/cloudinary.js";
import { generateToken } from "../libs/utils.js";
import User from "../models/user.model.js"
import bcrypt from "bcryptjs"



export const signup= async(req,res)=>{
    const {fullName,email,password} = req.body;
    try{
        //check email and name field is not null
        if(!fullName || !email || !password ){
            return res.status(400).json({message: "All fields are required"});
        }

        // check password
        if(password.length < 6){
            return res.status(400).json({message:"Password must be atleast 6 charecters."});
        }

        // finding if the user already exists    
        const user = await User.findOne({email});
        if (user) return res.status(400).json({message:"Email already exits !"});

        // hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);

        const newUser = new User ({
            fullName : fullName,
            email : email,
            password : hashedPassword // password  
        })

        if(newUser){
            //Generate JWT token here
            generateToken(newUser._id,res);
            await newUser.save();

            res.status(201).json({
                _id:newUser._id,
                fullName:newUser.fullName,
                email:newUser.email,
                profilePic: newUser.profilePic,
            });
        }
        else{
            res.status(400).json({message : "Invalid user data."});
        }


    } catch (error) {
        console.log("Error in signup controller: ", error.message);
        res.status(500).json({message:"Internal Server Error"});
    }
    
    // res.send("Signup Route");
};

export const login = async (req,res)=>{
    const {email,password}=req.body;
    try {

        // checking if user exists
        const user = await User.findOne( { email } );

        // if no user :
        if(!user){
            return res.status(400).json({message: "User not found"});  // change it to "Invalid Credentials" for security reasons
        }

        // comparing user password from database and inputted password 
        const ispasswordCorrect= await bcrypt.compare(password,user.password);

        // if wrong password:
        if(!ispasswordCorrect){
            return res.status(400).json({message: "Invalid Password"});  // change it to "Invalid Credentials" for security reasons
        }
        // generate token
        generateToken(user._id,res);

        res.status(200).json({
            _id : user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic

        });

        
    } catch (error) {
        console.log("Error in login controller: ", error.message);
        res.status(500).json({message:"Internal Server Error"});
    }
    // res.send("Login Route");
};

export const logout = (req,res)=>{

    try {
        // clearing all the cookies 
        res.cookie("jwt","",{maxAge:0})
        res.status(200).json({message:"Logged out successfully"});

    } catch (error) {
        console.log("Error in logout controller: ", error.message);
        res.status(500).json({message:"Internal Server Error"});
    }
    // res.send("Logout Route");
};

export const updateProfile = async (req,res)=>{
    try {
        const {profilePic}= req.body;
        const userId= req.user._id;

        if(!profilePic){
            return res.status(400).json({message:"Profile pic is required"});
        }

        const uploadResponse = await cloudinary.uploader.upload(profilePic);
        const updatedUser = await User.findByIdAndUpdate (userId, { profilePic: uploadResponse.secure_url }, { new:true });

        res.status(200).json(updatedUser);

    } catch (error) {
        console.log("Error in updateProfile controller: ", error.message);
        res.status(500).json({message:"Internal Server Error"});
    }
};

export const checkAuth = (req,res)=>{
    try {
        res.status(200).json(req.user);
    } catch (error) {
        console.log("Error in checkAuth controller: ", error.message);
        res.status(500).json({message:"Internal Server Error"});
    }
}