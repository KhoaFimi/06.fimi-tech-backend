import { GENDER } from '@prisma/client'
import { z } from 'zod'

export const publisherSchema = z
	.object({
		id: z.string(),
		code: z.string(),
		fullname: z.string(),
		phone: z.string(),
		email: z.string(),
		level: z.string(),
		password: z.string(),
		document: z
			.object({
				citizenIdentification: z.string(),
				dateOfIssue: z.string(),
				placeOfIssue: z.string(),
				imageFront: z.string().nullish(),
				imageBack: z.string().nullish(),
				potrait: z.string().nullish(),
				spec: z.any()
			})
			.optional()
			.nullish(),
		profile: z
			.object({
				dateOfBirth: z.string(),
				placeOfBirth: z.string(),
				gender: z.nativeEnum(GENDER),
				avatar: z.string(),
				workAt: z.string(),
				currentAddress: z
					.object({
						detail: z.string(),
						ward: z.string(),
						district: z.string(),
						province: z.string()
					})
					.optional()
					.nullish(),
				bank: z
					.object({
						accountName: z.string(),
						accountNumber: z.string(),
						name: z.string()
					})
					.optional()
					.nullish()
			})
			.optional()
			.nullish(),
		createdAt: z.coerce.date(),
		updatedAt: z.coerce.date()
	})
	.omit({
		password: true
	})
