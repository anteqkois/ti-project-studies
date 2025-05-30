import { FastifyInstance } from 'fastify';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { NotesController } from './notes.controller';

export const notesRoutes = async (fastify: FastifyInstance) => {
  // Get all notes for authenticated user
  fastify.get(
    '/',
    { preValidation: authMiddleware },
    NotesController.getAll
  );

  // Get specific note by ID
  fastify.get(
    '/:id',
    { preValidation: authMiddleware },
    NotesController.getOne
  );

  // Create new note
  fastify.post(
    '/',
    { preValidation: authMiddleware },
    NotesController.create
  );

  // Update note
  fastify.put(
    '/:id',
    { preValidation: authMiddleware },
    NotesController.update
  );

  // Delete note
  fastify.delete(
    '/:id',
    { preValidation: authMiddleware },
    NotesController.delete
  );
};