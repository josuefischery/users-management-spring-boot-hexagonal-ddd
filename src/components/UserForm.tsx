import { Save } from 'lucide-react'
import type { ReactNode } from 'react'
import type { UserFormErrors } from '../utils/userValidation'
import { USER_ROLES, USER_STATUSES, type UserFormState } from '../models/user'

interface UserFormProps {
  form: UserFormState
  mode: 'create' | 'edit'
  errors: UserFormErrors
  isSubmitting: boolean
  onChange: (form: UserFormState) => void
  onSubmit: () => void
}

export function UserForm({
  form,
  mode,
  errors,
  isSubmitting,
  onChange,
  onSubmit,
}: UserFormProps) {
  const updateField = <K extends keyof UserFormState>(field: K, value: UserFormState[K]) => {
    onChange({ ...form, [field]: value })
  }

  return (
    <form
      className="user-form"
      onSubmit={(event) => {
        event.preventDefault()
        onSubmit()
      }}
    >
      <Field label="ID" error={errors.id}>
        <input
          value={form.id}
          onChange={(event) => updateField('id', event.target.value)}
          disabled={mode === 'edit'}
          placeholder="00000000-0000-0000-0000-000000000002"
        />
      </Field>

      <Field label="Nombre" error={errors.name}>
        <input
          value={form.name}
          onChange={(event) => updateField('name', event.target.value)}
          placeholder="Nombre completo"
        />
      </Field>

      <Field label="Correo electronico" error={errors.email}>
        <input
          type="email"
          value={form.email}
          onChange={(event) => updateField('email', event.target.value)}
          placeholder="usuario@example.com"
        />
      </Field>

      <Field label={mode === 'create' ? 'Contrasena' : 'Nueva contrasena'} error={errors.password}>
        <input
          type="password"
          value={form.password}
          onChange={(event) => updateField('password', event.target.value)}
          placeholder={mode === 'create' ? 'Minimo 8 caracteres' : 'Opcional'}
        />
      </Field>

      <div className="form-row">
        <Field label="Rol" error={errors.role}>
          <select value={form.role} onChange={(event) => updateField('role', event.target.value as UserFormState['role'])}>
            {USER_ROLES.map((role) => (
              <option value={role} key={role}>
                {role}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Estado" error={errors.status}>
          <select
            value={form.status}
            onChange={(event) => updateField('status', event.target.value as UserFormState['status'])}
            disabled={mode === 'create'}
          >
            {USER_STATUSES.map((status) => (
              <option value={status} key={status}>
                {status}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <button type="submit" className="primary-action submit-action" disabled={isSubmitting}>
        <Save size={18} aria-hidden="true" />
        {mode === 'create' ? 'Crear usuario' : 'Guardar cambios'}
      </button>
    </form>
  )
}

function Field({
  label,
  error,
  children,
}: {
  label: string
  error?: string
  children: ReactNode
}) {
  return (
    <label className="form-field">
      <span>{label}</span>
      {children}
      {error ? <small>{error}</small> : null}
    </label>
  )
}
