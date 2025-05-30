import { CreateNoteInput, IdParams, Note, UpdateNoteInput } from '@project/shared';
import { FastifyReply, FastifyRequest } from 'fastify';
import { ObjectId } from 'mongodb';
import { servicesContainer } from '../../container';
import { NotesService } from './notes.service';

export class NotesController {
  static async getAll(req: FastifyRequest, res: FastifyReply) {
    const notesService = servicesContainer.get<NotesService>(NotesService);
    const customerId = new ObjectId(req.customer.sub);
    
    const notes = await notesService.getAllByCustomer(customerId);
    return res.send(notes);
  }

  static async getOne(req: FastifyRequest<NotesGetOne>, res: FastifyReply) {
    const { id } = req.params;
    const notesService = servicesContainer.get<NotesService>(NotesService);
    const customerId = new ObjectId(req.customer.sub);
    
    const note = await notesService.getOne(new ObjectId(id), customerId);
    if (!note) return res.notFound();
    
    return res.send(note);
  }

  static async create(req: FastifyRequest<NotesCreate>, res: FastifyReply) {
    const notesService = servicesContainer.get<NotesService>(NotesService);
    const customerId = new ObjectId(req.customer.sub);
    
    const note = await notesService.create({
      ...req.body,
      customerId,
    });
    
    return res.status(201).send(note);
  }

  static async update(req: FastifyRequest<NotesUpdate>, res: FastifyReply) {
    const { id } = req.params;
    const notesService = servicesContainer.get<NotesService>(NotesService);
    const customerId = new ObjectId(req.customer.sub);
    
    const note = await notesService.update(new ObjectId(id), customerId, req.body);
    if (!note) return res.notFound();
    
    return res.send(note);
  }

  static async delete(req: FastifyRequest<NotesDelete>, res: FastifyReply) {
    const { id } = req.params;
    const notesService = servicesContainer.get<NotesService>(NotesService);
    const customerId = new ObjectId(req.customer.sub);
    
    const deleted = await notesService.delete(new ObjectId(id), customerId);
    if (!deleted) return res.notFound();
    
    return res.status(204).send();
  }
}

export interface NotesGetOne {
  Params: IdParams;
}

export interface NotesCreate {
  Body: CreateNoteInput;
}

export interface NotesUpdate {
  Params: IdParams;
  Body: UpdateNoteInput;
}

export interface NotesDelete {
  Params: IdParams;
}