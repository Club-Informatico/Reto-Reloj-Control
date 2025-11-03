# ⏰ Desafío Club Informático: Reloj Control 2.0 🔐

![GitHub repo size](https://img.shields.io/github/repo-size/Club-Informatico/Reto-Reloj-Control)
![GitHub last commit](https://img.shields.io/github/last-commit/Club-Informatico/Reto-Reloj-Control)
![GitHub language count](https://img.shields.io/github/languages/count/Club-Informatico/Reto-Reloj-Control)

¡Saludos, maestros del código y guardianes de la seguridad! 👋

Esta semana, nuestro desafío es construir una aplicación web que simule un reloj control de asistencia online. Pero no uno cualquiera, sino uno seguro y moderno que valide la identidad de los usuarios de forma efectiva. Nuestro desafío es evolucionar el reloj de control para que incluya un sistema de **autenticación de dos factores (2FA)**. Ahora usaremos una de las formas más seguras y modernas de verificar una identidad.

¿Preparados para construir un sistema a prueba de hackers? ¡Manos a la obra!

---

## 🎯 El Desafío

El objetivo es crear una aplicación web que simule un **reloj control de asistencia con seguridad de nivel profesional**. Para registrar su entrada o salida, los usuarios deberán validar su identidad usando su **RUT chileno** y un **código de un solo uso (OTP)** generado por una app de autenticación en su teléfono.

---

## ✅ Requisitos Clave

Para completar este desafío con éxito, tu aplicación **DEBE** cumplir con los siguientes puntos:

1.  **Validación de RUT Chileno:**
    *   La aplicación debe tener un campo para ingresar un RUT chileno (ej: `12.345.678-9`).
    *   Debe validar que el RUT tenga un formato correcto y que el dígito verificador sea válido.

2.  **Autenticación de Dos Factores (2FA) con TOTP:**
    *   Una vez validado el RUT en la base de datos, el sistema debe verificar si el usuario ya tiene configurado el 2FA.
    *   **Si es la primera vez:** El sistema debe generar un **secreto** (una clave única) y mostrarlo al usuario como un **código QR**. El usuario deberá escanear este código con una app de autenticación (como Google Authenticator, Authy, Microsoft Authenticator, etc.) para vincular su cuenta.
    *   **Si ya está configurado:** El sistema debe pedirle al usuario que ingrese el **código numérico de 6 dígitos** que su app de autenticación está generando en ese momento.
    *   El backend debe verificar que este código es correcto antes de permitir el acceso al reloj.

3.  **Lógica de Entrada/Salida:**
    *   **Estado Inicial:** Solo el botón de **"Registrar Entrada"** debe estar visible y habilitado.
    *   **Después de Entrada:** Una vez que un usuario registra su entrada, el botón de "Registrar Entrada" se deshabilita y el de **"Registrar Salida"** se habilita.
    *   **Después de Salida:** Al registrar la salida, el sistema vuelve a su estado inicial para ese usuario (solo "Entrada" habilitada).

4.  **Persistencia de Datos:**
    *   Todos los registros de entrada y salida deben ser guardados en una base de datos.
    *   El secreto del 2FA de cada usuario debe ser guardado de forma segura en la base de datos.

---

## 🛠️ Sugerencias Técnicas

¡Manos a la obra! Puedes usar la tecnología que prefieras, pero aquí te dejamos un stack recomendado para este desafío:

*   **Backend:** Node.js (con Express), Python (con Flask o Django), PHP, etc.
*   **Base de Datos:** PostgreSQL, MySQL, MongoDB, SQLite.
*   **Frontend:** HTML, CSS y JavaScript puro. ¡O si te sientes valiente, React, Vue o Svelte!
*   **Librerías para 2FA (TOTP):**
    *   **Node.js:** [`speakeasy`](https://www.npmjs.com/package/speakeasy) (para generar/verificar códigos) y [`qrcode`](https://www.npmjs.com/package/qrcode) (para generar el QR).
    *   **Python:** [`pyotp`](https://pypi.org/project/pyotp/) y [`qrcode`](https://pypi.org/project/qrcode/).
    *   **PHP:** [`otphp`](https://github.com/Spomky-Labs/otphp) y [`endroid/qr-code`](https://github.com/endroid/qr-code).

---

## 📂 Estructura del Repositorio

Cada participante debe crear **una carpeta con su nombre o nick** dentro del directorio principal, y allí agregar todo su proyecto (archivos HTML, CSS, JS, Python, base de datos, etc.).

Ejemplo de estructura:

```
Reto-Reloj-Control/
├── Participante1/
│   ├── app.py
│   ├── templates/
│   └── images/
├── Participante2/
│   ├── app.py
│   ├── base-de-datos/
│   └── images/
├── README.md
└── LICENSE
```

👉 De esta forma, todos los aportes quedarán ordenados y será más fácil revisar cada propuesta.  

---

## 📊 Propuesta de Esquema de Base de Datos

Para guiarte, aquí tienes una propuesta de cómo podrían ser tus tablas:

### Tabla `usuarios`

| Columna | Tipo | Descripción |
|---|---|---|
| `id` | INTEGER / UUID | Identificador único del usuario (Primary Key). |
| `rut` | VARCHAR(12) | RUT del usuario (único). |
| `nombre_completo` | VARCHAR(255) | Nombre completo del usuario. |
| `email` | VARCHAR(255) | Correo electrónico del usuario (único). |
| `totp_secret` | VARCHAR(255) | Secreto para la autenticación de dos factores (puede ser NULL inicialmente). |

### Tabla `registros_asistencia`

| Columna | Tipo | Descripción |
|---|---|---|
| `id` | INTEGER / UUID | Identificador único del registro (Primary Key). |
| `usuario_id` | INTEGER / UUID | Clave foránea que referencia a `usuarios.id`. |
| `hora_entrada` | TIMESTAMP | Fecha y hora exacta del registro de entrada. |
| `hora_salida` | TIMESTAMP | Fecha y hora exacta del registro de salida (puede ser NULL inicialmente). |

---

## 🚀 Cómo Empezar

1.  **Fork** este repositorio a tu cuenta de GitHub.
2.  **Clona** tu fork a tu máquina local:
    ```bash
    git clone https://github.com/TU_USUARIO/Reto-Reloj-Control.git
    cd Reto-Reloj-Control
    ```
3.  Crea una nueva rama para tu solución:
    ```bash
    git checkout -b mi-solucion-2fa
    ```
4.  **¡A programar!** Construye tu increíble y segura aplicación.
5.  **Añade un archivo `.env`** (y no lo subas a Git) para guardar tus claves secretas (contraseña de BD, etc.).
6.  Haz **commit** y **push** de tus cambios a tu fork:
    ```bash
    git add .
    git commit -m "feat: Implementa reloj control con 2FA"
    git push origin mi-solucion-2fa
    ```
7.  Abre un **Pull Request** desde tu rama hacia la rama `main` de este repositorio original para compartir tu solución.

---

## 🏆 Puntos Extra (Opcional, pero muy cool)

*   **Códigos de Recuperación:** Permite que los usuarios generen una lista de códigos de un solo uso. Si pierden su teléfono, pueden usar uno de estos códigos para acceder.
*   **Panel de Administración:** Una vista simple donde se puedan ver todos los usuarios y sus registros de tiempo.
*   **Reportes:** Una funcionalidad que calcule las horas trabajadas por día o por semana para un usuario.
*   **Mejor UI/UX:** ¡Dale estilo a la aplicación! Usa un framework CSS como Tailwind, Bootstrap o Materialize.
*   **Docker:** Containeriza tu aplicación para que sea fácil de desplegar.

---

## 📚 Recursos Útiles

*   [Algoritmo de Validación de RUT Chileno](https://es.wikipedia.org/wiki/Rol_%C3%9Anico_Tributario#Algoritmo_de_c%C3%A1lculo_del_d%C3%ADgito_verificador)
*   [¿Qué es una autenticación de multiples factores?](https://es.wikipedia.org/wiki/Autenticación_de_múltiples_factores)
*   [Documentación de `speakeasy` (Node.js)](https://www.npmjs.com/package/speakeasy)
*   [Documentación de `pyotp` (Python)](https://pyauth.github.io/pyotp/)

---

¡Este desafío es un paso gigante hacia el mundo de la ciberseguridad aplicada! Disfruten el proceso de construir algo que no solo funciona, sino que es robusto y seguro. ¡A programar se ha dicho! 💻🔐

---

## 🏆 Ranking

<table align="center">
  <tr>
    <td align="center">
      <a href="https://github.com/KrlitosForever">
        <img src="https://avatars.githubusercontent.com/u/7423579?v=4" width="140" />
      </a>
    </td>
     <td align="center">
      <a href="#">
        <img src="#" width="140" />
      </a>
    </td>
     <td align="center">
      <a href="#">
        <img src="#" width="140" />
      </a>
    </td>
  </tr>
  <tr>
    <td align="center">Carlos Carrasco <img src="https://rawcdn.githack.com/twitter/twemoji/v14.0.2/assets/svg/1f1e8-1f1f1.svg" width="16" /></td>
    <td align="center">? ? ? <img src="https://rawcdn.githack.com/twitter/twemoji/v14.0.2/assets/svg/1f1e8-1f1f1.svg" width="16" /></td>
    <td align="center">? ? ? <img src="https://rawcdn.githack.com/twitter/twemoji/v14.0.2/assets/svg/1f1e8-1f1f1.svg" width="16" /></td>
  </tr>
  <tr>
     <td align="center">
     <img src="https://twemoji.maxcdn.com/v/latest/svg/1f947.svg" width="64" alt="Medalla de oro" />
     </td>
     <td align="center">
     <img src="https://twemoji.maxcdn.com/v/latest/svg/1f948.svg" width="64" alt="Medalla de oro" />
     </td>
     <td align="center">
     <img src="https://twemoji.maxcdn.com/v/latest/svg/1f949.svg" width="64" alt="Medalla de oro" />
     </td>
  </tr>
</table>

## Colaboradores

<a href="https://github.com/Club-Informatico/Reto-Reloj-Control/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=Club-Informatico/Reto-Reloj-Control" />
</a>
