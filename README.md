# ✨ El Rinconcito de Sharpay – Plataforma MERN para comercio electrónico personalizado

Bienvenido al repositorio oficial de **El Rinconcito de Sharpay**, una solución tecnológica desarrollada por estudiantes apasionados por el desarrollo web con el objetivo de digitalizar y automatizar las ventas de un emprendimiento salvadoreño.

---

## 🧑‍💻 Equipo de desarrollo

- **Nombre del Proyecto:** El Rinconcito de Sharpay
- **Integrantes del equipo:**
  - Gabriela Michelle Pérez Portillo – Frontend Developer  
  - Daniel Rolando Soriano Solis – Backend Developer  
  - German Antonio González Mejía - Full Stack Developer  
  - Alessandro Antonio Muñoz Quijada – Diseñador UX/UI  
  - Alessandro Imanol Ramírez Morán – Líder de Proyecto  
- **Institución:** Instituto Técnico Ricaldone  
- **Especialidad:** Desarrollo de Software  

---

## 🎯 Objetivo del proyecto

Brindar una solución integral que permita al emprendimiento gestionar su catálogo de productos, recibir pedidos personalizados y facilitar la atención al cliente a través de una página web moderna, responsiva y funcional.

---

## 🚩 Problemática detectada

Actualmente, el negocio enfrenta una sobrecarga operativa, ya que solo una persona atiende los pedidos que llegan por distintas redes sociales. Esto provoca que se pierdan ventas debido a mensajes no respondidos o chats desordenados. Además, **no existe un historial digitalizado de ventas ni pedidos personalizados.**

---

## ✅ Solución propuesta

Hemos desarrollado una **plataforma web con frontend y backend propio**, que permite a los clientes:

- Navegar el catálogo completo.  
- Personalizar productos sublimables en tiempo real.  
- Agregarlos al carrito.  
- Pagar con una pasarela de pago segura.  

Por otro lado, el equipo administrativo podrá:  

- Gestionar productos, pedidos y usuarios.  
- Publicar anuncios de eventos de caridad.  
- Ver estadísticas de ventas.  

---

## ⚙️ Tecnologías utilizadas

### **Frontend**
- **React.js** – Librería para construir interfaces de usuario.  
- **React Router DOM** – Navegación entre páginas.  
- **Fabric.js** – Personalizador visual para productos.  
- **Axios** – Consumo de API REST.  
- **Bootstrap / Tailwind CSS** – Estilos y diseño responsive.  

### **Backend**
- **Node.js + Express.js** – Servidor y API RESTful.  
- **MongoDB Atlas** – Base de datos NoSQL en la nube.  
- **Mongoose** – ODM para interactuar con MongoDB.  
- **JWT & Bcrypt** – Autenticación y seguridad.  
- **Cors & Morgan** – Middleware de seguridad y logging.  
- **Dotenv** – Manejo de variables de entorno.  
- **Wompi** – Pasarela de pago para ventas en línea.  

---
🚀 Ejecución del proyecto
1. Clonar el repositorio
git clone https://github.com/Gabss16/el-rinconcito-de-sharpay.git
cd el-rinconcito-de-sharpay

2. Configurar el Backend

Entrar a la carpeta del backend:

cd backend


Instalar dependencias:

npm install


Crear un archivo .env con las siguientes variables:

PORT=4000
MONGO_URI=tu_url_de_mongodb
JWT_SECRET=tu_secreto
WOMPI_API_KEY=tu_api_key


Ejecutar el servidor:

npm run dev

3. Configurar el Frontend

Entrar a la carpeta del frontend:

cd frontend


Instalar dependencias:

npm install


Ejecutar la aplicación:

npm run dev

4. Acceder al sistema

Frontend: http://localhost:5173

Backend API: http://localhost:4000/api
---

📝 Nomenclatura utilizada

Para mantener la consistencia y evitar errores durante el desarrollo del proyecto, especialmente al integrar frontend y backend, se definieron las siguientes convenciones de nombres:

Backend (Node.js + Express.js)

lowerCamelCase en la definición de variables, funciones, controladores y modelos.

Frontend (React.js)

lowerCamelCase → variables, hooks y funciones.

UpperCamelCase (PascalCase) → nombres de componentes, páginas y archivos CSS.

Esto asegura legibilidad, mantenibilidad y compatibilidad con JSX.
---

📊 Datos de importancia

Base de datos: MongoDB Atlas – Cloud Database.

Gestión de dependencias: npm.

Control de versiones: Git + GitHub.

Entorno de pruebas: Postman para probar la API.
---

## 📦 Dependencias instaladas



```bash
### **Frontend**
npm install react react-dom
npm install react-router-dom
npm install axios
npm install fabric
npm install bootstrap
npm install tailwindcss


### 📦 **Backend**

```bash
npm install express
npm install mongoose
npm install bcrypt
npm install jsonwebtoken
npm install cors
npm install morgan
npm install dotenv
npm install nodemon --save-dev



