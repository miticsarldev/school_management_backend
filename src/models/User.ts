import { CallbackError, model, Schema } from "mongoose";
import bcrypt from "bcryptjs";
import { IUser } from "../types/models.type";

// Schema utilisateur
const UserSchema = new Schema<IUser>({
  firstname: {
    type: String,
    required: true,
    trim: true,
  },
  lastname: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  telephone: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  bio: {
    type: String,
    trim: true,
  },
  birthdate: {
    type: Date,
    trim: true,
  },
  gender: {
    type: String,
    enum: ["Masculin", "Feminin"],
    default: "Masculin",
  },
  country: {
    type: String,
    trim: true,
  },
  city: {
    type: String,
    trim: true,
  },
  quarter: {
    type: String,
    trim: true,
  },
  street: {
    type: String,
    trim: true,
  },
  door: {
    type: String,
    trim: true,
  },
  image: {
    type: String,
    trim: true,
  },
  website: {
    type: String,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  role: {
    type: String,
    enum: ["administrateur", "enseignant", "etudiant"],
    default: "etudiant",
  },
  status: {
    type: String,
    enum: ["actif", "inactif"],
    default: "actif",
  },
  lastLogin: {
    type: Date,
    default: Date.now,
  },
});

// Le pre-save hook pour hasher le mot de passe avant de l'enregistrer
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err: CallbackError | any) {
    return next(err);
  }
});

// La methode pour comparer le mot de passe avec le mot de passe hashe.
UserSchema.methods.comparePassword = async function (
  inputPassword: string
): Promise<boolean> {
  return await bcrypt.compare(inputPassword, this.password);
};

const User = model<IUser>("User", UserSchema);
export default User;
