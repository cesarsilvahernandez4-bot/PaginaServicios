# Plataforma de Servicios de Ambulancias

Esta es una plataforma web completa orientada a clientes para consultar los servicios médicos de ambulancias y una herramienta interna (Panel de Administración) para administrar el contenido y operaciones de la empresa.

## Características Principales

El proyecto cumple con los 10 requisitos funcionales (RF) especificados en el alcance original:

1. **Catálogo de Servicios**: Visualización pública de servicios clasificados por categorías (TAB, TAM, Eventos y Domiciliario), con filtrado y vista de detalle (RF02, RF07).
2. **Formulario de Contacto**: Integrado al backend y almacenado en la base de datos para la fácil consulta por el personal administrativo (RF03).
3. **Roles y Permisos**: Control de accesos estricto mediante roles de `Administrador` y `Operador` para asegurar la información (RF08).
4. **Autenticación Nativa Segura**: Inicio de sesión (RF05) y autorización desarrollados utilizando encriptación con la librería nativa de Node.js `crypto` (`scrypt` y `HMAC`) sin necesidad de librerías externas de JWT, brindando máxima seguridad.
5. **Panel de Administración Completo**:
   - **Gestión de Servicios (CRUD)**: Creación, actualización y eliminación lógica de servicios (RF06).
   - **Gestión de Usuarios (CRUD)**: Creación y administración de los usuarios del sistema por parte del `Administrador` (RF04).
   - **Bandeja de Mensajes**: Visualización y marcado de mensajes de los clientes, permitiendo llevar un control de "Nuevos" o "Atendidos".
6. **API RESTful Completa**: Todos los endpoints siguen principios RESTful (RF09).
7. **Base de Datos Idempotente**: Integración completa con PostgreSQL e inicialización automática de esquema (RF10).

## Arquitectura

El sistema ha sido estructurado bajo el patrón de diseño **MVC** (Modelo - Vista - Controlador) para garantizar un código mantenible, limpio y escalable:

- **Frontend**: Vanilla HTML5, CSS3 y JavaScript. Interfaces responsivas y dinámicas diseñadas para una experiencia de usuario (UX) excelente.
- **Backend**: Node.js con Express.js.
- **Base de Datos**: PostgreSQL alojada en [Supabase](https://supabase.com).
- **Controlador de DB**: Paquete `pg` (node-postgres).

## Estructura del Proyecto

```text
PaginaServicios/
├── config/              # Configuración de base de datos y scripts de inicialización (initDb.js)
├── controllers/         # Controladores (auth, usuarios, servicios, mensajes)
├── middleware/          # Middlewares (verificación de token y control de roles)
├── models/              # Modelos de bases de datos
├── public/              # Archivos estáticos (CSS, JS cliente, imágenes)
├── routes/              # Definición de las rutas REST (API)
├── utils/               # Utilidades de seguridad (Hashing, validación de tokens)
├── views/               # Vistas HTML (públicas y de administración)
├── supabase_schema.sql  # Respaldo SQL del esquema de base de datos
├── index.js             # Punto de entrada principal
└── package.json         # Dependencias
```

## Requisitos Previos

- **Node.js** v14 o superior.
- Una base de datos PostgreSQL (se recomienda una instancia en Supabase).

## Instalación y Configuración Local

1. **Clona el repositorio**
   ```bash
   git clone <URL_DEL_REPOSITORIO>
   cd PaginaServicios
   ```

2. **Instala las dependencias**
   ```bash
   npm install
   ```

3. **Configura las variables de entorno**
   Crea un archivo llamado `.env` en la raíz del proyecto y agrega las siguientes variables:
   ```env
   # Cadena de conexión directa a PostgreSQL
   DB_CONNECTION_STRING="postgresql://usuario:password@host:5432/postgres"
   
   # Puerto para correr la aplicación (por defecto es 3050 si no se establece)
   PORT=3050
   ```

4. **Inicia el servidor**
   ```bash
   npm run dev
   ```

## Configuración Inicial de Base de Datos y Credenciales

El servidor cuenta con un sistema **Idempotente** (`config/initDb.js`). Esto significa que al ejecutar `npm run dev` (o iniciar el servidor en producción por primera vez), automáticamente detectará si existen las tablas en la base de datos PostgreSQL. De no existir:

1. Creará el esquema completo de las tablas (`usuarios`, `servicios`, `mensajes_contacto`).
2. Insertará automáticamente un **Usuario Administrador por Defecto**.
3. Insertará los servicios base (Ambulancias Básicas, Medicalizadas, Eventos, Domiciliarios).


*(Nota: Por razones de seguridad, te recomendamos cambiar la contraseña y crear tus propios usuarios una vez ingreses al Panel de Administración).*

## Despliegue en Render

El proyecto está preparado para desplegarse fácilmente en **Render**:
1. Conecta tu repositorio de GitHub a Render en la creación de un nuevo **Web Service**.
2. **Build Command**: `npm install`
3. **Start Command**: `node index.js`
4. En las configuraciones de Render (Environment Variables), asegúrate de agregar la variable `DB_CONNECTION_STRING` apuntando a tu instancia de Supabase.
5. ¡Renderizará y migrará la base de datos automáticamente al arrancar la instancia!
6. https://paginaservicios.onrender.com/index.html
