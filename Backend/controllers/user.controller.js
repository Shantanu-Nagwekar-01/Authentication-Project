import User from "../models/user.model.js";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export const getUsers = async (req,res) => {
    try {
        const users = await User.find({}); //query to find or fetch all documents
        res.status(200).json({success: true, data: users});
        
    } catch (error) {
        console.log("Error in fetching all users (fields): ",error.message);
        res.status(500).json({success: false, message: "Internal Server Error!!"});
    }
};

export const createUser = async (req, res) => {
    const { Username, password } = req.body;

    if (!Username || !password) {
        return res.status(400).json({ success: false, message: "Please provide all fields" });
    }

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ Username });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "Username already exists" });
        }

        // Create new user
        const newUser = new User({ Username, password });
        await newUser.save();

        res.status(201).json({ success: true, message: "User created successfully" });
    } catch (error) {
        console.error("Error in Signup: ", error.message);
        res.status(500).json({ success: false, message: "Server Error!" });
    }
};

export const loginUser = async (req, res) => {
    const { Username, password } = req.body;

    if (!Username || !password) {
        return res.status(400).json({ success: false, message: "Please provide all fields" });
    }

    try {
        const user = await User.findOne({ Username });

        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid username or password" });
        }

        // Compare hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Invalid username or password" });
        }

        // Generate JWT Token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.status(200).json({ success: true, token, message: "Login successful" });
    } catch (error) {
        console.error("Error in Login: ", error.message);
        res.status(500).json({ success: false, message: "Server Error!" });
    }
};


export const updateUser = async (req, res) => {
    const {id} = req.params;
    
    const user = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({success: false, message: "Invalid user Id !!"});
    }

    try {
        const updatedUser = await User.findByIdAndUpdate(id, user, {new : true});
        res.status(200).json({success: true, data : updatedUser});    
    } catch (error) {
        res.status(500).json({success: false, message: "Internal Server Error!!"});
        console.log("Error in updating user details: ", error.message);
        
    }
};

export const deleteUser = async (req,res) => {
    const {id} = req.params;

    //Check whether id is valid or not 
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({success: false, message: "Invalid user Id !!"});
    }
    // console.log("id:", id);
    try {
        await User.findByIdAndDelete(id); //finds document by id and deletes this field or document
        res.status(200).json({ success: true, message: "user Deleted"});
    }
    catch(error) {
        console.log("Error in user Deletion: ", error.message);
        res.status(500).json({success: false, message: "Internal Server Error!!"});
    }
};