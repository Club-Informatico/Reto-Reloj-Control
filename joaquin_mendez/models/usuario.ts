import { DataTypes } from "sequelize"
import sequelize from "../database/db.ts"


export const Usuario = sequelize.define('usuarios', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    rut: {
        type: DataTypes.STRING(12),
        unique: true,
        allowNull: false
    },
    nombre_completo: {
        type: DataTypes.STRING,
    },
    email: {
        type: DataTypes.STRING,
        unique: true
    },
    totp_secret: {
        type: DataTypes.STRING,
    }
});

export const RegistroAsistencia = sequelize.define('registros_asistencia', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    hora_entrada: {
        type: DataTypes.TIME,
        allowNull: false
    },
    hora_salida: {
        type: DataTypes.TIME,
        allowNull: true
    }
});

Usuario.hasOne(RegistroAsistencia);


//export default Usuario
