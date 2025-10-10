/*
    Modelo: Employee
    Campos:
    - name: String, requerido, validaciones de formato y longitud
    - email: String, requerido, formato email, único
    - password: String, requerido, validaciones de seguridad
*/

import { Schema, model } from "mongoose";

const EmployeeSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'El nombre es obligatorio'],
      minlength: [2, 'El nombre debe tener al menos 2 caracteres'],
      maxlength: [50, 'El nombre no puede exceder 50 caracteres'],
     /* trim: true,
      match: [/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'El nombre solo puede contener letras y espacios'],
      validate: {
        validator: function(value) {
          return value.split(' ').length >= 2;
        },
        message: 'Debe proporcionar nombre y apellido'
      }*/
    },

    email: {
      type: String,
      required: [true, 'El correo electrónico es obligatorio'],
      unique: true,
      match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/],
      /*
      lowercase: true,
      trim: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        'Por favor ingrese un correo electrónico válido'
      ],
      maxlength: [100, 'El correo no puede exceder 100 caracteres']*/
    },

    password: {
      type: String,
      required: [true, 'La contraseña es obligatoria'],
      minlength: [8, 'La contraseña debe tener al menos 8 caractxeres'],
      maxlength: [128, 'La contraseña no puede exceder 128 caracteres'],
      /*validate: [
        {
          validator: function(password) {
            return /[a-z]/.test(password);
          },
          message: 'La contraseña debe contener al menos una letra minúscula'
        },
        {
          validator: function(password) {
            return /[A-Z]/.test(password);
          },
          message: 'La contraseña debe contener al menos una letra mayúscula'
        },
        {
          validator: function(password) {
            return /\d/.test(password);
          },
          message: 'La contraseña debe contener al menos un número'
        },
        {
          validator: function(password) {
            return /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
          },
          message: 'La contraseña debe contener al menos un carácter especial'
        },
        {
          validator: function(password) {
            return !/\s/.test(password);
          },
          message: 'La contraseña no puede contener espacios'
        }
      ]*/
    },
    image: {
      type: String,
      
    },
     loginAttemps: {
      type: Number,
      default: 0
    },
    timeOut: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true,
    strict: false,
  }
);

export default model("Employee", EmployeeSchema);
