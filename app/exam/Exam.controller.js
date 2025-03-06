import asyncHandler from "express-async-handler";

import { prisma } from "../prisma.js";

// @desc    Get exams
// @route   GET /api/exams
// @access  Private
export const getExams = asyncHandler(async (req, res) => {
  const exams = await prisma.exam.findMany({
  });
  res.json(exams);
});

// @desc    Get exam
// @route   GET /api/exams/:id
// @access  Private
export const getExam = asyncHandler(async (req, res) => {
  const exam = await prisma.exam.findUnique({
    where: { id: req.params.id },
  });

  if (!exam) {
    res.status(404);
    throw new Error("Exam not found!");
  }

  res.json({ ...exam });
});

// @desc    Create new exam
// @route 	POST /api/exams
// @access  Private
export const createNewExam = asyncHandler(async (req, res) => {
  const input = req.body;

  const exam = await prisma.exam.create({
    data: {
      ...input,
    },
  });

  res.json(exam);
});

// @desc    Update exam
// @route 	PUT /api/exams/:id
// @access  Private
export const updateExam = asyncHandler(async (req, res) => {
  const input = req.body;

  try {
    const exam = await prisma.exam.update({
      where: {
        id: req.params.id,
      },
      data: { ...input },
    });

    res.json(exam);
  } catch (error) {
    res.status(404);
    throw new Error("Exam not found!");
  }
});

// @desc    Delete exam
// @route 	DELETE /api/exams/:id
// @access  Private
export const deleteExam = asyncHandler(async (req, res) => {
  try {
    const exam = await prisma.exam.delete({
      where: {
        id: req.params.id,
      },
    });

    res.json({ message: "Exam deleted!" });
  } catch (error) {
    res.status(404);
    throw new Error("Exam not found!");
  }
});
