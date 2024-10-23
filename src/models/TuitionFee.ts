import { Schema, model } from "mongoose";
import { ITuitionFee } from "../types/model.tuitionfee.type";

// Schéma des frais de scolarité
const TuitionFeeSchema = new Schema<ITuitionFee>({
  amount: {
    type: Number,
    required: true,
  },
  due_date: {
    type: Date,
    required: true,
  },
  payment_mode: {
    type: String,
    enum: ["cash", "credit_card", "bank_transfer", "mobile_payment"],
    required: true,
    trim: true,
  },
  paid_date: {
    type: Date,
  },
  fine: {
    type: Number,
    default: 0,
  },
  discount: {
    type: Number,
    default: 0,
  },
  balance: {
    type: Number,
    default: function () {
      return this.amount - this.discount;
    },
  },
  student_id: {
    type: Schema.Types.ObjectId,
    ref: "User", // Référence à l'étudiant
    required: true,
  },
  classroom_id: {
    type: Schema.Types.ObjectId,
    ref: "Classroom", // Référence à la classe
    required: true,
  },
  status: {
    type: String,
    enum: ["unpaid", "paid", "overdue"],
    default: "unpaid",
  },
}, {
  timestamps: true, // Pour ajouter les champs createdAt et updatedAt
});

// Méthode pour mettre à jour le statut de paiement
TuitionFeeSchema.methods.updatePaymentStatus = function (paidAmount: number) {
  this.balance = this.calculateBalance(paidAmount);
  this.status = this.balance === 0 ? "paid" : "unpaid";
  this.paid_date = new Date();
};

// Méthode pour calculer le solde restant après paiement
TuitionFeeSchema.methods.calculateBalance = function (paidAmount: number) {
  return this.amount - this.discount - paidAmount + this.fine;
};

const TuitionFee = model<ITuitionFee>("TuitionFee", TuitionFeeSchema);
export default TuitionFee;
