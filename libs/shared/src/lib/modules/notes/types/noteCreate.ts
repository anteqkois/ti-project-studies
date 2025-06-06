import { Note } from './note';

export type CreateNoteInput = Partial<Pick<Note, 'title' | 'content' | 'tags'>>
