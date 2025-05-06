import { waitMs } from '@project/shared'
import axios from 'axios'

export const redirectToLogin = () => {
  window.location.href = `/login?from=${window.location.pathname}`
}

export const API_URL = process.env.NEXT_PUBLIC_API_HOST ?? 'https://api.linkerry.com'

const apiClient = axios.create({
  withCredentials: true,
  baseURL: `${API_URL}/api/v1`,
})

apiClient.interceptors.request.use(async (config) => {
  // config.headers.fingerprint = await fingerprint
  return config
})

apiClient.interceptors.response.use(
  (config) => {
    return config
  },
  async (error) => {
    const originalRequest = error.config

    if (
      // token expired
      (error?.response?.status == 401 && error?.config && !error?.config?._isRetry) ||
      // CORS occurs
      ((error.message === 'Network Error' || error.message.includes('CORS')) && error?.config && !error?.config?._isRetry)
    ) {
      originalRequest._isRetry = true
      try {
        const response = await axios.get<{ success: boolean }>(`${API_URL}/api/v1/auth/refresh`, {
          withCredentials: true,
          headers: {
            // fingerprint: await fingerprint,
          },
        })
        if (response.data.success) {
          await waitMs(500)
          return apiClient.request(originalRequest)
        }
        // Move user to login page, tell that session expired
        // clearAuthCookies()
        await redirectToLogin()
      } catch (e) {
        // clearAuthCookies()
        await redirectToLogin()
      }
    }
    throw error
  },
)

export { apiClient }
