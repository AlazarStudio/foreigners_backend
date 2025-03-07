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

		// 1
		sheet.find('{{examLevel}}').forEach(cell => cell.value(report.examLevel))
		sheet.find('{{dates}}').forEach(cell => cell.value(`На период с ${formatDateToRussian(report.startDate)} по ${formatDateToRussian(report.endDate)}`))
		sheet.find('{{totalStudents}}').forEach(cell => cell.value(report.totalStudents))
		sheet.find('{{passedStudents}}').forEach(cell => cell.value(report.passedStudents))
		sheet.find('{{failedStudents}}').forEach(cell => cell.value(report.failedStudents))
		sheet.find('{{passedPercentage}}').forEach(cell => cell.value(report.passedPercentage + '%'))
		sheet.find('{{failedPercentage}}').forEach(cell => cell.value(report.failedPercentage + '%'))

		// 2
		sheet.find('{{firstTry}}').forEach(cell => cell.value(report.firstTry))
		sheet.find('{{secondTry}}').forEach(cell => cell.value(report.secondTry))
		sheet.find('{{thirdTry}}').forEach(cell => cell.value(report.thirdTry))
		sheet.find('{{fourthOrMoreTry}}').forEach(cell => cell.value(report.fourthOrMoreTry))


		// 3

		sheet.find('{{RL1}}').forEach(cell => cell.value(report.blocks["Русский язык"].questionStats[0]))
		sheet.find('{{RL2}}').forEach(cell => cell.value(report.blocks["Русский язык"].questionStats[1]))
		sheet.find('{{RL3}}').forEach(cell => cell.value(report.blocks["Русский язык"].questionStats[2]))
		sheet.find('{{RL4}}').forEach(cell => cell.value(report.blocks["Русский язык"].questionStats[3]))
		sheet.find('{{RL5}}').forEach(cell => cell.value(report.blocks["Русский язык"].questionStats[4]))
		sheet.find('{{RL6}}').forEach(cell => cell.value(report.blocks["Русский язык"].questionStats[5]))
		sheet.find('{{RL7}}').forEach(cell => cell.value(report.blocks["Русский язык"].questionStats[6]))
		sheet.find('{{RL8}}').forEach(cell => cell.value(report.blocks["Русский язык"].questionStats[7]))
		sheet.find('{{RL9}}').forEach(cell => cell.value(report.blocks["Русский язык"].questionStats[8]))

		sheet.find('{{RH1}}').forEach(cell => cell.value(report.blocks["История России"].questionStats[0]))
		sheet.find('{{RH2}}').forEach(cell => cell.value(report.blocks["История России"].questionStats[1]))
		sheet.find('{{RH3}}').forEach(cell => cell.value(report.blocks["История России"].questionStats[2]))
		sheet.find('{{RH4}}').forEach(cell => cell.value(report.blocks["История России"].questionStats[3]))
		sheet.find('{{RH5}}').forEach(cell => cell.value(report.blocks["История России"].questionStats[4]))

		sheet.find('{{RLAW1}}').forEach(cell => cell.value(report.blocks["Основы законодательства РФ"].questionStats[0]))
		sheet.find('{{RLAW2}}').forEach(cell => cell.value(report.blocks["Основы законодательства РФ"].questionStats[1]))
		sheet.find('{{RLAW3}}').forEach(cell => cell.value(report.blocks["Основы законодательства РФ"].questionStats[2]))
		sheet.find('{{RLAW4}}').forEach(cell => cell.value(report.blocks["Основы законодательства РФ"].questionStats[3]))
		sheet.find('{{RLAW5}}').forEach(cell => cell.value(report.blocks["Основы законодательства РФ"].questionStats[4]))
		sheet.find('{{RLAW6}}').forEach(cell => cell.value(report.blocks["Основы законодательства РФ"].questionStats[5]))

		// 4
		sheet.find('{{RL1}}').forEach(cell => cell.value(report.blocks["Русский язык"].stats[0]))
		sheet.find('{{RL2}}').forEach(cell => cell.value(report.blocks["Русский язык"].stats[1]))
		sheet.find('{{RL3}}').forEach(cell => cell.value(report.blocks["Русский язык"].stats[2]))
		sheet.find('{{RL4}}').forEach(cell => cell.value(report.blocks["Русский язык"].stats[3]))
		sheet.find('{{RL5}}').forEach(cell => cell.value(report.blocks["Русский язык"].stats[4]))
		sheet.find('{{RL6}}').forEach(cell => cell.value(report.blocks["Русский язык"].stats[5]))
		sheet.find('{{RL7}}').forEach(cell => cell.value(report.blocks["Русский язык"].stats[6]))
		sheet.find('{{RL8}}').forEach(cell => cell.value(report.blocks["Русский язык"].stats[7]))
		sheet.find('{{RL9}}').forEach(cell => cell.value(report.blocks["Русский язык"].stats[8]))
		sheet.find('{{RL10}}').forEach(cell => cell.value(report.blocks["Русский язык"].stats[9]))

		sheet.find('{{RH1}}').forEach(cell => cell.value(report.blocks["История России"].stats[0]))
		sheet.find('{{RH2}}').forEach(cell => cell.value(report.blocks["История России"].stats[1]))
		sheet.find('{{RH3}}').forEach(cell => cell.value(report.blocks["История России"].stats[2]))
		sheet.find('{{RH4}}').forEach(cell => cell.value(report.blocks["История России"].stats[3]))
		sheet.find('{{RH5}}').forEach(cell => cell.value(report.blocks["История России"].stats[4]))
		sheet.find('{{RH6}}').forEach(cell => cell.value(report.blocks["История России"].stats[5]))

		sheet.find('{{RLAW1}}').forEach(cell => cell.value(report.blocks["Основы законодательства РФ"].stats[0]))
		sheet.find('{{RLAW2}}').forEach(cell => cell.value(report.blocks["Основы законодательства РФ"].stats[1]))
		sheet.find('{{RLAW3}}').forEach(cell => cell.value(report.blocks["Основы законодательства РФ"].stats[2]))
		sheet.find('{{RLAW4}}').forEach(cell => cell.value(report.blocks["Основы законодательства РФ"].stats[3]))
		sheet.find('{{RLAW5}}').forEach(cell => cell.value(report.blocks["Основы законодательства РФ"].stats[4]))
		sheet.find('{{RLAW6}}').forEach(cell => cell.value(report.blocks["Основы законодательства РФ"].stats[5]))
		sheet.find('{{RLAW7}}').forEach(cell => cell.value(report.blocks["Основы законодательства РФ"].stats[6]))

		sheet.find('{{RLHQ}}').forEach(cell => cell.value(report.blocks["Русский язык"].hardestQuestions.map(q => `№${q.question}`).join(", ")))
		sheet.find('{{RHHQ}}').forEach(cell => cell.value(report.blocks["История России"].hardestQuestions.map(q => `№${q.question}`).join(", ")))
		sheet.find('{{RLAWHQ}}').forEach(cell => cell.value(report.blocks["Основы законодательства РФ"].hardestQuestions.map(q => `№${q.question}`).join(", ")))

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
