import { Request, Response, NextFunction } from "express";
import Joi from "joi";
import JoiPasswordComplexity, {
  ComplexityOptions,
} from "joi-password-complexity";
import { IUser } from "../types/models.type";

const myComplexity: ComplexityOptions = {
  min: 8,
  max: 26,
  lowerCase: 1,
  upperCase: 1,
  numeric: 1,
  symbol: 1,
  requirementCount: 8,
};

const userSchema = Joi.object<IUser>({
  firstname: Joi.string().required(),
  lastname: Joi.string().required(),
  email: Joi.string().email().required(),
  username: Joi.string().required(),
  telephone: Joi.string().required(),
  password: JoiPasswordComplexity(myComplexity).required(),
  bio: Joi.string(),
  birthdate: Joi.date(),
  gender: Joi.string().default("Masculin"),
  country: Joi.string(),
  city: Joi.string(),
  quarter: Joi.string(),
  street: Joi.string(),
  door: Joi.string(),
  image: Joi.string(),
  website: Joi.string(),
  role: Joi.string().required(),
  status: Joi.string().default("Actif"),
  lastLogin: Joi.date(),
  createdAt: Joi.date().default(Date.now),
});

export const validateUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { error } = userSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};
