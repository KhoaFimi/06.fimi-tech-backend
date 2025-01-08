import { Context } from 'hono'
import { HTTPException } from 'hono/http-exception'
import { HTTPResponseError } from 'hono/types'

export const errorHandlerConfig = (
	err: Error | HTTPResponseError,
	c: Context
) => {
	if (err instanceof HTTPException) {
		const res = err.getResponse()

		const statusCode = res.headers.get('statusCode')

		return c.json(
			{
				statusCode,
				message: err.message
			},
			err.status
		)
	}
}
