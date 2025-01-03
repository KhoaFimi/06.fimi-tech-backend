import { ZodError } from 'zod'
import { createMessageBuilder, fromError } from 'zod-validation-error'

export const validationError = (error: ZodError) => {
	const messageBuilder = createMessageBuilder({
		includePath: false,
		prefix: null,
		issueSeparator: ', '
	})

	const validationErrorMessage = fromError(error, {
		messageBuilder
	})

	return validationErrorMessage.message
}
