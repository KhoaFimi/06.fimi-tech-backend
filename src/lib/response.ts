import { SuccessCode } from '@/constraints/code.constraint.js'

export class SuccessResponse<T = any> {
	statusCode: SuccessCode
	data: T

	constructor(statusCode: SuccessCode, data?: T) {
		this.statusCode = statusCode
		this.data = data
	}
}
