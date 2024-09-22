import { Schema } from "mongoose";

export interface IUser extends Document {
  _id: Schema.Types.ObjectId;
  firstname: string;
  lastname: string;
  email: string;
  username: string;
  telephone: string;
  password: string;
  bio?: string;
  birthdate?: Date;
  gender?: string;

  country?: string;
  city?: string;
  quarter?: string;
  street?: string;
  door?: string;
  image?: string;

  website?: string;
  role: string;
  status: string;
  lastLogin: Date;
  createdAt: Date;
  comparePassword: (inputPassword: string) => Promise<boolean>;
}
