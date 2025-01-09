import { generateRefreshTokenService } from '@/modules/token/services/refresh-token/generate.service.js'
import { refreshTokenPairService } from '@/modules/token/services/refresh-token/refresh.service.js'
import { verifyRefreshTokenService } from '@/modules/token/services/refresh-token/verify.service.js'

export const refreshTokenService = {
	generate: generateRefreshTokenService,
	refresh: refreshTokenPairService,
	verify: verifyRefreshTokenService
}
