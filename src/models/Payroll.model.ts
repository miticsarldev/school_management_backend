import { Schema, model } from "mongoose";
import { IPayroll } from "../types/IPayroll";

const PayrollSchema = new Schema<IPayroll>({
  id_users: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Users', 
  },
  montant: {
    type: Number,
    required: true,
    validate: {
    validator: (v: number) => v > 0,  // Valide que le montant est positif
    message: "Le montant doit être supérieur à 0."
    }
  },
  statut: {
    type: Boolean,
    required: true,
  },
}, { timestamps: true }); // Ajoute les champs `createdAt` et `updatedAt`

  // Méthode pour calculer le salaire restant
  PayrollSchema.methods.calculerSalaireRestant = function() {
    return this.salaire_total - this.montant_paye;
  };
  // Méthode pour ajouter un paiement
PayrollSchema.methods.ajouterPaiement = function (montant: number) {
  // Ajoute le montant au champ montant existant
  this.montant += montant;

  // Si le montant total est atteint ou dépassé, le statut est mis à jour
  if (this.montant >= this.salaire_total) {
    this.montant = this.salaire_total; // Assure que le montant payé ne dépasse pas le salaire total
    this.statut = true; // Met à jour le statut pour indiquer que tout est payé
  }

  // Met à jour la date de paiement
  this.updatedAt = new Date();
  return this.save(); // Sauvegarde les changements dans la base de données
};

export const Payroll = model<IPayroll>("Payroll", PayrollSchema);
