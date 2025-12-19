/* eslint-disable no-undef */
import jwt from 'jsonwebtoken';
import prisma from '../../prisma/prismaClient.js';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

export const generarTokenCompartir = async (req, res) => {
  try {
    const { id } = req.params;
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Token no proporcionado' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const id_usuario = decoded.id;

    // Verificar que el ensamble pertenece al usuario
    const ensamble = await prisma.ensamble.findUnique({
      where: { id_ensamble: parseInt(id) },
    });

    if (!ensamble) {
      return res.status(404).json({ error: 'Ensamble no encontrado' });
    }

    if (ensamble.id_usuario !== id_usuario) {
      return res.status(403).json({ error: 'No tienes permiso para compartir este ensamble' });
    }

    // Generar token único si no existe
    let tokenCompartir = ensamble.token_compartir;
    
    if (!tokenCompartir) {
      tokenCompartir = crypto.randomBytes(16).toString('hex');
      
      await prisma.ensamble.update({
        where: { id_ensamble: parseInt(id) },
        data: {
          token_compartir: tokenCompartir,
          es_publico: true,
        },
      });
    }

    const shareUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/shared/${tokenCompartir}`;
    
    return res.status(200).json({ 
      success: true,
      shareUrl,
      token: tokenCompartir
    });

  } catch (error) {
    console.error('Error al generar token de compartir:', error);
    return res.status(500).json({ error: 'Error al generar link de compartir' });
  }
};

export const obtenerEnsambleCompartido = async (req, res) => {
  try {
    const { token } = req.params;

    const ensamble = await prisma.ensamble.findUnique({
      where: { 
        token_compartir: token,
        es_publico: true,
      },
      include: {
        Usuario: {
          select: {
            nombre: true,
          }
        },
        Ensamble_Componente: {
          include: {
            Componente: true,
          },
        },
        EvaluacionIA: true,
      },
    });

    if (!ensamble) {
      return res.status(404).json({ error: 'Ensamble no encontrado o no es público' });
    }

    return res.status(200).json(ensamble);

  } catch (error) {
    console.error('Error al obtener ensamble compartido:', error);
    return res.status(500).json({ error: 'Error al obtener ensamble compartido' });
  }
};

export const desactivarCompartir = async (req, res) => {
  try {
    const { id } = req.params;
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Token no proporcionado' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const id_usuario = decoded.id;

    const ensamble = await prisma.ensamble.findUnique({
      where: { id_ensamble: parseInt(id) },
    });

    if (!ensamble || ensamble.id_usuario !== id_usuario) {
      return res.status(403).json({ error: 'No tienes permiso' });
    }

    await prisma.ensamble.update({
      where: { id_ensamble: parseInt(id) },
      data: { es_publico: false },
    });

    return res.status(200).json({ 
      success: true,
      message: 'Compartir desactivado'
    });

  } catch (error) {
    console.error('Error al desactivar compartir:', error);
    return res.status(500).json({ error: 'Error al desactivar compartir' });
  }
};
