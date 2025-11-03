import pyotp
import qrcode
import re
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.image import MIMEImage
import os
from datetime import datetime

# Configuración de correo (debe ajustarse según tu proveedor)
EMAIL_CONFIG = {
    'smtp_server': 'mail.dominio.cl',
    'smtp_port': 587,
    'sender_email': 'correo@dominio.cl',
    'sender_password': 'contraseña_del_correo'
}

def validate_rut(rut):
    """Valida el formato y dígito verificador de un RUT chileno"""
    patron_rut = re.compile(r'^\d{7,8}-[0-9kK]$')
    if not patron_rut.match(rut):
        return False

    rut_numero, verificador = rut.split('-')
    rut_numero = int(rut_numero)

    suma = 0
    multiplo = 2
    for digito in reversed(str(rut_numero)):
        suma += int(digito) * multiplo
        multiplo = multiplo + 1 if multiplo < 7 else 2

    resto = suma % 11
    dv_esperado = str(11 - resto) if resto != 0 else '0'
    return dv_esperado == verificador.upper()

def generate_qr(rut):
    """Genera un código QR para la configuración de 2FA"""
    secret = pyotp.random_base32()
    totp = pyotp.totp.TOTP(secret)
    uri = totp.provisioning_uri(rut, issuer_name="Sistema de Asistencia")
    
    # Crear directorio si no existe
    os.makedirs('static/qrs', exist_ok=True)
    
    # Generar y guardar QR
    qr_path = f"static/qrs/qr_{rut}_{datetime.now().strftime('%Y%m%d%H%M%S')}.png"
    img = qrcode.make(uri)
    img.save(qr_path)
    
    return secret, qr_path

def send_email_with_qr(email, name, qr_path):
    """Envía un correo electrónico con el código QR adjunto"""
    msg = MIMEMultipart()
    msg['From'] = EMAIL_CONFIG['sender_email']
    msg['To'] = email
    msg['Subject'] = 'Código QR para Sistema de Asistencia'
    
    # Cuerpo del correo
    body = f"""
    Estimado/a {name},
    
    Gracias por registrarse en el Sistema de Asistencia.
    
    Adjunto encontrará el código QR que debe escanear con la aplicación Google Authenticator
    para configurar la autenticación de dos factores.
    
    Pasos para configurar:
    1. Descargue e instale Google Authenticator en su smartphone
    2. Abra la aplicación y seleccione "Escanear código QR"
    3. Apunte su cámara al código QR adjunto
    4. La aplicación generará códigos de 6 dígitos que deberá usar para iniciar sesión
    
    Si tiene alguna pregunta, no dude en contactarnos.
    
    Saludos cordiales,
    Equipo de Sistema de Asistencia
    """
    
    msg.attach(MIMEText(body, 'plain'))
    
    # Adjuntar imagen QR
    with open(qr_path, 'rb') as f:
        img_data = f.read()
    
    image = MIMEImage(img_data, name=os.path.basename(qr_path))
    msg.attach(image)
    
    # Enviar correo
    with smtplib.SMTP(EMAIL_CONFIG['smtp_server'], EMAIL_CONFIG['smtp_port']) as server:
        server.starttls()
        server.login(EMAIL_CONFIG['sender_email'], EMAIL_CONFIG['sender_password'])
        server.send_message(msg)

def verify_otp(secret, otp_code):
    """Verifica si el código OTP es válido"""
    totp = pyotp.TOTP(secret)
    return totp.verify(otp_code)