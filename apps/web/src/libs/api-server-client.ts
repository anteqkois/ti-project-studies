import { RefreshTokenResponse } from '@project/shared'
import axios from 'axios'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export const API_URL = process.env.NEXT_PUBLIC_API_HOST

const apiServerClient = axios.create({
  withCredentials: true,
  baseURL: API_URL,
})

apiServerClient.interceptors.request.use(async (config) => {
  // Pass client cookies on server to axios instance
  cookies().getAll()
  let cookieString = ''
  cookies()
    .getAll()
    .forEach((cookie) => {
      cookieString += `${cookie.name}=${cookie.value}; `
    })
  config.headers.Cookie = cookieString
  // config.headers.fingerprint = await fingerprint
  return config
})

apiServerClient.interceptors.response.use(
  (config) => {
    return config
  },
  async (error) => {
    const originalRequest = error.config
    if (error.response.status == 401 && error.config && !error.config._isRetry) {
      originalRequest._isRetry = true
      try {
        const response = await axios.get<RefreshTokenResponse>(`${API_URL}/api/v1/auth/refresh`, {
          withCredentials: true,
          headers: {
            // fingerprint: await fingerprint,
          },
        })
        if (response.data.success) return apiServerClient.request(originalRequest)
        // Move customer to login page, tell that session expired
        await redirect('/login')
      } catch (error) {
        console.error({ e: error })
        await redirect('/login')
      }
    }
    throw error
  },
)

export { apiServerClient }
