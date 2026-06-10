import type { User, UserFormState } from '../models/user'

export const emptyUserForm: UserFormState = {
  id: '',
  name: '',
  email: '',
  password: '',
  role: 'MEMBER',
  status: 'PENDING',
}

export function formFromUser(user: User): UserFormState {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    password: '',
    role: user.role,
    status: user.status,
  }
}

export function trimUserForm(form: UserFormState): UserFormState {
  return {
    ...form,
    id: form.id.trim(),
    name: form.name.trim(),
    email: form.email.trim().toLowerCase(),
    password: form.password.trim(),
  }
}
