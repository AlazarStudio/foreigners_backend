import express from 'express'

import { protect } from '../middleware/auth.middleware.js'

import {
	createNewExam,
	deleteExam,
	getExam,
	getExams,
	updateExam
} from './exam.controller.js'

const router = express.Router()

router.route('/').post( createNewExam).get( getExams)

router
	.route('/:id')
	.get( getExam)
	.put( updateExam)
	.delete( deleteExam)

export default router
