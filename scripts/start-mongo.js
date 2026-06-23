const { MongoMemoryServer } = require('mongodb-memory-server');

async function start() {
  console.log('Starting local in-memory MongoDB database...');
  
  // Create a Mongo Memory Server instance bound to port 27017
  const mongoServer = await MongoMemoryServer.create({
    instance: {
      port: 27017,
      dbName: 'terramind',
      // Avoid downloading files every run by using default binary paths or caching
    }
  });

  const uri = mongoServer.getUri();
  console.log('\n==================================================');
  console.log(`🌱 MongoDB Memory Server is running at: ${uri}`);
  console.log('==================================================\n');
  console.log('Keep this terminal open to keep the database running.');
  console.log('Press Ctrl+C to stop.');

  // Handle termination gracefully
  process.on('SIGINT', async () => {
    console.log('\nStopping MongoDB Memory Server...');
    await mongoServer.stop();
    process.exit(0);
  });
  
  process.on('SIGTERM', async () => {
    console.log('\nStopping MongoDB Memory Server...');
    await mongoServer.stop();
    process.exit(0);
  });
}

start().catch(err => {
  console.error('Failed to start MongoDB Memory Server:', err);
  process.exit(1);
});
