import { generateRefreshTokenService } from '@/modules/token/services/refresh-token/generate.service.js'
import { refreshTokenPairService } from '@/modules/token/services/refresh-token/refresh.service.js'

export const refreshTokenService = {
	generate: generateRefreshTokenService,
	refresh: refreshTokenPairService
}
