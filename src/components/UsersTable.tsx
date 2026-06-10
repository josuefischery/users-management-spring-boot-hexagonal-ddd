import { Edit3, Trash2 } from 'lucide-react'
import type { User } from '../models/user'

interface UsersTableProps {
  users: User[]
  selectedUserId?: string
  isLoading: boolean
  onEdit: (user: User) => void
  onDelete: (user: User) => void
}

export function UsersTable({
  users,
  selectedUserId,
  isLoading,
  onEdit,
  onDelete,
}: UsersTableProps) {
  return (
    <section className="table-panel" aria-label="Listado de usuarios">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">GET /api/users</p>
          <h2>Registros</h2>
        </div>
        <span className="record-counter">{users.length}</span>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Correo</th>
              <th>Rol</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className={selectedUserId === user.id ? 'selected-row' : undefined}>
                <td>
                  <strong>{user.name}</strong>
                  <span>{user.id}</span>
                </td>
                <td>{user.email}</td>
                <td>
                  <span className="tag">{user.role}</span>
                </td>
                <td>
                  <span className={`status-dot ${user.status.toLowerCase()}`}>{user.status}</span>
                </td>
                <td>
                  <div className="row-actions">
                    <button type="button" className="icon-action" onClick={() => onEdit(user)} aria-label={`Editar ${user.name}`}>
                      <Edit3 size={16} aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      className="icon-action danger"
                      onClick={() => onDelete(user)}
                      aria-label={`Eliminar ${user.name}`}
                    >
                      <Trash2 size={16} aria-hidden="true" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {!isLoading && users.length === 0 ? (
          <div className="empty-state">No hay registros para mostrar.</div>
        ) : null}

        {isLoading ? <div className="loading-state">Cargando datos...</div> : null}
      </div>
    </section>
  )
}
