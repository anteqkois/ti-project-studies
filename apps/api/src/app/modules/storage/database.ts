import { assertNotEmpty, getDbName } from '@project/shared';
import { injectable } from 'inversify';
import { Db, MongoClient, ServerApiVersion } from 'mongodb';

@injectable()
export class Database {
  private url: string;

  public client: MongoClient;
  public db: Db;

  constructor() {
    assertNotEmpty(process.env.MONGO_URL, 'MONGO_URL');

    this.url = process.env.MONGO_URL;

    this.client = new MongoClient(this.url, {
      compressors: 'zstd',
      connectTimeoutMS: 60000, // Increase to 60s
      socketTimeoutMS: 60000, // Increase for better stability
      serverSelectionTimeoutMS: 60000, // Helps in selecting a reachable server
      // directConnection: true,
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
    });

    this.db = this.client.db(getDbName(this.url));
    this.client
      .connect()
      .then(() => {
        console.info(`#Database connected to database`);
      })
      .catch((err) => {
        console.error(`#Database can not connect to database`, err);
      });
  }
}
