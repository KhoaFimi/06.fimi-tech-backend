import { z } from 'zod'

export const envSchema = z.object({
	NODE_ENV: z
		.union([
			z.literal('development'),
			z.literal('testing'),
			z.literal('production')
		])
		.default('development'),
	PORT: z.string().default('8080'),
	REDIS_HOST: z.string().default('localhost'),
	REDIS_PORT: z.string().default('6379'),
	HOST: z.string().default('localhost'),
	DOMAIN: z.string().default('http://localhost:8080'),
	API_PREFIX: z.string().default('/api'),
	GOOGLE_CLIENT_ID: z.string(),
	GOOGLE_CLIENT_SECRET: z.string(),
	GOOGLE_REFRESH_TOKEN: z.string(),
	ADMIN_EMAIL_ADDRESS: z.string(),
	ACCESS_TOKEN_EXPIRES: z.string(),
	REFRESH_TOKEN_EXPIRES: z.string()
})

declare global {
	namespace NodeJS {
		interface ProcessEnv extends z.infer<typeof envSchema> {}
	}
}

export const env = envSchema.parse(process.env)
