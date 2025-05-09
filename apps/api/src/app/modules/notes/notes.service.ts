import { inject, injectable } from 'inversify';
import { Database } from '../storage/database';

@injectable()
export class NotesService {
  constructor(
    @inject(Database)
    private readonly database: Database,
  ) {
    //
  }

  async getServiceStats() {
    //
  }
}
