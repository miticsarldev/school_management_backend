import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";
import { generateAccessToken, generateRefreshToken } from "../utils";
import path from "path";
import fs from "fs";

export const register = async (req: Request, res: Response) => {
  try {
    const {
      firstname,
      lastname,
      email,
      username,
      telephone,
      password,
      bio,
      birthdate,
      gender,
      country,
      city,
      quarter,
      street,
      door,
      website,
      role,
      status,
    } = req.body;

    const image = req.file ? `/uploads/${req.file.filename}` : "";
    const imageUrl = `${req.protocol}://${req.get("host")}${image}`;

    const userExists = await User.findOne({
      $or: [{ email: email }, { telephone: telephone }, { username: username }],
    });

    if (userExists) {
      return res.status(400).json({ message: "Cet utilisateur existe déja" });
    }

    const user = new User({
      firstname,
      lastname,
      email,
      username,
      telephone,
      password,
      bio,
      birthdate,
      gender,
      country,
      city,
      quarter,
      street,
      door,
      website,
      role,
      status,
      image: imageUrl,
    });

    await user.save();
    res.status(201).json({ message: "Utilisateur creé avec succès" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// For updating, we will use all fields beside (username, email and phonenumber)
export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      firstname,
      lastname,
      bio,
      birthdate,
      gender,
      country,
      city,
      quarter,
      street,
      door,
      website,
      role,
      status,
    } = req.body;

    const image = req.file ? `/uploads/${req.file.filename}` : "";

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Delete the previous image if it exists and replace it with the new one for the user
    if (user.image) {
      const imagePath = path.join(
        __dirname,
        "..",
        "..",
        user.image.replace(`${req.protocol}://${req.get("host")}`, "")
      );

      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    const imageUrl = `${req.protocol}://${req.get("host")}${image}`;

    user.firstname = firstname;
    user.lastname = lastname;
    user.bio = bio;
    user.birthdate = birthdate;
    user.gender = gender;
    user.country = country;
    user.city = city;
    user.quarter = quarter;
    user.street = street;
    user.door = door;
    user.image = imageUrl;
    user.website = website;
    user.role = role;
    user.status = status;

    await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Implement the user forgot password
export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email, telephone, username } = req.body;

    const user = await User.findOne({
      $or: [{ email: email }, { telephone: telephone }, { username: username }],
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User found" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }
    res.json({ message: "Utilisateur supprimé avec succès" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, telephone, username, password } = req.body;

    const user = await User.findOne({
      $or: [{ email: email }, { telephone: telephone }, { username: username }],
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Email ou mot de passe incorrect" });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "Email ou mot de passe incorrect" });
    }

    // Generate JWT tokens
    const accessToken = generateAccessToken(user.email);
    const refreshToken = generateRefreshToken(user.email);

    user.lastLogin = new Date();
    await user.save();

    res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: true });
    res.json({ user: user, accessToken });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

export const logout = async (req: Request, res: Response) => {
  res.clearCookie("refreshToken");
  res.json({ message: "Logged out successfully" });
};

export const refreshToken = async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(403).json({ message: "Refresh token not provided" });
  }

  try {
    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET as string
    ) as { email: string };

    const { email } = decoded;

    const accessToken = generateAccessToken(email);

    // Fetch the user from the database
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not authorized" });
    }

    const userObject = user.toObject();

    res.json({ user: userObject, accessToken });
  } catch (err) {
    console.error(err);
    return res.status(403).json({ message: "Invalid refresh token" });
  }
};
