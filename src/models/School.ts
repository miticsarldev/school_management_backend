import { Schema, model } from 'mongoose';
import { ISchool } from '../types/model.school.type';

// Schéma pour le modèle School
const SchoolSchema = new Schema<ISchool>({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    adresse: {
        type: String,
        required: true,
        trim: true,
    },
    phone: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    site: {
        type: String,
        trim: true,
    },
    logo: {
        type: String,
        trim: true,
    },
    statut: {
        type: Boolean,
        required: true,
        default: true, // École active par défaut
    },
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true, // Référence obligatoire à l'utilisateur (directeur)
    }
}, {
    timestamps: true, // Pour ajouter les champs createdAt et updatedAt
});

// Modèle Mongoose pour School
const School = model<ISchool>('School', SchoolSchema);

export default School;
