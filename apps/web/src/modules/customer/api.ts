import { IAuthLoginResponse, IAuthLogoutResponse, LoginInput, SignUpInput, SignUpResponse } from "@project/shared"
import { apiClient } from "../../libs/api-client"

export class AuthApi {
  static async login(input: LoginInput) {
    return apiClient.post<IAuthLoginResponse>(
      '/auth/login',
      input,
    )
  }

  static async signUp(input: SignUpInput) {
    return apiClient.post<SignUpResponse>('/auth/signup', input)
  }

  static async logout() {
    return apiClient.post<IAuthLogoutResponse>('/auth/logout')
  }
}

export class CustomerApi {
  // static async me() {
  //   return apiClient.get(
  //     '/customer/live-chat',
  //   )
  // }
}
