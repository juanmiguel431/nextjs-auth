import {
  Collection,
  Db,
  Filter, FindCursor, FindOptions, InsertManyResult,
  InsertOneResult,
  MongoClient,
  OptionalUnlessRequiredId,
  ServerApiVersion, WithId, Document, UpdateFilter, UpdateOptions, UpdateResult
} from 'mongodb';

export default class MongoDbClient<T extends Document = any> {
  private readonly collection: Collection<T>;
  private db: Db;
  private client: MongoClient;

  constructor(collection: string) {
    const connectionString = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_CLUSTER}.mongodb.net/?retryWrites=true&w=majority`;
    this.client = new MongoClient(connectionString, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      }
    });

    this.db = this.client.db(process.env.MONGODB_DATABASE);
    this.collection = this.db.collection(collection);
  }

  public async connect(): Promise<void> {
    await this.client.connect();
  }

  public async close(): Promise<void> {
    await this.client.close();
  }

  public async insert(item: OptionalUnlessRequiredId<T>): Promise<InsertOneResult<T>> {
    return this.collection.insertOne(item);
  }

  public async update(filter: Filter<T>, update: UpdateFilter<T> | Partial<T>, options?: UpdateOptions): Promise<UpdateResult<T>>{
    return this.collection.updateOne(filter, update, options);
  }

  public async insertMany(items: OptionalUnlessRequiredId<T>[]): Promise<InsertManyResult<T>> {
    return this.collection.insertMany(items);
  }

  public async find(filter: Filter<T>, options?: FindOptions): Promise<FindCursor<WithId<T>>> {
    return this.collection.find(filter, options);
  }

  public async findOne(filter: Filter<T>, options?: FindOptions): Promise<FindCursor<WithId<T>> | null> {
    return this.collection.findOne(filter, options);
  }

  public async findAll(): Promise<FindCursor<WithId<T>>> {
    return this.collection.find();
  }
}
