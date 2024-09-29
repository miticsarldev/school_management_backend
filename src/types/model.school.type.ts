import { Document, Schema } from 'mongoose';

// Interface pour le modèle School
export interface ISchool extends Document {
    name: string;
    adresse: string;
    phone: string;
    email: string;
    site?: string; // Site web optionnel
    logo?: string; // Logo optionnel
    statut: boolean; // Actif ou non
    user_id: Schema.Types.ObjectId; // Liaison avec un utilisateur (le directeur)
}
