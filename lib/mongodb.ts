import { MongoClient, Db } from "mongodb";

const uri = process.env.MONGO_DB_CONNECTION_STRING;

if (!uri) {
  throw new Error("MONGO_DB_CONNECTION_STRING ist nicht gesetzt (.env.local)");
}

// In dev the module graph is re-evaluated on every change — cache the client
// on globalThis so we don't open a new connection pool each time.
const globalWithMongo = globalThis as typeof globalThis & {
  _mongoClientPromise?: Promise<MongoClient>;
};

function getClient(): Promise<MongoClient> {
  if (!globalWithMongo._mongoClientPromise) {
    globalWithMongo._mongoClientPromise = new MongoClient(uri!).connect();
    // Bei fehlgeschlagener Verbindung erneut versuchen statt die kaputte
    // Promise für immer zu cachen.
    globalWithMongo._mongoClientPromise.catch(() => {
      globalWithMongo._mongoClientPromise = undefined;
    });
  }
  return globalWithMongo._mongoClientPromise;
}

export async function getDb(): Promise<Db> {
  const client = await getClient();
  return client.db("party");
}
