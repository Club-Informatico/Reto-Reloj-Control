# models.py

import sqlite3
from datetime import datetime 
from werkzeug.security import generate_password_hash, check_password_hash

DB_NAME = 'database.db'

def get_db_connection():
    conn = sqlite3.connect(DB_NAME)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    
    # Tabla de usuarios con la nueva columna 'password_hash'
    conn.execute('''
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        rut TEXT UNIQUE NOT NULL,
        email TEXT NOT NULL,
        password_hash TEXT NOT NULL,
        secret TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    ''')
    
    # Tabla de registros de asistencia (sin cambios)
    conn.execute('''
    CREATE TABLE IF NOT EXISTS attendance (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_rut TEXT NOT NULL,
        type TEXT NOT NULL CHECK(type IN ('ingreso', 'salida')),
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_rut) REFERENCES users (rut)
    )
    ''')
    
    conn.commit()
    conn.close()

def get_user_by_rut(rut):
    conn = get_db_connection()
    user = conn.execute('SELECT * FROM users WHERE rut = ?', (rut,)).fetchone()
    conn.close()
    return user

def create_user(name, rut, email, password, secret):
    # Hashear la contraseña antes de guardarla
    password_hash = generate_password_hash(password)
    
    conn = get_db_connection()
    conn.execute(
        'INSERT INTO users (name, rut, email, password_hash, secret) VALUES (?, ?, ?, ?, ?)',
        (name, rut, email, password_hash, secret)
    )
    conn.commit()
    conn.close()

def verify_user_password(rut, password):
    """Verifica si la contraseña ingresada coincide con el hash almacenado."""
    user = get_user_by_rut(rut)
    if user and check_password_hash(user['password_hash'], password):
        return True
    return False

def register_attendance(user_rut, attendance_type):
    conn = get_db_connection()
    # Obtener la hora actual en UTC
    utc_now = datetime.utcnow()
    # Formatearla para que SQLite la entienda
    formatted_time = utc_now.strftime('%Y-%m-%d %H:%M:%S')
    
    conn.execute(
        # Ahora insertamos explícitamente el timestamp
        'INSERT INTO attendance (user_rut, type, timestamp) VALUES (?, ?, ?)',
        (user_rut, attendance_type, formatted_time)
    )
    conn.commit()
    conn.close()

def get_last_attendance(user_rut):
    conn = get_db_connection()
    attendance = conn.execute(
        'SELECT * FROM attendance WHERE user_rut = ? ORDER BY timestamp DESC LIMIT 1',
        (user_rut,)
    ).fetchone()
    conn.close()
    return attendance