import { generateAccessTokenService } from '@/modules/token/services/access-token/generate.service.js'
import { verifyAccessTokenService } from '@/modules/token/services/access-token/verify.service.js'

export const accessTokenService = {
	generate: generateAccessTokenService,
	verify: verifyAccessTokenService
}
