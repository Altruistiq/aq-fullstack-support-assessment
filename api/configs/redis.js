import { createClient } from 'redis';

// Create a new Redis client instance
const redisClient = createClient();

// Handle Redis client errors
redisClient.on('error', (err) => console.error('Redis Client Error', err));

// Function to connect to the Redis server
const connectRedis = async () => {
  await redisClient.connect();
  await redisClient.FLUSHDB();
};

// Connect to Redis server immediately upon loading the module
connectRedis();

// Export the Redis client instance for use in other parts of the application
export default redisClient;
