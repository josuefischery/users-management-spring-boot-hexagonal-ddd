import type { UserFormState } from '../models/user'

export type UserFormErrors = Partial<Record<keyof UserFormState, string>>

const EMAIL_PATTERN = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

export function validateUserForm(form: UserFormState, mode: 'create' | 'edit') {
  const errors: UserFormErrors = {}
  const id = form.id.trim()
  const name = form.name.trim()
  const email = form.email.trim()
  const password = form.password.trim()

  if (!id) {
    errors.id = 'El ID es obligatorio.'
  }

  if (!name) {
    errors.name = 'El nombre es obligatorio.'
  } else if (name.length < 3) {
    errors.name = 'El nombre debe tener al menos 3 caracteres.'
  }

  if (!email) {
    errors.email = 'El correo es obligatorio.'
  } else if (!EMAIL_PATTERN.test(email)) {
    errors.email = 'Ingresa un correo valido.'
  }

  if (mode === 'create' && !password) {
    errors.password = 'La contrasena es obligatoria.'
  } else if (password && password.length < 8) {
    errors.password = 'La contrasena debe tener al menos 8 caracteres.'
  }

  if (!form.role) {
    errors.role = 'Selecciona un rol.'
  }

  if (mode === 'edit' && !form.status) {
    errors.status = 'Selecciona un estado.'
  }

  return errors
}
