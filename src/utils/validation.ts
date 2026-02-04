import type { AccountType, ValidationErrors } from '@/types/account'

export function validateLabel(label: string): string | null {
  if (label.length > 50) {
    return 'Максимальная длина метки - 50 символов'
  }
  return null
}

export function validateLogin(login: string): string | null {
  if (!login || login.trim() === '') {
    return 'Логин обязателен для заполнения'
  }
  if (login.length > 100) {
    return 'Максимальная длина логина - 100 символов'
  }
  return null
}

export function validatePassword(password: string | null, type: AccountType): string | null {
  if (type === 'local') {
    if (!password || password.trim() === '') {
      return 'Пароль обязателен для локальной учетной записи'
    }
    if (password.length > 100) {
      return 'Максимальная длина пароля - 100 символов'
    }
  }
  return null
}

export function validateAccount(
  label: string,
  login: string,
  password: string | null,
  type: AccountType
): ValidationErrors {
  const errors: ValidationErrors = {}

  const labelError = validateLabel(label)
  if (labelError) {
    errors.label = labelError
  }

  const loginError = validateLogin(login)
  if (loginError) {
    errors.login = loginError
  }

  const passwordError = validatePassword(password, type)
  if (passwordError) {
    errors.password = passwordError
  }

  return errors
}

export function isAccountValid(errors: ValidationErrors): boolean {
  return Object.keys(errors).length === 0
}
