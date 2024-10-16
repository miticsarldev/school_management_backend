import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";
import { generateAccessToken, generateRefreshToken } from "../utils";
import path from "path";
import fs from "fs";
import mongoose from "mongoose";

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
      parent,
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
      parent: parent, // Assigner le parent
    });

    await user.save();
    // Si c'est un étudiant, je l'ajoute à la liste des enfants du parent
    if (role === "etudiant" && parent) {
      const parentId = await User.findById(parent);
      if (parentId) {
        parentId.children.push(user._id); // Ajout de l'ID de l'étudiant aux enfants du parentId
        await parentId.save();
      }
    }
    res.status(201).json({ message: "Utilisateur creé avec succès" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
// Récupérer tous les utilisateurs de rôle "etudiant" liés à un parent spécifique
export const getAllUsersStudentByParentId = async (req: Request, res: Response) => {
  try {
    const parentId = req.params.parent; // On suppose que l'ID du parent est passé dans les paramètres de la requête
    
    // Convertir parentId en ObjectId si nécessaire
    const parentObjectId = new mongoose.Types.ObjectId(req.params.parent);

    const students = await User.find({ role: "etudiant", parent: parentObjectId });
    if (students.length === 0) {
      return res.status(404).json({ message: "Aucun étudiant trouvé pour ce parent."  ,parentObjectId});
    }
    res.status(200).json(students);
  } catch (error) {
    console.error(error); // Pour mieux diagnostiquer l'erreur
    res.status(500).json({ message: "Erreur serveur." });
  }
};
// Assigner un parent à un étudiant et vice-versa
export const assignParentToStudent = async (req: Request, res: Response) => {
  try {
    const { studentId, parentId } = req.body;

    // Vérifier si le parent et l'étudiant existent
    const parent = await User.findById(parentId);
    const student = await User.findById(studentId);

    if (!parent || parent.role !== "parent") {
      return res.status(404).json({ message: "Parent non trouvé ou rôle incorrect." });
    }

    if (!student || student.role !== "etudiant") {
      return res.status(404).json({ message: "Étudiant non trouvé ou rôle incorrect." });
    }

    // Assigner l'étudiant au parent
    student.parent = parentId;
    await student.save();
  
    // Ajouter l'étudiant dans la liste des enfants du parent
    parent.children.push(studentId);
    await parent.save();

    res.status(200).json({ message: "Parent et étudiant assignés avec succès." });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de l'assignation du parent à l'étudiant." });
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
    const { id } = req.params; // Récupérer l'ID de l'utilisateur depuis les paramètres de la requête
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
      parent, // ID du parent à éventuellement mettre à jour
    } = req.body;

    // Traiter l'image si elle est présente
    const image = req.file ? `/uploads/${req.file.filename}` : "";

    // Rechercher l'utilisateur à mettre à jour
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    // Suppression de l'image précédente si une nouvelle image est fournie
    if (req.file && user.image) {
      const imagePath = path.join(
        __dirname,
        "..",
        "..",
        user.image.replace(`${req.protocol}://${req.get("host")}`, "")
      );

      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath); // Supprimer l'ancienne image du serveur
      }
    }

    // Mettre à jour uniquement si une nouvelle image est fournie
    if (req.file) {
      const imageUrl = `${req.protocol}://${req.get("host")}${image}`;
      user.image = imageUrl; // Met à jour l'URL de l'image de l'utilisateur
    }

    // Mettre à jour les informations de l'utilisateur
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
    user.website = website;
    user.role = role;
    user.status = status;

    // Vérifier si l'utilisateur est un étudiant et qu'un parent est fourni
    if (parent && role === "etudiant") {
      const previousParentId = user.parent; // ID du parent précédent

      // Vérifier que le nouveau parent est valide et qu'il a le rôle "parent"
      const newParent = await User.findById(parent);
      if (!newParent || newParent.role !== 'parent') {
        return res.status(400).json({ message: "ID de parent invalide ou rôle incorrect." });
      }

      // Ajouter l'ID de l'étudiant dans la liste des enfants du nouveau parent
      newParent.children.push(user._id);
      await newParent.save(); // Sauvegarder le nouveau parent

      // Si l'utilisateur avait un parent précédent, le retirer de la liste des enfants
      if (previousParentId && previousParentId.toString() !== parent) {
        await User.updateOne(
          { _id: previousParentId },
          { $pull: { children: user._id } } // Supprimer l'étudiant de l'ancien parent
        );
      }

      // Mettre à jour l'ID du parent dans l'utilisateur
      user.parent = parent;
    }

    // Sauvegarder les modifications de l'utilisateur
    await user.save();

    res.json(user); // Répondre avec les informations mises à jour de l'utilisateur
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'utilisateur :', error);
    
    // Gérer les erreurs et renvoyer une réponse appropriée
    if (error instanceof Error) {
      res.status(500).json({ message: "Erreur serveur pendant la mise à jour.", error: error.message });
    } else {
      res.status(500).json({ message: "Erreur serveur pendant la mise à jour." });
    }
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
