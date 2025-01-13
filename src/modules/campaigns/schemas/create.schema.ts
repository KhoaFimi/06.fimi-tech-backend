import { z } from 'zod'

import { campaignSchema } from '@/modules/campaigns/schemas/campaign.schema.js'

export const createCampaignSchema = campaignSchema.omit({
	id: true,
	createdAt: true,
	updatedAt: true
})

export type CreateCampaignSchema = z.infer<typeof createCampaignSchema>
