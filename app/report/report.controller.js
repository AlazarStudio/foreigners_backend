import asyncHandler from 'express-async-handler'

import { prisma } from '../prisma.js'


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

export const createNewReport = asyncHandler(async (req, res) => {
	const {  } = req.body

	const report = await prisma.report.create({
		data: {
			
		}
	})

	res.json(report)
})


// @desc    Update report
// @route 	PUT /api/reports/:id
// @access  Private
export const updateReport = asyncHandler(async (req, res) => {
	const {  } = req.body

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
