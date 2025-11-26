import jwt from 'jsonwebtoken'
import { env } from '../config/env.js'

export const generateAccessToken = (user) =>
  jwt.sign(
    {
      sub: user.id,
      role: user.role,
    },
    env.JWT_SECRET,
    {
      expiresIn: env.JWT_ACCESS_EXPIRES_IN,
    },
  )


