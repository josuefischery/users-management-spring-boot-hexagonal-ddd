# Users Management Frontend React

Cliente RESTful desarrollado en React + TypeScript para consumir el backend base:

<https://github.com/arrietajohn/users-management-spring-boot-hexagonal-ddd>

## Framework seleccionado

Se selecciono React con TypeScript porque permite construir una interfaz modular, validar formularios en el cliente, separar componentes y servicios, y consumir endpoints RESTful de forma directa mediante `fetch`.

## Endpoints consumidos

| Operacion | Metodo | Endpoint |
| --- | --- | --- |
| Listar usuarios | GET | `/api/users` |
| Consultar usuario | GET | `/api/users/{id}` |
| Crear usuario | POST | `/api/users` |
| Actualizar usuario | PUT | `/api/users/{id}` |
| Eliminar usuario | DELETE | `/api/users/{id}` |

## Requisitos previos

- Node.js 20 o superior.
- Backend Spring Boot ejecutandose en `http://localhost:8080`.
- MySQL con la base de datos `crud_usuarios` creada usando `src/main/resources/schema.sql` del backend.

> Nota: el backend intenta enviar correos al crear o actualizar usuarios. Para una demostracion completa se debe configurar SMTP en `application.properties` o ajustar temporalmente esa integracion en el backend.

## Instalacion

```bash
npm install
```

## Ejecucion

```bash
npm run dev
```

La aplicacion quedara disponible normalmente en:

```text
http://localhost:5173
```

## Configuracion del endpoint base

Por defecto el frontend llama a `/api` y Vite redirige esas peticiones hacia `http://localhost:8080` mediante proxy. Esto evita problemas de CORS durante la demostracion local.

Para usar otra URL, crea un archivo `.env` basado en `.env.example`:

```bash
cp .env.example .env
```

Ejemplo:

```env
VITE_API_BASE_URL=http://localhost:8080/api
```

## Scripts disponibles

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

## Estructura del proyecto

```text
src/
  components/        Componentes de interfaz
  models/            Tipos e interfaces de datos
  services/          Servicio HTTP para consumir el API
  utils/             Validaciones y transformaciones del formulario
  App.tsx            Orquestacion de vistas y operaciones CRUD
```

## Evidencias sugeridas para el informe

- Captura del listado de usuarios.
- Captura de la consulta por ID.
- Captura del formulario de creacion.
- Captura del formulario de edicion.
- Captura del dialogo de confirmacion de eliminacion.
- Capturas del servicio `usersService.ts`, modelo `user.ts` y validaciones `userValidation.ts`.
