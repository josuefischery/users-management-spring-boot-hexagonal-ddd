import { useEffect, useMemo, useState } from 'react'
import {
  AlertCircle,
  CheckCircle2,
  Plus,
  RefreshCw,
  Search,
  X,
} from 'lucide-react'
import './App.css'
import { UserForm } from './components/UserForm'
import { UsersTable } from './components/UsersTable'
import { ConfirmDialog } from './components/ConfirmDialog'
import { StatusMessage } from './components/StatusMessage'
import { ApiClientError, API_BASE_URL, usersService } from './services/usersService'
import type { User, UserFormState } from './models/user'
import { emptyUserForm, formFromUser, trimUserForm } from './utils/userForm'
import { validateUserForm } from './utils/userValidation'

type FormMode = 'create' | 'edit'

type Notification = {
  type: 'success' | 'error' | 'info'
  message: string
}

const getInitialForm = (): UserFormState => ({
  ...emptyUserForm,
  id: crypto.randomUUID(),
})

function App() {
  const [users, setUsers] = useState<User[]>([])
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [formMode, setFormMode] = useState<FormMode>('create')
  const [form, setForm] = useState<UserFormState>(getInitialForm)
  const [lookupId, setLookupId] = useState('')
  const [lookupResult, setLookupResult] = useState<User | null>(null)
  const [notification, setNotification] = useState<Notification | null>(null)
  const [showValidation, setShowValidation] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [userToDelete, setUserToDelete] = useState<User | null>(null)

  const fieldErrors = useMemo(
    () => validateUserForm(form, formMode),
    [form, formMode],
  )

  const loadUsers = async () => {
    setIsLoading(true)
    try {
      const data = await usersService.getAll()
      setUsers(data)
      setNotification({
        type: 'success',
        message: `Listado actualizado: ${data.length} registro(s).`,
      })
    } catch (error) {
      setNotification({ type: 'error', message: getErrorMessage(error) })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    let isMounted = true

    usersService
      .getAll()
      .then((data) => {
        if (!isMounted) return
        setUsers(data)
        setNotification({
          type: 'success',
          message: `Listado actualizado: ${data.length} registro(s).`,
        })
      })
      .catch((error: unknown) => {
        if (!isMounted) return
        setNotification({ type: 'error', message: getErrorMessage(error) })
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false)
        }
      })

    return () => {
      isMounted = false
    }
  }, [])

  const startCreate = () => {
    setFormMode('create')
    setSelectedUser(null)
    setForm(getInitialForm())
    setShowValidation(false)
    setNotification({ type: 'info', message: 'Formulario listo para crear usuario.' })
  }

  const selectUser = async (user: User) => {
    setIsLoading(true)
    try {
      const freshUser = await usersService.getById(user.id)
      setSelectedUser(freshUser)
      setFormMode('edit')
      setForm(formFromUser(freshUser))
      setShowValidation(false)
      setLookupResult(freshUser)
      setLookupId(freshUser.id)
      setNotification({
        type: 'success',
        message: `Usuario ${freshUser.name} consultado correctamente.`,
      })
    } catch (error) {
      setNotification({ type: 'error', message: getErrorMessage(error) })
    } finally {
      setIsLoading(false)
    }
  }

  const submitForm = async () => {
    const currentErrors = validateUserForm(form, formMode)
    setShowValidation(true)
    if (Object.keys(currentErrors).length > 0) {
      setNotification({
        type: 'error',
        message: 'Revisa los campos marcados antes de enviar.',
      })
      return
    }

    const payload = trimUserForm(form)
    setIsSubmitting(true)
    try {
      const savedUser =
        formMode === 'create'
          ? await usersService.create({
              id: payload.id,
              name: payload.name,
              email: payload.email,
              password: payload.password,
              role: payload.role,
            })
          : await usersService.update(payload.id, {
              name: payload.name,
              email: payload.email,
              password: payload.password || undefined,
              role: payload.role,
              status: payload.status,
            })

      setSelectedUser(savedUser)
      setFormMode('edit')
      setForm(formFromUser(savedUser))
      setShowValidation(false)
      setNotification({
        type: 'success',
        message:
          formMode === 'create'
            ? 'Usuario creado correctamente.'
            : 'Usuario actualizado correctamente.',
      })
      await loadUsers()
    } catch (error) {
      setNotification({ type: 'error', message: getErrorMessage(error) })
    } finally {
      setIsSubmitting(false)
    }
  }

  const lookupUser = async () => {
    const id = lookupId.trim()
    if (!id) {
      setNotification({ type: 'error', message: 'Ingresa un ID para consultar.' })
      return
    }

    setIsLoading(true)
    try {
      const user = await usersService.getById(id)
      setLookupResult(user)
      setSelectedUser(user)
      setFormMode('edit')
      setForm(formFromUser(user))
      setShowValidation(false)
      setNotification({ type: 'success', message: 'Registro encontrado.' })
    } catch (error) {
      setLookupResult(null)
      setNotification({ type: 'error', message: getErrorMessage(error) })
    } finally {
      setIsLoading(false)
    }
  }

  const confirmDelete = async () => {
    if (!userToDelete) return

    setIsSubmitting(true)
    try {
      await usersService.remove(userToDelete.id)
      setNotification({ type: 'success', message: 'Usuario eliminado correctamente.' })
      if (selectedUser?.id === userToDelete.id) {
        startCreate()
      }
      setUserToDelete(null)
      await loadUsers()
    } catch (error) {
      setNotification({ type: 'error', message: getErrorMessage(error) })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Cliente RESTful React</p>
          <h1>Gestion de usuarios</h1>
        </div>
        <div className="api-pill">
          <span>API</span>
          <strong>{API_BASE_URL}</strong>
        </div>
      </header>

      <StatusMessage notification={notification} onClose={() => setNotification(null)} />

      <section className="toolbar" aria-label="Acciones principales">
        <button type="button" className="primary-action" onClick={startCreate}>
          <Plus size={18} aria-hidden="true" />
          Nuevo
        </button>
        <button type="button" className="secondary-action" onClick={loadUsers} disabled={isLoading}>
          <RefreshCw size={18} aria-hidden="true" />
          Actualizar
        </button>
        <div className="lookup-control">
          <label htmlFor="lookup-id">Consultar por ID</label>
          <div>
            <input
              id="lookup-id"
              value={lookupId}
              onChange={(event) => setLookupId(event.target.value)}
              placeholder="ID del usuario"
            />
            <button type="button" onClick={lookupUser} disabled={isLoading}>
              <Search size={18} aria-hidden="true" />
              Buscar
            </button>
          </div>
        </div>
      </section>

      <section className="workspace">
        <UsersTable
          users={users}
          isLoading={isLoading}
          selectedUserId={selectedUser?.id}
          onEdit={selectUser}
          onDelete={setUserToDelete}
        />

        <aside className="editor-panel" aria-label="Formulario de usuario">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">{formMode === 'create' ? 'POST /api/users' : 'PUT /api/users/{id}'}</p>
              <h2>{formMode === 'create' ? 'Crear usuario' : 'Editar usuario'}</h2>
            </div>
            {formMode === 'edit' ? (
              <button type="button" className="icon-action" onClick={startCreate} aria-label="Cerrar edicion">
                <X size={18} aria-hidden="true" />
              </button>
            ) : null}
          </div>

          <UserForm
            form={form}
            mode={formMode}
            errors={showValidation ? fieldErrors : {}}
            onChange={setForm}
            onSubmit={submitForm}
            isSubmitting={isSubmitting}
          />
        </aside>
      </section>

      <section className="details-band" aria-label="Resultado de consulta individual">
        <div className="details-heading">
          <Search size={18} aria-hidden="true" />
          <h2>Consulta individual</h2>
        </div>
        {lookupResult ? (
          <dl className="detail-grid">
            <div>
              <dt>ID</dt>
              <dd>{lookupResult.id}</dd>
            </div>
            <div>
              <dt>Nombre</dt>
              <dd>{lookupResult.name}</dd>
            </div>
            <div>
              <dt>Correo</dt>
              <dd>{lookupResult.email}</dd>
            </div>
            <div>
              <dt>Rol</dt>
              <dd>{lookupResult.role}</dd>
            </div>
            <div>
              <dt>Estado</dt>
              <dd>{lookupResult.status}</dd>
            </div>
          </dl>
        ) : (
          <p className="muted-line">Sin registro consultado.</p>
        )}
      </section>

      <section className="endpoint-band" aria-label="Endpoints consumidos">
        <div className="details-heading">
          <CheckCircle2 size={18} aria-hidden="true" />
          <h2>Endpoints consumidos</h2>
        </div>
        <div className="endpoint-grid">
          <EndpointBadge method="GET" path="/api/users" label="Listar registros" />
          <EndpointBadge method="GET" path="/api/users/{id}" label="Consultar registro" />
          <EndpointBadge method="POST" path="/api/users" label="Crear registro" />
          <EndpointBadge method="PUT" path="/api/users/{id}" label="Actualizar registro" />
          <EndpointBadge method="DELETE" path="/api/users/{id}" label="Eliminar registro" />
        </div>
      </section>

      <ConfirmDialog
        open={Boolean(userToDelete)}
        title="Eliminar usuario"
        message={
          userToDelete
            ? `Se eliminara el registro de ${userToDelete.name}. Esta accion no se puede deshacer.`
            : ''
        }
        confirmLabel="Eliminar"
        cancelLabel="Cancelar"
        icon={<AlertCircle size={20} aria-hidden="true" />}
        onCancel={() => setUserToDelete(null)}
        onConfirm={confirmDelete}
        isBusy={isSubmitting}
      />
    </main>
  )
}

function EndpointBadge({
  method,
  path,
  label,
}: {
  method: string
  path: string
  label: string
}) {
  return (
    <div className="endpoint-item">
      <span>{method}</span>
      <code>{path}</code>
      <p>{label}</p>
    </div>
  )
}

function getErrorMessage(error: unknown) {
  if (error instanceof ApiClientError) {
    return `${error.status}: ${error.message}`
  }

  if (error instanceof Error) {
    return error.message
  }

  return 'No fue posible completar la operacion.'
}

export default App
