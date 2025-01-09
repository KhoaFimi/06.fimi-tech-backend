import { Hono } from 'hono'

import { usersController } from '@/modules/users/controllers/index.js'

export const usersRoutes = new Hono().get('/me', ...usersController.me)
