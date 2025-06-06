import { Note } from './note';

export type UpdateNoteInput = Partial<Pick<Note, 'title' | 'content' | 'tags'>>
