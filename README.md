# RollingVet Backend

Este proyecto es el backend del sistema RollingVet, una aplicación para gestionar la carga y administración de pacientes y la reserva de turnos de una veterinaria.

## Tabla de Contenidos

- [Instalación](#instalación)
- [Uso](#uso)
- [Endpoints](#endpoints)
- [Middleware](#middleware)
- [Controllers](#controllers)
- [Models](#models)
- [Tecnologías](#tecnologías)
- [Integrantes](#integrantes)

## Instalación

1. Clona este repositorio:
   ```bash
   git clone https://github.com/Jose-Martin-Fe/ProyectoVeterinariaBackEnd.git
   ```
2. Navega al directorio del proyecto:
   cd ProyectoVeterinariaBackEnd
3. Instala las dependencias:
   ```bash
   npm install
   ```
4. Crea un archivo `.env` en la raíz del proyecto y configura las siguientes variables de entorno:
   ```env
   MONGO_CONNECT =
   SECRET_KEY_JWT =
   GMAIL_MAIL=
   GMAIL_PASS_APP=
   CLOUD_NAME=
   CLOUD_API_KEY=
   CLOUD_API_SECRET=
   ```

## Uso

1. Inicia el servidor:
   ```bash
   npm run dev
   ```
2. El servidor estará corriendo en `http://localhost:3001`.

## Endpoints

- Carpeta routes

### usuarios.routes

- `POST /api/login`: Iniciar sesión. (Requiere usuario y contraseña)
- `POST /api/register`: Registrar un nuevo usuario. (Requiere Mail - Usuario - contraseña) Requisitos (Usuario no debe ser menor a 5 caracteres ni mayor a 30 y contraseña minimo 8 caracteres)
- `GET /api/users`: Obtener todos los usuarios. -rol admin
- `PUT /api/users/:idUser`: Actualizar/Modificar un usuario. - rol admin (Requiere mail - Usuario - Rol)
- `DELETE /api/users/users/:idUser`: Eliminar un usuario. - rol admin

### turnos.routes

- `GET /api/turnos/AdminTurnos`: Obtener todos los turnos - rol admin.
- `GET /api/turnos`: Obtener turnos - rol user
- `POST /api/turnos`: Crear un nuevo turno usuario - rol user.
- `POST /api/turnos/disponibles`: obtiene todos los turnos disponibles para guardar turnos - rol user
- `DELETE /api/turnos/:id`: Eliminar un turno. - rol user
- `DELETE /api/turnos/AdminTurnos/:id`: Eliminar un turno - rol admin.

### profesionales.routes

- `GET /api/profesionales` : obtiene los datos de profesionales
- `POST /api/profesionales`: Crear profesional - rol admin
- `POST /api/profesionales/addImage/:idProf` : Adjunta la imagen del profesional seleccionado - rol admin
- `PUT /api/profesionales/:id`: actualiza/modifica el profesional segun el id - rol admin (Requiere nombre, especialidad, imagen, descripcion , dia , horario)
- `DELETE /api/profesionales/:id` : Borra el profesional seleccionado segun el id - rol admin

### products.routes

- `GET /api/productos/search` : filtra los productos de la base de datos
- `GET /api/productos` : obtiene todos los productos almacenados en la base de datos
- `GET /api/productos/admin` : obtiene todos los productos almacenados en la base datos - vista admin
- `GET /api/productos/:id` : filtra el producto por ID para mostrar el detalle de producto
- `POST /api/productos` : Crea productos a la base de datos - Rol admin (Requiere Titulo , precio, categoria , descripcion , imagen)
- `POST /api/productos/addImage/:idProd` : Permite agregar imagen o modificar imagen del producto - rol admin (Requiere extension jpg, jpeg, png, gift, webp)
- `PUT /api/productos/:id` : Permite realizar las modificaciones del producto existente
- `DELETE /api/productos/:id` : Permite borrado fisico del producto - rol admin

### misDatos.routes

- `GET /api/misDatos/:id` : obtiene los datos guardados del usuario logueado - rol user
- `GET /api/misDatos` : Obtiene todos los datos del usuario - rol admin
- `POST /api/misDatos/mascota` : Crea/Agrega/modifica datos de mascota al usuario creado - rol user
- `DELETE /api/misDatos/mascota/:id` : Borrado fisico de mascota asosiada al usuario logueado/existente - rol user

### favorito.routes

- `GET /api/favoritos` : obtiene los productos almacenados en el usuario existente - rol user
- `POST /api/favoritos/:id` : Permite guardar el id del producto seleccionado al usuario para luego poder visualizarlo en favoritos - rol user
- `DELETE api/favoritos/:id` : Realiza borrado fisico del producto almacenado en el usuario existente - rol user

### contact.routes

- `POST /api/contact/send` : Permite realizar el envio de correo de contacto al mail configurado de nodemailer (Requiere Nombre, Apellido, Correo electronico , mensaje)

### contactplans.routes

`POST /api/planes/send` : Permite realizar el envio de correo para consultar en detalle los planes disponibles (Requiere Nombre, Correo Electronico, Asunto (Plan Primeros pasos , Plan Madurando, Plan Adultos) , mensaje )

### comentario.routes

- `GET /api/comentarios` : Obtiene todos los comentarios existentes y aprobados en la pagina para la vista de todos los usuarios
- `GET /api/comentarios/pendientes` : Obtiene todos los comentarios realizados por los usuarios para ser leidos por el admin y poder aprobar/rechazar el posteo - ROL ADMIN
- `PATCH /api/comentarios/:id/publicar` : Realiza la publicacion del comentario en la pagina - rol admin
- `PATCH /api/comentarios/:id/aprobar` : Permite realizar la aprobacion del comentario cambiando el valor a true - rol admin
- `PATCH /api/comentarios/:id/rechazar` : Permite realizar rechazo del comentario donde el mismo queda borrado al no aprobarlo - rol admin

### carrito.routes

- `GET /api/carritos` : Obtiene todos los productos guardados en el usuario logueado/existente - rol user
- `POST /api/carritos/:id` : Permite guardar el producto seleccionado en el usuario logueado/existente en el carrito - rol user
- `PUT /api/carritos/:id` : Permite modificar la cantidad deseada del producto guardado en el carrito por el usuario - rol user
- `DELETE /api/carritos/:id` : Permite borrar el producto existente en el carrito del usuario de forma fisica - rol user

## Middleware

- auth : Se realiza la configuracion de token y accesos segun el rol
- cloudinary : se realiza configuracion de conexion cloudinary para el almacenamiento de imagenes
- jobs : Se utiliza para configurar el tiempo deseado para el borrado de turnos/reservas ya vencidos en todos los usuarios existentes
- messages : configuracion de mensajes predeterminados para notificaciones al usuario
- multer : Configuracion para adjutar imagenes
- nodemailer : Configuracion para el funcionamiento de Recepcion y Envio de mails al usuario y admin

## Controllers

- usuarios.controlador : Aqui encontraras todas las funciones referido al usuario
- turnos.controlador : Aqui encontraras todas las funciones de almacenamiento/creacion de turnos
- profesional.controlador : Aqui encontraras las funciones sobre los profesinales, horarios y dias de trabajo
- misDatos.controlador : Aqui encontraras las funciones sobre los datos personales de cada usuario existente y sus mascotas
- favorito.controlador : Aqui encontraras las funciones sobre los productos seleccionados como favoritos en los usuarios
- comentario.controlador : Aqui encontraras las funciones sobre los comentarios que realizan los usuarios a la pagina
- carrito.controlador : Aqui encontraras las funciones sobre el carrito, compra, modificacion de cantidad, precio.

## models

- Aqui encontraras todos los modelos utilizados para almacenar en el MONGODB la mismas estan relacionadas entre si como por ejemplo:
- userSchema (carritoSchema, favoritosSchema,turnosSchema, miDatoSchema )

1. userSchema
2. turnosSchema
3. profesionalSchema
4. productsSchema
5. miMascotaSchema
6. favoritosSchema
7. comentarioSchema
8. carritoSchema
9. miDatoSchema

## Tecnologías

- Node.js
- Express
- MongoDB
- Mongoose
- jsonwebtoken
- bcryptjs
- dotenv
- cors
- cron
- cloudinary
- moment-timezone
- morgan
- nodemailer
- axios
- multer
- express-validator
- mercadopago

## Integrantes

1. Moreno Lisandro
2. Paz Rodrigo
3. Fe Jose Martin
