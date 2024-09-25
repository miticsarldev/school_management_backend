import { Request, Response } from "express";
import Classroom from "../models/Classroom";

// Ajouter une classroom
export const createClassroom = async (req: Request, res: Response) => {
  try {
    const { name, capacity, statuses } = req.body;

    const classroomExists = await Classroom.findOne({ name });
    if (classroomExists) {
      return res.status(400).json({ message: "La salle de classe existe déjà" });
    }

    const classroom = new Classroom({
      name,
      capacity,
      statuses,
    });

    await classroom.save();
    res.status(201).json({ message: "Salle de classe créée avec succès", classroom });
  } catch (error) {
    res.status(500).json({ message: "Erreur de serveur" });
  }
};

// Afficher toutes les classrooms
export const getClassrooms = async (req: Request, res: Response) => {
  try {
    const classrooms = await Classroom.find();
    res.json(classrooms);
  } catch (error) {
    res.status(500).json({ message: "Erreur de serveur" });
  }
};

//  Modifier une classroom
// export const updateClassroom = async (req: Request, res: Response) => {
//   try {
//     const { id } = req.params;
//     const { name, capacity, statuses } = req.body;

//     const classroom = await Classroom.findById(id);
//     if (!classroom) {
//       return res.status(404).json({ message: "Salle de classe introuvable" });
//     }

//     classroom.name = name;
//     classroom.capacity = capacity;
//     classroom.statuses = statuses;

//     await classroom.save();
//     res.json({ message: "Salle de classe mise à jour avec succès", classroom });
//   } catch (error) {
//     res.status(500).json({ message: "Erreur de serveur" });
//   }
// };

export const updateClassroom = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { name, capacity, statuses } = req.body;
  
      // Vérifiez si une autre salle de classe avec le même nom existe déjà
      const existingClassroom = await Classroom.findOne({ name });
      if (existingClassroom && existingClassroom._id.toString() !== id) {
        return res.status(400).json({ message: "Une salle de classe avec ce nom existe déjà" });
      }
  
      // Trouver la salle de classe par ID
      const classroom = await Classroom.findById(id);
      if (!classroom) {
        return res.status(404).json({ message: "Salle de classe introuvable" });
      }
  
      // Mise à jour des champs
      classroom.name = name;
      classroom.capacity = capacity;
      classroom.statuses = statuses;
  
      await classroom.save();
      res.json({ message: "Salle de classe mise à jour avec succès", classroom });
    } catch (error) {
      res.status(500).json({ message: "Erreur de serveur" });
    }
  };
  

// Supprimer une classroom
export const deleteClassroom = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const classroom = await Classroom.findByIdAndDelete(id);
    if (!classroom) {
      return res.status(404).json({ message: "Salle de classe introuvable" });
    }

    res.json({ message: "Salle de classe supprimée avec succès" });
  } catch (error) {
    res.status(500).json({ message: "Erreur de serveur" });
  }
};

// Afficher une classroom par ID
export const getClassroomById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const classroom = await Classroom.findById(id);
    if (!classroom) {
      return res.status(404).json({ message: "Salle de classe introuvable" });
    }

    res.json(classroom);
  } catch (error) {
    res.status(500).json({ message: "Erreur de serveur" });
  }
};