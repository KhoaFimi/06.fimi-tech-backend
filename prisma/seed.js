import { PrismaClient } from '@prisma/client'
import argon2 from 'argon2'

const prisma = new PrismaClient()

const main = async () => {
	const seedPlatform = await prisma.platform.create({
		data: {
			code: 'FIMI',
			apiKey: await argon2.hash('b8a66f7d-381e-47f8-afea-83c8b0a1fd3b'),
			prize: {
				origin: 0.95
			}
		}
	})

	const sheetCategory = await prisma.category.createMany({
		data: [
			{
				name: 'Thẻ tín dụng'
			},
			{
				name: 'Tài khoản thanh toán'
			},
			{
				name: 'Vay tín chấp'
			}
		]
	})

	console.log({ seedPlatform, sheetCategory })
}

main()
	.then(async () => {
		await prisma.$disconnect
	})
	.catch(async e => {
		console.error(e)
		await prisma.$disconnect
		process.exit(1)
	})
