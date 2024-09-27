import { Schema, Document } from "mongoose";

// Interface ITuitionFee
export interface ITuitionFee extends Document {
  _id: Schema.Types.ObjectId;
  amount: number;
  due_date: Date;
  payment_mode: string;
  paid_date?: Date;
  fine: number;
  discount: number;
  balance: number;
  student_id: Schema.Types.ObjectId; // Référence à l'étudiant
  classroom_id: Schema.Types.ObjectId; // Référence à la classe
  status: string;
  createdAt: Date;

  // Méthode pour mettre à jour l'état du paiement
  updatePaymentStatus: (paidAmount: number) => void;

  // Méthode pour calculer le solde restant après le paiement
  calculateBalance: (paidAmount: number) => number;
}
