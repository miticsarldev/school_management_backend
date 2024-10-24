import { Request, Response } from "express";
import Course from "../models/Course";
import mongoose from "mongoose";
import ClassroomEtudiant from "../models/ClassroomEtudiant";
import Timetable from "../models/Timetable";
import User from "../models/User";

// Créer un nouveau cours
export const createCourse = async (req: Request, res: Response) => {
    try {
      const { name, number_of_hours, description, id_user, id_grade, id_classroom_etudiant, statuses } = req.body;
  
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
        id_classroom_etudiant,
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
  }
// afficher tous les cours
export const getCourses = async (req: Request, res: Response) => {
  try {
    const courses = await Course.find().populate("id_classroom_etudiant").populate("id_grade").populate("id_user");
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: "Erreur de serveur" });
  }
};
// Récupérer tous les enseignants qui enseignent dans la même classe que l'étudiant
export const getTeachersByStudentClass = async (req: Request, res: Response) => {
  try {
     const studentId = req.params.student_id;
     const studentObjectId = new mongoose.Types.ObjectId(studentId);
 
     // Récupérer la classes associées à l'étudiant
     const classroomEtudiant = await ClassroomEtudiant.findOne({ student_id: studentObjectId }).populate('classroom_id');
 
     if (!classroomEtudiant ) {
       return res.status(404).json({ message: "Aucune classe trouvée pour cet étudiant." });
     }
     // Trouver tous les cours dispensés dans la classe de l'étudiant
     const coursesInClass = await Course.find({ id_classroom_etudiant: classroomEtudiant._id })
     .populate("id_classroom_etudiant")
     .populate("id_user");

     if (coursesInClass.length === 0) {
       return res.status(404).json({ error: "Aucun cours trouvé dans cette classe." });
     }
    // Récupérer les détails des cours à partir de `timetable`
    const coursesWithTeacher = coursesInClass.map(t => {
      return {
        courseId: t._id, // Les informations sur le cours
        name:t.name,
        teacher: t.id_user, // Les informations sur l'enseignant
      };
    });

    res.json(coursesWithTeacher);
  } catch (error) {
    // Gestion des erreurs
    res.status(400).json({ error: 'Erreur lors de la récupération des enseignants pour la classe de l\'étudiant.' });
  }
};


// Afficher les cours par StudentID avec les horaires
export const getCourseByStudentId = async (req: Request, res: Response) => {
  try {
    const studentId = req.params.student_id;
    const studentObjectId = new mongoose.Types.ObjectId(studentId);

    // Récupérer les classes associées à l'étudiant
    const classrooms = await ClassroomEtudiant.find({ student_id: studentObjectId }).populate('classroom_id');

    if (!classrooms || classrooms.length === 0) {
      return res.status(404).json({ message: "Aucune classe trouvée pour cet étudiant." });
    }

    // Extraire les IDs de classrooms
    const classroomIds = classrooms.map(classroom => classroom.classroom_id);

    // Récupérer les emplois du temps associés aux classes de l'étudiant
    const timetable = await Timetable.find({ classroom_id: { $in: classroomIds } })
      .populate('cours_id') // Populate pour récupérer les détails des cours
      .populate('classroom_id') // Populate pour les détails des salles de classe
      .populate('id_users'); // Populate pour les détails des enseignants

    if (!timetable || timetable.length === 0) {
      return res.status(404).json({ message: "Aucun emploi du temps trouvé pour ces classes." });
    }

    // Récupérer les détails des cours à partir de `timetable`
    const coursesWithTimetable = timetable.map(t => {
      return {
        course: t.cours_id, // Les informations sur le cours
        day: t.day,
        start_time: t.start_time,
        end_time: t.end_time,
        classroom: t.classroom_id, // Les informations sur la salle de classe
        teacher: t.id_users, // Les informations sur l'enseignant
      };
    });

    res.json(coursesWithTimetable);
  } catch (error) {
    console.error("Error in getCourseByStudentId:", error);
    res.status(500).json({ message: "Erreur de serveur" });
  }
};



// modifier un cours
// export const updateCourse = async (req: Request, res: Response) => {
//   try {
//     const { id } = req.params;
//     const { name, number_of_hours, description, id_user, id_grade, id_classroom_etudiant, statuses } = req.body;

//     // Vérifiez si un autre cours avec le même nom existe déjà
//     const existingCourse = await Course.findOne({ name }).populate("id_classroom_etudiant").populate("id_grade").populate("id_user");
//     if (existingCourse && existingCourse._id.toString() !== id) {
//       return res.status(400).json({ message: "Un cours avec ce nom existe déjà" });
//     }

//     // Trouver le cours par ID
//     const course = await Course.findById(id).populate("id_classroom_etudiant").populate("id_grade").populate("id_user");
//     if (!course) {
//       return res.status(404).json({ message: "Cours introuvable" });
//     }
//     // Mise à jour des champs
//     course.name = name;
//     course.number_of_hours = number_of_hours;
//     course.description = description;
//     course.id_user = id_user;
//     course.id_grade = id_grade;
//     course.id_classroom_etudiant = id_classroom_etudiant;
//     course.statuses = statuses;

//     await course.save();
//     res.json({ message: "Cours modifié avec succès", course });
//   } catch (error) {
//     res.status(500).json({ message: "Erreur de serveur" });
//   }
// };
export const updateCourse = async (req: Request, res: Response) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!course) return res.status(404).json({ error: "cours non trouvé." });
    res.status(200).json(course);
  } catch (error) {
    res.status(400).json({ error: "Erreur lors de la mise à jour de l'cours." });
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

    const course = await Course.findById(id).populate("id_classroom_etudiant").populate("id_grade").populate("id_user");
    if (!course) {
      return res.status(404).json({ message: "Cours introuvable" });
    }

    res.json(course);
  } catch (error) {
    res.status(500).json({ message: "Erreur de serveur" });
  }
};
