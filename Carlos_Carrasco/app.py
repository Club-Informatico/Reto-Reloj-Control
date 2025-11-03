# app.py

from flask import Flask, render_template, request, redirect, url_for, flash, session
from models import init_db, get_user_by_rut, create_user, register_attendance, get_last_attendance, verify_user_password
from utils import generate_qr, send_email_with_qr, validate_rut, verify_otp
from datetime import datetime 
import pytz 


app = Flask(__name__)
app.secret_key = 'tu_clave_secreta_aqui_cambiala'

# Definir la zona horaria local (Chile)
chile_tz = pytz.timezone('America/Santiago')

# Función auxiliar para convertir UTC a hora local
def format_local_time(utc_timestamp_str):
    """Convierte un string de timestamp UTC a un string de hora local en Chile."""
    if not utc_timestamp_str:
        return "N/A"
    
    # 1. Parsear el string a un objeto datetime (asumiendo que es UTC)
    utc_dt = datetime.strptime(utc_timestamp_str, '%Y-%m-%d %H:%M:%S')
    
    # 2. Asignar la zona horaria UTC al objeto
    utc_dt = pytz.utc.localize(utc_dt)
    
    # 3. Convertir a la zona horaria de Chile
    local_dt = utc_dt.astimezone(chile_tz)
    
    # 4. Formatear a un string legible
    return local_dt.strftime('%d-%m-%Y %H:%M:%S')

# ... (las rutas init_db, index, register, login no cambian) ...

# Inicializar base de datos
init_db()

@app.route('/')
def index():
    return render_template('login.html')

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        name = request.form['name']
        rut = request.form['rut']
        email = request.form['email']
        password = request.form['password']
        confirm_password = request.form['confirm_password']
        
        # Validar que las contraseñas coincidan
        if password != confirm_password:
            flash('Las contraseñas no coinciden.', 'error')
            return render_template('register.html')
        
        # Validar RUT
        if not validate_rut(rut):
            flash('RUT inválido. Por favor, verifique el formato y dígito verificador.', 'error')
            return render_template('register.html')
        
        # Verificar si el usuario ya existe
        if get_user_by_rut(rut):
            flash('Este RUT ya está registrado en el sistema.', 'error')
            return render_template('register.html')
        
        # Crear usuario y generar QR
        secret, qr_path = generate_qr(rut)
        create_user(name, rut, email, password, secret) # Pasamos la contraseña en texto plano, se hashea en el modelo
        
        # Enviar QR por correo
        try:
            send_email_with_qr(email, name, qr_path)
            flash('Usuario registrado exitosamente. Se ha enviado un código QR a su correo.', 'success')
            return redirect(url_for('login'))
        except Exception as e:
            flash(f'Error al enviar el correo: {str(e)}', 'error')
            return render_template('register.html')
    
    return render_template('register.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        rut = request.form['rut']
        password = request.form['password'] # Recibimos la contraseña
        
        # Validar RUT
        if not validate_rut(rut):
            flash('RUT inválido. Por favor, verifique el formato y dígito verificador.', 'error')
            return render_template('login.html')
        
        # Verificar usuario y contraseña usando la nueva función
        if verify_user_password(rut, password):
            # La contraseña es correcta, obtener datos de usuario para la sesión
            user = get_user_by_rut(rut)
            session['user_id'] = user['id']
            session['user_rut'] = user['rut']
            session['user_name'] = user['name']
            flash('Inicio de sesión exitoso.', 'success')
            return redirect(url_for('dashboard'))
        else:
            flash('RUT o contraseña incorrectos.', 'error')
            return render_template('login.html')
    
    return render_template('login.html')

# --- Las rutas de dashboard, register_attendance_route y logout no cambian ---
# Porque ya usan el OTP para la acción de asistencia.

@app.route('/dashboard')
def dashboard():
    if 'user_id' not in session:
        return redirect(url_for('login'))
    
    user_rut = session['user_rut']
    user_name = session['user_name']
    
    last_attendance = get_last_attendance(user_rut)
    
    # Si hay un registro de asistencia, formateamos su hora a la local
    if last_attendance:
        # Convertimos el objeto Row a un diccionario mutable para poder modificarlo
        last_attendance = dict(last_attendance)
        # Aplicamos nuestra función de conversión de hora
        last_attendance['timestamp'] = format_local_time(last_attendance['timestamp'])
    
    can_check_in = not last_attendance or last_attendance['type'] == 'salida'
    can_check_out = last_attendance and last_attendance['type'] == 'ingreso'
    
    return render_template('dashboard.html', 
                          user_name=user_name,
                          user_rut=user_rut,
                          can_check_in=can_check_in,
                          can_check_out=can_check_out,
                          last_attendance=last_attendance)

@app.route('/register_attendance', methods=['POST'])
def register_attendance_route():
    if 'user_id' not in session:
        return redirect(url_for('login'))
    
    user_rut = session['user_rut']
    attendance_type = request.form['attendance_type']
    otp_code = request.form['otp_code']
    
    # Verificar OTP
    user = get_user_by_rut(user_rut)
    if not verify_otp(user['secret'], otp_code):
        flash('Código 2FA inválido. Intente nuevamente.', 'error')
        return redirect(url_for('dashboard'))
    
    register_attendance(user_rut, attendance_type)
    flash(f'{attendance_type.capitalize()} registrado exitosamente.', 'success')
    
    return redirect(url_for('dashboard'))

@app.route('/logout')
def logout():
    session.clear()
    flash('Sesión cerrada correctamente.', 'info')
    return redirect(url_for('login'))

if __name__ == '__main__':
    app.run(debug=True)