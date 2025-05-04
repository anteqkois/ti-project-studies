interface UserPlan {
  id: number
  group_id: number
  plan: 'Tier 0' | 'Tier 1' | 'Tier 2' | 'Tier 3'
  slug: 'tier-0' | 'tier-1' | 'tier-2' | 'tier-3'
  priority: number
  deleted_at: string | null // "2021-10-29T18:41:38.000000Z"
  created_at: string // "2021-10-29T18:41:38.000000Z"
  updated_at: string // "2023-06-02T07:19:04.000000Z"
}

type Visibility = 'full'
export type NotificationPercentage = 'disabled' | '50_percent' | '100_percent'

type AlertConfig = {
  visibility: Visibility[] // ['full']
  notifications: NotificationPercentage[] // ['100_percent']
  running_alerts_limit: string[] // ['480']
  created_alerts_limit: string[] // ['500']
}

type ProAlertConfig = {
  visibility: Visibility[] // ['full']
  notifications: NotificationPercentage[] // ['100_percent']
  running_pro_alerts_limit: string[] // ['15']
  created_pro_alerts_limit: string[] // ['50']
}

type BacktestConfig = {
  daily_seconds_limit: string[] // ['700']
}

export interface UserDetails {
  id: number
  plan: UserPlan
  type: 'lifetime' | 'current' | 'temporary'
  expired: string
  language: 'en' | 'du' | 'pl'
}

export interface UserAccess {
  alerts: AlertConfig
  pro_alerts: ProAlertConfig
  backtests: BacktestConfig
}

export type MaxdataService = (keyof UserAccess) | 'api'

export interface UserConfiguration extends UserDetails {
  configuration: UserAccess
}

interface CustomerHistoryPlan {
  id: number
  slug: UserPlan['slug']
  priority: number
}

type CustomerHistory = 'current' | 'temporary'

export interface CustomerHistoryRecord {
  id: number
  plan: CustomerHistoryPlan
  customer_id: number
  type: CustomerHistory
  expired: string
  disconnect_at: string
  created_at: string
  previous: {
    id: number
    plan: CustomerHistoryPlan
    type: CustomerHistory
    expired: string
    disconnect_at: string
  } | null
}
