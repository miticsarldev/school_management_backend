import { Schema, Document } from "mongoose";

export interface IPayroll extends Document {
  _id: Schema.Types.ObjectId;
  id_users: Schema.Types.ObjectId; // ID de l'utilisateur
  montant: number;  
  statut: boolean;
}