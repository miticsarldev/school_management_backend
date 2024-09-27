// controllers/homework.controller.ts
import { Request, Response } from 'express';
import { HomeworkModel } from '../models/homework.model';

export const addHomework = async (req: Request, res: Response) => {
  try {
    const newHomework = new HomeworkModel(req.body);
    await newHomework.save();
    res.status(201).json(newHomework);
  } catch (error) {
    res.status(500).json({ message: 'Error adding homework', error });
  }
};

export const updateHomework = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const updatedHomework = await HomeworkModel.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedHomework) return res.status(404).json({ message: 'Homework not found' });
    res.status(200).json(updatedHomework);
  } catch (error) {
    res.status(500).json({ message: 'Error updating homework', error });
  }
};

export const deleteHomework = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const deletedHomework = await HomeworkModel.findByIdAndDelete(id);
    if (!deletedHomework) return res.status(404).json({ message: 'Homework not found' });
    res.status(200).json({ message: 'Homework deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting homework', error });
  }
};

export const getHomeworks = async (req: Request, res: Response) => {
  try {
    const homeworks = await HomeworkModel.find();
    res.status(200).json(homeworks);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching homework', error });
  }
};
