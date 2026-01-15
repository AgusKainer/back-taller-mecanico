# 🔧 Rutas API - Taller Mecánico

## 🔐 Autenticación (Admin)

### Registrar nuevo Mecánico

```
POST /api/auth/register
Content-Type: application/json

{
  "correo": "mecanico@taller.com",
  "contraseña": "tu_contraseña"
}

Response: 201
{
  "mensaje": "Admin registrado exitosamente",
  "admin": {
    "id": 1,
    "correo": "mecanico@taller.com"
  }
}
```

### Login Mecánico

```
POST /api/auth/login
Content-Type: application/json

{
  "correo": "mecanico@taller.com",
  "contraseña": "tu_contraseña"
}

Response: 200
{
  "mensaje": "Login exitoso",
  "token": "eyJhbGc...",
  "admin": {
    "id": 1,
    "correo": "mecanico@taller.com"
  }
}
```

---

## 🚗 Autos

### Obtener todos los autos

```
GET /api/autos
Response: 200
[
  {
    "id": 1,
    "patente": "ABC-123",
    "dueño": "Juan Pérez",
    "marca": "Toyota",
    "modelo": "Corolla",
    "año": 2020,
    "kmActuales": 15000,
    "proximoMantenimiento": 20000,
    "descripcionUltimaReparacion": "Cambio de aceite",
    "fechaUltimaReparacion": "2024-01-15T10:30:00Z",
    "estado": "activo"
  }
]
```

### Obtener auto por PATENTE (cliente busca su historial)

```
GET /api/autos/patente/ABC-123
Response: 200
{
  "id": 1,
  "patente": "ABC-123",
  "dueño": "Juan Pérez",
  "marca": "Toyota",
  "modelo": "Corolla",
  "año": 2020,
  "kmActuales": 15000,
  "proximoMantenimiento": 20000,
  "descripcionUltimaReparacion": "Cambio de aceite",
  "fechaUltimaReparacion": "2024-01-15T10:30:00Z",
  "estado": "activo"
}
```

### Obtener auto por ID

```
GET /api/autos/id/1
Response: 200
{ ... auto data ... }
```

### Obtener autos de un dueño

```
GET /api/autos/dueño/Juan Pérez
Response: 200
[ ... array de autos ... ]
```

### Obtener autos que necesitan mantenimiento

```
GET /api/autos/mantenimiento/necesario/todos
Response: 200
[ ... autos donde kmActuales >= proximoMantenimiento ... ]
```

### Registrar nuevo auto

```
POST /api/autos
Content-Type: application/json

{
  "patente": "ABC-123",
  "dueño": "Juan Pérez",
  "marca": "Toyota",
  "modelo": "Corolla",
  "año": 2020,
  "kmActuales": 10000,
  "proximoMantenimiento": 15000
}

Response: 201
{
  "mensaje": "Auto registrado exitosamente",
  "auto": { ... }
}
```

### Actualizar datos del auto

```
PUT /api/autos/1
Content-Type: application/json

{
  "dueño": "Nuevo Dueño",
  "marca": "Honda",
  "estado": "reparacion"
}

Response: 200
{
  "mensaje": "Auto actualizado exitosamente",
  "auto": { ... }
}
```

### Actualizar KM y Mantenimiento (después de reparación)

```
PUT /api/autos/1/mantenimiento
Content-Type: application/json

{
  "kmActuales": 18000,
  "reparacion": "Cambio de pastillas de freno"
}

Response: 200
{
  "mensaje": "Kilómetros y mantenimiento actualizados",
  "auto": {
    "id": 1,
    "kmActuales": 18000,
    "proximoMantenimiento": 23000,
    "descripcionUltimaReparacion": "Cambio de pastillas de freno",
    "fechaUltimaReparacion": "2026-01-09T..."
  }
}
```

### Eliminar auto

```
DELETE /api/autos/1
Response: 200
{
  "mensaje": "Auto con ID 1 eliminado correctamente"
}
```

---

## 📝 Campos del Auto

| Campo                       | Tipo    | Descripción                        |
| --------------------------- | ------- | ---------------------------------- |
| id                          | INTEGER | ID único (auto)                    |
| patente                     | STRING  | Patente del vehículo (única)       |
| dueño                       | STRING  | Nombre del propietario             |
| marca                       | STRING  | Marca del auto                     |
| modelo                      | STRING  | Modelo del auto                    |
| año                         | INTEGER | Año de fabricación                 |
| kmActuales                  | INTEGER | Kilómetros actuales                |
| proximoMantenimiento        | INTEGER | KM para próximo mantenimiento      |
| descripcionUltimaReparacion | TEXT    | Qué se reparó                      |
| fechaUltimaReparacion       | DATE    | Cuándo se hizo la reparación       |
| estado                      | ENUM    | 'activo', 'inactivo', 'reparacion' |

---

## 🔑 Nota sobre Autenticación

El token JWT se obtiene al hacer login y se usa en el header:

```
Authorization: Bearer {token}
```

Por ahora las rutas de autos están sin protección, pero puedes agregar el middleware `verificarToken` a las rutas que necesites proteger.
