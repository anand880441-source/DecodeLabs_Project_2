const app = require('./app');
const dotenv = require('dotenv');

dotenv.config();

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log('═══════════════════════════════════════════════════');
  console.log('  🚀 DECODELABS - PROJECT 2 API');
  console.log(`  📡 Server running on http://localhost:${PORT}`);
  console.log(`  🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`  📚 API Version: ${process.env.API_VERSION || 'v1'}`);
  console.log(`  💚 Health Check: http://localhost:${PORT}/health`);
  console.log('═══════════════════════════════════════════════════');
});

// Graceful Shutdown
const shutdown = () => {
  console.log('\n🛑 Received shutdown signal. Closing server...');
  server.close(() => {
    console.log('✅ Server closed successfully.');
    process.exit(0);
  });
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

module.exports = server;