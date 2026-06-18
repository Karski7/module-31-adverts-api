const { createApp } = require('./src/app');
const { connectDatabase } = require('./src/db');
const { seedDatabase } = require('./src/seed');

const PORT = process.env.PORT || 8000;

const startServer = async () => {
  const db = await connectDatabase();
  const app = createApp({ sessionStore: db.sessionStore });

  await seedDatabase();

  app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
  });
};

startServer().catch((error) => {
  console.error('Unable to start server:', error);
  process.exit(1);
});
