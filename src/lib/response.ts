import { SuccessCode } from '@/constraints/code.constraint.js'

interface IResponse<T = any> {
	statusCode: SuccessCode
	message: string
	data?: T
}

export class SuccessResponse<T = any> {
	statusCode: SuccessCode
	message: string
	data: T

	constructor({ statusCode, message, data }: IResponse<T>) {
		this.statusCode = statusCode
		this.message = message
		this.data = data
	}
}
