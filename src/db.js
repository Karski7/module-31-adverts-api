const mongoose = require('mongoose');
const MongoStore = require('connect-mongo').default;
const { MongoMemoryServer } = require('mongodb-memory-server');

let memoryServer;

const connectDatabase = async () => {
  const mongoUri = process.env.MONGODB_URI || await createMemoryDatabase();

  await mongoose.connect(mongoUri);

  return {
    mongoUri,
    sessionStore: MongoStore.create({
      client: mongoose.connection.getClient(),
      collectionName: 'sessions',
    }),
  };
};

const createMemoryDatabase = async () => {
  memoryServer = await MongoMemoryServer.create({
    instance: {
      dbName: 'module31adverts',
      launchTimeout: 30000,
    },
  });

  return memoryServer.getUri();
};

const disconnectDatabase = async () => {
  await mongoose.disconnect();
  if (memoryServer) await memoryServer.stop();
};

module.exports = {
  connectDatabase,
  disconnectDatabase,
};
