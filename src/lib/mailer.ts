import { google } from 'googleapis'
import * as nodemailer from 'nodemailer'

import { env } from '@/lib/env.js'

export const mailerConfig = async () => {
	const Oauth2 = google.auth.OAuth2

	const oauth2Client = new Oauth2(
		env.GOOGLE_CLIENT_ID,
		env.GOOGLE_CLIENT_SECRET
	)

	oauth2Client.setCredentials({
		refresh_token: process.env.GOOGLE_REFRESH_TOKEN
	})

	const accessTokenObj = await oauth2Client.getAccessToken()

	const accessToken = accessTokenObj.token

	const transport = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			type: 'OAuth2',
			user: env.ADMIN_EMAIL_ADDRESS,
			clientId: env.GOOGLE_CLIENT_ID,
			clientSecret: env.GOOGLE_CLIENT_SECRET,
			refreshToken: env.GOOGLE_REFRESH_TOKEN,
			accessToken
		}
	} as nodemailer.TransportOptions)

	return transport
}

export const sendMail = async (options: nodemailer.SendMailOptions) => {
	const mailer = await mailerConfig()

	const res = await mailer.sendMail(options)

	return res
}
