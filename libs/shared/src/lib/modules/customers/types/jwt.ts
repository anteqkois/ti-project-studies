export interface JwtCustomer {
  iss: string // 'https://.../api/customers/auth/login',
  iat: number // 1648309024,
  exp: number // 4758709024,
  sub: string // mongo id,
}
