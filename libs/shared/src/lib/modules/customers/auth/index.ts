import { z } from 'zod'
import { stringShortSchema } from '../../../libs/zod'
import { Customer } from '../types/customer'

export const signUpInputSchema = z.object({
  email: z.string().email().min(3).max(50),
  password: z.string().min(6).max(60),
  name: stringShortSchema,
})
export type SignUpInput = z.infer<typeof signUpInputSchema>

export interface SignUpResponse {
  customer: Customer
  error: string | undefined
}

export interface RefreshTokenResponse {
  success: true
}

export const loginInputSchema = signUpInputSchema.pick({
  email: true,
  password: true,
})
export type LoginInput = z.infer<typeof loginInputSchema>

export interface IAuthLoginResponse {
  customer: Customer
}

export interface IAuthLogoutResponse {
  error: string | undefined
}

export enum AuthStatus {
  LOADING = 'LOADING',
  AUTHENTICATED = 'AUTHENTICATED',
  UNAUTHENTICATED = 'UNAUTHENTICATED',
}
