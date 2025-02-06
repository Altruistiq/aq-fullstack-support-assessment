import redisClient from './../configs/redis';

/**
 * Set data in Redis.
 * 
 * Stores the given value under the specified key in the Redis database.
 * 
 * @param {string} key - The key under which the value should be stored.
 * @param {any} value - The value to be stored, which will be serialized to JSON.
 */
export const setData = async (key, value) => {
  await redisClient.set(key, JSON.stringify(value));
};

/**
 * Get data from Redis.
 * 
 * Retrieves the value stored under the specified key from the Redis database and deserializes it from JSON.
 * 
 * @param {string} key - The key whose associated value should be retrieved.
 * @returns {any} The deserialized value associated with the specified key.
 */
export const getData = async (key) => {
  const value = await redisClient.get(key);
  console.log('value', value);
  return JSON.parse(value);
};
