import { Note } from './note';

export type NoteUpdate = Pick<Note, 'title' | 'content' | 'tags'>
