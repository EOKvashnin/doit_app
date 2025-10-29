const ERROR_CODES = {
  INVALID_LOGIN_CREDENTIALS: 'Неверный email или пароль',
  EMAIL_NOT_FOUND: 'Неверный email или пароль',
  INVALID_PASSWORD: 'Неверный email или пароль',
  TOO_MANY_ATTEMPTS_TRY_LATER: 'Слишком много попыток. Попробуйте позже',
  USER_DISABLED: 'Аккаунт заблокирован',
  auth: 'Пожалуйста войдите в систему',
}

export default function error(code) {
  return ERROR_CODES[code] || 'Неизвестная ошибка'
}
