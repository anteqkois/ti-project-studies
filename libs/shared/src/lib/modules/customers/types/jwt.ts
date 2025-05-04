export interface JwtCustomer {
  iss: string // 'https://crm.maxdata.app/api/customers/auth/login',
  iat: number // 1648309024,
  exp: number // 4758709024,
  nbf: number // 1648309024,
  jti: string // '4RVNaHzrOKBZJTO8',
  sub: number // 1199,
  prv: string // '8b422e6f657932b8aebcb1bf1e356dd76a365bf2',
  plan: string // 'tier-3'
  expired_at: number;
	expired3_at: number;
	subscription_exp: number;
}
