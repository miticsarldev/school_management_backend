import { Schema, model } from "mongoose";
import { IPayroll } from "../types/model.payroll.type";

const PayrollSchema = new Schema<IPayroll>(
  {
    id_users: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Users",
    },
    montant: {
      type: Number,
      required: true,
      validate: {
        validator: (v: number) => v > 0, // Valide que le montant est positif
        message: "Le montant doit être supérieur à 0.",
      },
    },
    statut: {
      type: Boolean,
      required: true,
    },
  },
  { timestamps: true }
); // Ajoute les champs `createdAt` et `updatedAt`

export const Payroll = model<IPayroll>("Payroll", PayrollSchema);
