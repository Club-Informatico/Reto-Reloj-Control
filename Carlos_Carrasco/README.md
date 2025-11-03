# 🕒 Sistema de Asistencia con 2FA (QR + OTP)

Un sistema web creado con **Flask** que permite registrar **asistencia** mediante **Autenticación de Dos Factores (2FA)** usando códigos QR y Google Authenticator.

⛑️ Flujo principal del usuario:

1. Se registra en la app ✅
2. Recibe un **código QR por correo** 📩
3. Configura Google Authenticator 📱
4. Inicia sesión e **ingresa / sale** del sistema registrando asistencia 🏁

---

## 🧩 ¿Qué incluye este proyecto?

* Registro y login seguro con contraseña hasheada
* Envío de QR por correo electrónico
* **2FA con códigos OTP** generados por Google Authenticator
* Validación de RUT chileno 🇨🇱
* Gestión de asistencia en base de datos SQLite
* Conversión automática a zona horaria chilena (America/Santiago)

👀 Los componentes principales:

| Archivo       | Descripción                                        |
| ------------- | -------------------------------------------------- |
| `app.py`      | Rutas principales del sistema Flask                |
| `models.py`   | Base de datos SQLite + usuarios + asistencia       |
| `utils.py`    | Generación QR + Email + Validación RUT + OTP       |
| `install.txt` | Dependencias necesarias para ejecutar el proyecto  |

---

## 🛠️ Instalación y ejecución

### 1️⃣ Crear un entorno virtual (recomendado ✅)

```bash
# Crear entorno virtual
python3 -m venv venv

# Activar en Linux o macOS
source venv/bin/activate

# Activar en Windows PowerShell
.\venv\Scripts\activate
```

### 2️⃣ Instalar dependencias

```bash
pip install flask pyotp qrcode[pil] python-dotenv pytz
```

### 3️⃣ Ejecutar la app

```bash
python app.py
```

Luego abre en tu navegador:
➡️ [http://127.0.0.1:5000](http://127.0.0.1:5000)

---

## 📬 Configuración de correo

En `utils.py` puedes modificar los datos SMTP para que funcionen con tu servidor:

```python
EMAIL_CONFIG = {
    'smtp_server': 'mail.dominio.cl',
    'smtp_port': 587,
    'sender_email': 'correo@dominio.cl',
    'sender_password': 'contraseña_del_correo'
}
```

---

## 🗄️ Base de datos

La base se crea automáticamente al iniciar la app ✅

📌 Archivo: `database.db` (SQLite)

Puedes inspeccionarla con:

```bash
sqlite3 database.db
.tables
SELECT * FROM users;
SELECT * FROM attendance;
```

---

## 💡 Próximas mejoras sugeridas

✅ Separar ambiente de desarrollo y producción
✅ Usar `.env` para credenciales y secret keys
✅ Agregar dashboard con estadísticas
✅ Tests automatizados en CI/CD

---

## ⭐ ¿Te sirvió? ¡Apóyanos!

Si este repo te fue útil 👉 **Dale una estrella ⭐** y comparte con tu equipo 🙌

---
