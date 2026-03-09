# 🛡️ DriverSentinel | IoT Safety Protocol

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![C++](https://img.shields.io/badge/c++-%2300599C.svg?style=for-the-badge&logo=c%2B%2B&logoColor=white)

**DriverSentinel** es un sistema inteligente de monitoreo biométrico y seguridad vial diseñado para prevenir accidentes de tránsito. Integra telemetría de hardware en el borde (Edge Computing) con una plataforma web progresiva (PWA) para el análisis de datos en tiempo real.

Proyecto desarrollado para la carrera de **ITIC-901M**.

---

## ✨ Características Principales

* **Monitoreo en el Borde (Hardware):** Utiliza un microcontrolador **ESP32** integrado con un sensor **MAX30102** (BPM y SpO2) y un giroscopio **MPU6050** para detectar somnolencia, cabeceos y anomalías en el ritmo cardíaco.
* **Progressive Web App (PWA):** Interfaz instalable en dispositivos móviles (iOS y Android) para acceso rápido y sin distracciones, diseñada con un enfoque industrial oscuro (Dark/Glassmorphism).
* **Perfilado Progresivo:** Sistema de autenticación JWT seguro que requiere el registro de datos vitales (tipo de sangre, contactos de emergencia y vehículo) antes de permitir el acceso a la telemetría.
* **Gestión de Roles (RBAC):** * `Conductor`: Acceso a telemetría en tiempo real y configuración de su perfil de emergencia.
    * `Administrador`: Panel de control global para monitorear la flota completa y revisar bitácoras de alertas.

---

## 🏗️ Arquitectura del Sistema

El proyecto está dividido en dos repositorios/carpetas principales:

```text
DriverSentinel/
├── backend/                # Servidor API RESTful
│   ├── src/
│   │   ├── controllers/    # Lógica de negocio (auth, users)
│   │   ├── middleware/     # Protección JWT y roles
│   │   ├── models/         # Esquemas de Mongoose
│   │   └── routes/         # Endpoints de la API
│   └── server.js           # Punto de entrada Node.js
│
├── frontend/               # Aplicación Web React (PWA)
│   ├── public/             # Iconos de PWA y Manifest
│   ├── src/
│   │   ├── components/     # UI Reutilizable (Navbar, Inputs)
│   │   ├── pages/          # Vistas (Login, Register, CompleteProfile)
│   │   └── store/          # Estado global con Zustand
│   └── vite.config.js      # Configuración de build y plugin PWA
│
└── hardware/               # (Próximamente) Código C++ para ESP32
```

---

## ⚙️ Instalación y Configuración Local

Para ejecutar este proyecto en tu entorno local, necesitas tener instalado [Node.js](https://nodejs.org/) y acceso a una base de datos [MongoDB](https://www.mongodb.com/).

### 1. Clonar el repositorio
```bash
git clone [https://github.com/tu-usuario/driversentinel.git](https://github.com/tu-usuario/driversentinel.git)
cd driversentinel
```

### 2. Configurar el Backend (API)
```bash
cd backend
npm install
```
Crea un archivo `.env` en la raíz de `backend/` con las siguientes variables:
```env
PORT=5000
MONGO_URI=mongodb+srv://<usuario>:<password>@cluster.mongodb.net/driversentinel
JWT_SECRET=tu_super_secreto_seguro_aqui
GOOGLE_CLIENT_ID=tu_cliente_id_de_google_opcional
```
Inicia el servidor:
```bash
npm run dev
```

### 3. Configurar el Frontend (PWA)
Abre una nueva terminal en la raíz del proyecto:
```bash
cd frontend
npm install
```
Crea un archivo `.env` en la raíz de `frontend/`:
```env
VITE_API_URL=http://localhost:5000/api
```
Inicia el servidor de desarrollo:
```bash
npm run dev
```
La aplicación estará disponible en `http://localhost:5173`.

---

## 🚀 Despliegue (Producción)

* **Frontend:** Preparado para despliegue automatizado en [Vercel](https://vercel.com/) con el preset de Vite. Recuerda configurar la variable de entorno `VITE_API_URL` apuntando a tu servidor de producción.
* **Backend:** Configurado para servicios como [Render](https://render.com/) o Railway. Asegúrate de configurar correctamente los CORS en `server.js` para permitir peticiones desde tu dominio de Vercel.

---
*DriverSentinel - La seguridad empieza en el borde.*