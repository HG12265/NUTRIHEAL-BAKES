const mongoose = require('mongoose');
const dns = require('dns');

// Configure reliable DNS servers for SRV record resolution (MongoDB Atlas)
try {
  dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
} catch (dnsErr) {
  // Ignore in environments where custom DNS servers cannot be set
}

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/nutriheal_bakes',
      {
        serverSelectionTimeoutMS: 10000,
      }
    );
    console.log(`[MongoDB Atlas] Connected: ${conn.connection.host}/${conn.connection.name}`);
  } catch (error) {
    console.error(`[MongoDB Atlas] Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
