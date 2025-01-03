/* eslint-disable @typescript-eslint/no-unused-expressions */

import * as crypto from 'node:crypto'
import * as path from 'node:path'

import * as fs from 'fs'

const basePath = 'secure'

interface IKeyPath {
	private: string
	public: string
}

const checkExistKeyFolder = (name: string = basePath) => {
	const checkPath = path.join(process.cwd(), name)

	!fs.existsSync(checkPath) && fs.mkdir(checkPath, err => err)
}

const accessTokenKeyPaths = {
	private: path.join(process.cwd(), basePath, 'access-token-private.key'),
	public: path.join(process.cwd(), basePath, 'access-token-public.key')
} satisfies IKeyPath

const refreshTokenKeyPaths = {
	private: path.join(process.cwd(), basePath, 'refresh-token-private.key'),
	public: path.join(process.cwd(), basePath, 'refresh-token-public.key')
} satisfies IKeyPath

const generateKeyPair = (paths: IKeyPath) => {
	checkExistKeyFolder()

	const privateKeyExisted = fs.existsSync(paths.private)
	const publicKeyExisted = fs.existsSync(paths.public)

	if (privateKeyExisted && publicKeyExisted)
		return {
			privateKey: fs.readFileSync(paths.private, 'utf-8'),
			publicKey: fs.readFileSync(paths.public, 'utf-8')
		}

	const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
		modulusLength: 2048,
		publicKeyEncoding: {
			type: 'spki',
			format: 'pem'
		},
		privateKeyEncoding: {
			type: 'pkcs8',
			format: 'pem'
		}
	})

	fs.writeFileSync(paths.private, privateKey)
	fs.writeFileSync(paths.public, publicKey)

	return {
		privateKey,
		publicKey
	}
}

export const {
	privateKey: accessTokenPrivateKey,
	publicKey: accessTokenPublicKey
} = generateKeyPair(accessTokenKeyPaths)

export const {
	privateKey: refreshTokenPrivateKey,
	publicKey: refreshTokenPublicKey
} = generateKeyPair(refreshTokenKeyPaths)
