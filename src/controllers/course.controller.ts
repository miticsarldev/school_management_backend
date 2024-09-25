import { Request, Response } from "express";
import Course from "../models/Course";

// Créer un nouveau cours
export const createCourse = async (req: Request, res: Response) => {
    try {
      const { name, number_of_hours, description, id_user, id_grade, id_classroom, statuses } = req.body;
  
      const courseExists = await Course.findOne({ name });
      if (courseExists) {
        return res.status(400).json({ message: "Ce cours existe déjà" });
      }
  
      const course = new Course({
        name,
        number_of_hours,
        description,
        id_user,
        id_grade,
        id_classroom,
        statuses,
      });
  
      await course.save();
      res.status(201).json({ message: "Cours ajouter avec succès", course });
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Erreur lors de la création du cours :", error.message); // Log l'erreur
        res.status(500).json({ message: "Erreur de serveur", error: error.message }); // Inclure le message d'erreur
      } else {
        console.error("Erreur inattendue:", error); // Gérer les autres types d'erreurs
        res.status(500).json({ message: "Erreur de serveur" });
      }
    }
  };

// afficher tous les cours
export const getCourses = async (req: Request, res: Response) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: "Erreur de serveur" });
  }
};

// modifier un cours
export const updateCourse = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, number_of_hours, description, id_user, id_grade, id_classroom, statuses } = req.body;

    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({ message: "Cours introuvable" });
    }

    course.name = name;
    course.number_of_hours = number_of_hours;
    course.description = description;
    course.id_user = id_user;
    course.id_grade = id_grade;
    course.id_classroom = id_classroom;
    course.statuses = statuses;

    await course.save();
    res.json({ message: "Cours modifié avec succès", course });
  } catch (error) {
    res.status(500).json({ message: "Erreur de serveur" });
  }
};

// Supprimer un cours
export const deleteCourse = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const course = await Course.findByIdAndDelete(id);
    if (!course) {
      return res.status(404).json({ message: "Cours introuvable" });
    }

    res.json({ message: "Cours supprimer avec succès" });
  } catch (error) {
    res.status(500).json({ message: "Erreur de serveur" });
  }
};

// afficher un cours par id
export const getCourseById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({ message: "Cours introuvable" });
    }

    res.json(course);
  } catch (error) {
    res.status(500).json({ message: "Erreur de serveur" });
  }
};
