export type AccountType = 'ldap' | 'local'

export interface LabelItem {
  text: string
}

export interface Account {
  id: string | number
  label: LabelItem[]
  type: AccountType
  login: string
  password: string | null
}

export interface AccountUI {
  id: string | number
  label: string
  type: AccountType
  login: string
  password: string | null
}

export interface ValidationErrors {
  label?: string
  login?: string
  password?: string
}
