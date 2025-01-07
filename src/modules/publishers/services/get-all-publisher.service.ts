import { Prisma } from '@prisma/client'

import { SuccessCode } from '@/constraints/code.constraint.js'
import { db } from '@/lib/db.js'
import { SuccessResponse } from '@/lib/response.js'
import { GetAllPublisherSchema } from '@/modules/publishers/schemas/get-all-publisher.schema.js'

type GetAllPublisherArgs = Pick<GetAllPublisherSchema, 'limit' | 'page'> & {
	where: Prisma.PublisherWhereInput
}

export const getAllPublisherService = async ({
	page = '1',
	limit = '10',
	where
}: GetAllPublisherArgs) => {
	const take = parseInt(limit)

	const skip = (parseInt(page) - 1) * take

	const [existingPublishers, total] = await db.$transaction([
		db.publisher.findMany({
			skip,
			take,
			where
		}),
		db.publisher.count({
			where
		})
	])

	return new SuccessResponse(SuccessCode.OK, {
		users: existingPublishers,
		total
	})
}
