import { CreateNoteInput, Id, Note, UpdateNoteInput } from '@project/shared';
import { inject, injectable } from 'inversify';
import { ObjectId, WithoutId } from 'mongodb';
import { Database } from '../storage/database';
import { DatabaseCollection } from '../storage/mongoCollections';

@injectable()
export class NotesService {
  constructor(
    @inject(Database)
    private readonly database: Database
  ) {}

  async getAllByCustomer(customerId: Id): Promise<Note[]> {
    const notes = await this.database.db
      .collection<Note>(DatabaseCollection.notes)
      .find({ customerId })
      .sort({ updated_at: -1 })
      .toArray();
    
    return notes;
  }

  async getOne(id: Id, customerId: Id): Promise<Note | null> {
    const note = await this.database.db
      .collection<Note>(DatabaseCollection.notes)
      .findOne({ _id: id, customerId });
    
    return note;
  }

  async create(noteData: CreateNoteInput & { customerId: Id }): Promise<Note> {
    const now = new Date();
    const newNote: WithoutId<Note> = {
      title: noteData.title,
      content: noteData.content || '',
      customerId: noteData.customerId,
      tags: noteData.tags || [],
      created_at: now,
      updated_at: now,
    };

    const result = await this.database.db
      .collection<WithoutId<Note>>(DatabaseCollection.notes)
      .insertOne(newNote);

    const note = await this.database.db
      .collection<Note>(DatabaseCollection.notes)
      .findOne({ _id: result.insertedId });

    if (!note) throw new Error('Failed to create note');
    return note;
  }

  async update(
    id: Id,
    customerId: Id,
    updateData: UpdateNoteInput
  ): Promise<Note | null> {
    const updateFields: Partial<Note> = {
      updated_at: new Date(),
    };

    if (updateData.title !== undefined) updateFields.title = updateData.title;
    if (updateData.content !== undefined) updateFields.content = updateData.content;
    if (updateData.tags !== undefined) updateFields.tags = updateData.tags;

    const result = await this.database.db
      .collection<Note>(DatabaseCollection.notes)
      .findOneAndUpdate(
        { _id: id, customerId },
        { $set: updateFields },
        { returnDocument: 'after' }
      );

    return result 
    /*to do to poprawy chyba result.value */
  }

  async delete(id: Id, customerId: Id): Promise<boolean> {
    const result = await this.database.db
      .collection<Note>(DatabaseCollection.notes)
      .deleteOne({ _id: id, customerId });

    return result.deletedCount > 0;
  }

  async search(customerId: Id, query: string): Promise<Note[]> {
    const notes = await this.database.db
      .collection<Note>(DatabaseCollection.notes)
      .find({
        customerId,
        $or: [
          { title: { $regex: query, $options: 'i' } },
          { content: { $regex: query, $options: 'i' } },
          { tags: { $in: [new RegExp(query, 'i')] } },
        ],
      })
      .sort({ updated_at: -1 })
      .toArray();

    return notes;
  }
}