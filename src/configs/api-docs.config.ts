import { openAPISpecs } from 'hono-openapi'

export const apiDocsConfig = (appRouter: any) =>
	openAPISpecs(appRouter, {
		documentation: {
			info: {
				title: 'FIMI tech backend',
				version: '0.0.1',
				description: 'FIMI tech backend'
			},
			components: {
				securitySchemes: {
					bearerAuth: {
						type: 'http',
						scheme: 'bearer',
						bearerFormat: 'JWT'
					},
					apiKey: {
						type: 'apiKey',
						in: 'header',
						name: 'X-API-KEY'
					},
					partnerCode: {
						type: 'apiKey',
						in: 'header',
						name: 'X-PARTNER-CODE'
					}
				}
			},
			servers: [{ url: 'http://localhost:8080', description: 'Local Server' }]
		}
	})
