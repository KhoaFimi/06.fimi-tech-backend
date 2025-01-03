import { ValidationTargets } from 'hono'
import { HTTPException } from 'hono/http-exception'
import { validator } from 'hono-openapi/zod'
import { ZodSchema } from 'zod'
import { createMessageBuilder, fromError } from 'zod-validation-error'

export const zValidator = (
	target: keyof ValidationTargets,
	schema: ZodSchema
) =>
	validator(target, schema, res => {
		const messageBuilder = createMessageBuilder({
			includePath: false,
			prefix: null,
			issueSeparator: ', '
		})

		if (res.success === false) {
			const validationErrorMessage = fromError(res.error, {
				messageBuilder
			})

			throw new HTTPException(400, {
				message: validationErrorMessage.message
			})
		}
	})
