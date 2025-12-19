/* eslint-disable no-undef */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config(); // Cargar variables de entorno desde el archivo .env

const prisma = new PrismaClient();
const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET; // Usar JWT_SECRET desde el archivo .env

// Función para crear un nuevo usuario
export async function createUser(nombre, correo, contrasena, rol = "usuario") {
  try {
    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(contrasena, SALT_ROUNDS);

    // Crear el usuario en la base de datos
    const newUser = await prisma.usuario.create({
      data: {
        nombre,
        correo,
        contrasena: hashedPassword,
        rol,
      },
    });

    // Generar Token JWT
    const token = jwt.sign(
      {
        nombre: newUser.nombre,
        id_usuario: newUser.id_usuario,
        correo: newUser.correo,
        rol: newUser.rol,
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Datos decodificados del token:", decoded); //

    // Devolver el usuario junto con el token
    return {
      id_usuario: newUser.id_usuario,
      nombre: newUser.nombre,
      correo: newUser.correo,
      rol: newUser.rol,
      token, // Se añade el token aquí
    };
  } catch (error) {
    console.error("Error creating user:", error.message);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Función para autenticar un usuario
// Función para autenticar un usuario
export async function authenticateUser(correo, contrasena) {
  console.log("Authenticating user:", correo, contrasena);
  try {
    if (!correo || !contrasena) {
      throw new Error("Campos requeridos faltantes");
    }

    const user = await prisma.usuario.findUnique({
      where: { correo },
    });

    if (!user) {
      console.error("User not found");
      return null;
    }

    const isMatch = await bcrypt.compare(contrasena, user.contrasena);

    if (isMatch) {
      // Generar el token JWT con el ID y rol del usuario
      const token = jwt.sign(
        {
          id: user.id_usuario,
          nombre: user.nombre,
          correo: user.correo,
          rol: user.rol,
        },
        JWT_SECRET,
        { expiresIn: "2h" }
      );

      // Retornar el usuario junto con el token
      return { user, token };
    } else {
      console.error("Password does not match");
      return null;
    }
  } catch (error) {
    console.error("Error authenticating user:", error.message);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Configurar el transporte de correo
const isDevelopment = process.env.NODE_ENV !== 'production';

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true para 465, false para otros puertos
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // App Password de Gmail (16 caracteres)
  },
});

// Función para generar token de restablecimiento de contraseña
export async function generatePasswordResetToken(correo) {
  try {
    const token = jwt.sign({ correo }, JWT_SECRET, { expiresIn: "1h" }); // Token expira en 1 hora
    await prisma.usuario.update({
      where: { correo },
      data: { resetToken: token },
    });
    return token;
  } catch (error) {
    console.error("Error generating password reset token:", error);
    throw error;
  }
}

// Función para enviar correo electrónico de restablecimiento de contraseña
export async function sendPasswordResetEmail(correo, token) {
  try {
    // En desarrollo, solo mostrar el token en consola
    if (isDevelopment) {
      console.log('\n========================================');
      console.log('🔧 MODO DESARROLLO - EMAIL NO ENVIADO');
      console.log('========================================');
      console.log('Para:', correo);
      console.log('Token de recuperación:', token);
      console.log('URL de recuperación:');
      console.log(`http://localhost:3000/reset-password?token=${token}`);
      console.log('========================================\n');
      return; // No enviar email en desarrollo
    }

    // En producción, enviar email real
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: correo,
      subject: "Restablecimiento de contraseña - PC Builder",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Restablecer Contraseña</h2>
          <p>Has solicitado restablecer tu contraseña.</p>
          <p>Haz clic en el siguiente botón para continuar:</p>
          <a href="http://localhost:3000/reset-password?token=${token}" 
             style="display: inline-block; background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0;">
            Restablecer Contraseña
          </a>
          <p style="color: #6b7280; font-size: 14px;">Si no solicitaste este cambio, puedes ignorar este correo.</p>
          <p style="color: #6b7280; font-size: 14px;">Este enlace expirará en 1 hora.</p>
        </div>
      `,
      text: `Haz clic en el siguiente enlace para restablecer tu contraseña: http://localhost:3000/reset-password?token=${token}`,
    };

    await transporter.sendMail(mailOptions);
    console.log("Password reset email sent to:", correo);
  } catch (error) {
    console.error("Error sending password reset email:", error);
    throw error;
  }
}

// Función para restablecer la contraseña
export async function resetPassword(correo, nuevaContrasena) {
  try {
    const hashedPassword = await bcrypt.hash(nuevaContrasena, SALT_ROUNDS); // Encriptar la nueva contraseña
    const updatedUser = await prisma.usuario.update({
      where: { correo },
      data: { contrasena: hashedPassword, resetToken: null },
    });
    console.log("Password has been reset successfully:", updatedUser);
    return updatedUser;
  } catch (error) {
    console.error("Error resetting password:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}
