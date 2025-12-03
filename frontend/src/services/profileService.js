import { get, patch } from './httpClient.js'

export const getProfile = async () => {
  const response = await get('/profile/me')
  return response.data
}

export const updateProfile = async (body) => {
  const response = await patch('/profile/me', body)
  return response.data
}

export default {
  getProfile,
  updateProfile,
}


