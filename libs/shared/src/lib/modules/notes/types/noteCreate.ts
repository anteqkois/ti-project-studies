import { Note } from './note';

export type NoteCreate = Pick<Note, 'title' | 'content' | 'tags'>
