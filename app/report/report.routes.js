import express from 'express'

import { protect } from '../middleware/auth.middleware.js'

import {
	createNewReport,
	deleteReport,
	getReport,
	getReports,
	updateReport
} from './report.controller.js'

const router = express.Router()

router.route('/').post( createNewReport).get( getReports)

router
	.route('/:id')
	.get( getReport)
	.put( updateReport)
	.delete( deleteReport)

export default router
