import { Database } from '@project/shared';
import { inject, injectable, preDestroy } from 'inversify';

@injectable()
export class NotesService {
  constructor(
    @inject(Database)
    private readonly database: Database,
  ) {
    //
  }

  @preDestroy()
  onDestroy() {
    // if (this.checkerInterval) clearInterval(this.checkerInterval);
  }

  async getServiceStats() {
    //
  }
}
