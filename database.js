const { MongoClient } = require('mongodb');

const DATABASE_NAME = 'ultah';
const COLLECTION_NAME = 'main';
const DEFAULT_SETTINGS = { name: 'Budi Utomo', age: 20 };

let clientPromise;

function getCollection() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI belum dikonfigurasi.');
  }

  if (!clientPromise) {
    const client = new MongoClient(uri);
    clientPromise = client.connect().catch((error) => {
      clientPromise = undefined;
      throw error;
    });
  }

  return clientPromise.then((client) =>
    client.db(DATABASE_NAME).collection(COLLECTION_NAME)
  );
}

async function getSettings() {
  const collection = await getCollection();
  const settings = await collection.findOne({ _id: 'birthday' });

  return {
    name: settings?.name || DEFAULT_SETTINGS.name,
    age: Number.isInteger(settings?.age) ? settings.age : DEFAULT_SETTINGS.age,
  };
}

async function saveSettings({ name, age }) {
  const collection = await getCollection();
  const settings = { name, age, updatedAt: new Date() };

  await collection.updateOne(
    { _id: 'birthday' },
    { $set: settings },
    { upsert: true }
  );

  return { name, age };
}

module.exports = { getSettings, saveSettings };
