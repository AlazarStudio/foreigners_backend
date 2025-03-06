import asyncHandler from 'express-async-handler'

import { prisma } from '../prisma.js'
import XlsxPopulate from 'xlsx-populate'
import path from 'path'
import fs from 'fs'

// @desc    Get reports
// @route   GET /api/reports
// @access  Private
export const getReports = asyncHandler(async (req, res) => {
	const reports = await prisma.report.findMany({
		orderBy: {
			createdAt: 'desc'
		}
	})
	res.json(reports)
})


// @desc    Get report
// @route   GET /api/reports/:id
// @access  Private
export const getReport = asyncHandler(async (req, res) => {
	const report = await prisma.report.findUnique({
		where: { id: req.params.id }
	})

	if (!report) {
		res.status(404)
		throw new Error('Report not found!')
	}

	res.json({ ...report })
})


// @desc    Create new report
// @route 	POST /api/reports
// @access  Private

// Для кода отчета
const formatDateToRussian = (dateString) => {
	if (!dateString) return ""; // Если пустая строка
	const [year, month, day] = dateString.split("-");
	return `${day}.${month}.${year}`;
};

function getCurrentDateTimeFormatted() {
	const now = new Date();
  
	const day = String(now.getDate()).padStart(2, '0');
	const month = String(now.getMonth() + 1).padStart(2, '0'); // +1, потому что месяцы идут с 0
	const year = now.getFullYear();
	const hours = String(now.getHours()).padStart(2, '0');
	const minutes = String(now.getMinutes()).padStart(2, '0');
  
	return `${day}-${month}-${year} ${hours}:${minutes} `;
  }

export const createNewReport = asyncHandler(async (req, res) => {
	const { type, report } = req.body

		try {
			const templatePath = `./templates/report${type}.xlsx`

			const outputPath = `./uploads/Отчет типа ${type} по ${report.examLevel} на период с ${formatDateToRussian(report.startDate)} по ${formatDateToRussian(report.endDate)}.xlsx`

			const workbook = await XlsxPopulate.fromFileAsync(templatePath)

			const sheet = workbook.sheet(0)

			sheet.find('{{examLevel}}').forEach(cell => cell.value(report.examLevel))
			sheet.find('{{dates}}').forEach(cell => cell.value(`На период с ${formatDateToRussian(report.startDate)} по ${formatDateToRussian(report.endDate)}`))
			sheet.find('{{totalStudents}}').forEach(cell => cell.value(report.totalStudents))
			sheet.find('{{passedStudents}}').forEach(cell => cell.value(report.passedStudents))
			sheet.find('{{failedStudents}}').forEach(cell => cell.value(report.failedStudents))
			sheet.find('{{passedPercentage}}').forEach(cell => cell.value(report.passedPercentage + '%'))
			sheet.find('{{failedPercentage}}').forEach(cell => cell.value(report.failedPercentage + '%'))

			sheet.find('{{firstTry}}').forEach(cell => cell.value(report.firstTry))
			sheet.find('{{secondTry}}').forEach(cell => cell.value(report.secondTry))
			sheet.find('{{thirdTry}}').forEach(cell => cell.value(report.thirdTry))
			sheet.find('{{fourthOrMoreTry}}').forEach(cell => cell.value(report.fourthOrMoreTry))
			
			await workbook.toFileAsync(outputPath)

			res.json({
				success: true,
				message: 'Отчёт успешно создан',
				filePath: outputPath
			})
		} catch (error) {
			console.error('Ошибка при создании отчёта:', error)
			res.status(500).json({
				success: false,
				message: 'Ошибка при создании отчёта'
			})
		}
})


// @desc    Update report
// @route 	PUT /api/reports/:id
// @access  Private
export const updateReport = asyncHandler(async (req, res) => {
	const { } = req.body

	try {
		const report = await prisma.report.update({
			where: {
				id: req.params.id
			},
			data: {

			}
		})

		res.json(report)
	} catch (error) {
		res.status(404)
		throw new Error('Report not found!')
	}
})


// @desc    Delete report
// @route 	DELETE /api/reports/:id
// @access  Private
export const deleteReport = asyncHandler(async (req, res) => {
	try {
		const report = await prisma.report.delete({
			where: {
				id: req.params.id
			}
		})

		res.json({ message: 'Report deleted!' })
	} catch (error) {
		res.status(404)
		throw new Error('Report not found!')
	}
})
