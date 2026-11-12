# Reglas de arquitectura y estilo para la API REST de Contactos

## 1. Descripción del proyecto

Este proyecto es una API RESTful sencilla construida con Node.js, Express y Mongoose para gestionar una base de datos de contactos.

## 2. Estructura de carpetas obligatoria

Todo el código fuente debe estar estructurado estrictamente de la siguiente manera:

- `models/` (Esquemas y modelos de Mongoose)
- `routes/` (Enrutadores de Express)
- `index.js` (Punto de entrada de la aplicación)

## 3. Modelo de datos: contacto

El modelo de datos para la colección de contactos debe definirse en `models/contacto.js` y contener los siguientes campos:

- **nombre**: Cadena de texto (`String`), obligatorio (`required`), sin espacios en los extremos (`trim`).
- **edad**: Número (`Number`), obligatorio (`required`), valor mínimo `0`.
- **telefono**: Cadena de texto (`String`), obligatorio (`required`), sin espacios en los extremos (`trim`).

Se debe definir el esquema asociado y el modelo `contactos` para la base de datos.

## 4. Estilo de código y convenciones

- **Módulos**: Utilizar la sintaxis moderna de **ES Modules** (`import` / `export`), no `require()`.
- **Control de Errores**: Usar bloques `try / catch` y `async/await` en las funciones controladoras. Responder con códigos de estado HTTP adecuados (200, 201, 400, 404, 500) y mensajes en JSON con la estructura `{ message: "..." }`.
- **Rutas**: Definir los enrutadores en `routes/contactos.js`, con los endpoints indicados a continuación. Cada enrutador englobará la lógica de acceso a la base de datos y recuperación/generación de la información correspondiente.

## 5. Endpoints requeridos

- `GET /contactos` - Obtener todos los contactos.
- `GET /contactos/:id` - Obtener un contacto por su ID.
- `POST /contactos` - Crear un nuevo contacto.
- `PUT /contactos/:id` - Actualizar un contacto existente por ID.
- `DELETE /contactos/:id` - Eliminar un contacto por ID.