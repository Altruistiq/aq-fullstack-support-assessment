import { getData, setData } from "../helpers/redis.helper";
import { prepareEmissionsByCountry } from "./seeds.controller";
import { CACHE_DURATION, EMISSIONS_REDIS_KEY, LAST_REFRESH_DATA_API_KEY } from './../configs/vars';

/**
 * Controller to get emissions data by country.
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} currentTimeProvider - Function to provide the current time (used for testing)
 */
export const getEmissionsByCountry = async (req, res, currentTimeProvider = () => Date.now()) => {
  try {
    // Retrieve emissions data from Redis cache
    const emissionsPerCountry = await getData(EMISSIONS_REDIS_KEY);
    
    if (emissionsPerCountry) {
      // If data is found in the cache, return it with a success message
      return res.json({ data: emissionsPerCountry, message: "Emissions per country retrieved successfully!" });
    } else {
      // If data is not found in the cache, notify the client and prepare the data
      res.json({ message: "Emissions data will be ready soon, check back later!" });
      
      let currentTime = currentTimeProvider();
      if(!currentTime) 
        currentTime = Date.now();
      
      const lastFetchTime = await getData(LAST_REFRESH_DATA_API_KEY);

      console.log('lastFetchTime', lastFetchTime, currentTime - lastFetchTime > CACHE_DURATION)

      // Check if the data needs to be refreshed based on the cache duration
      if (!lastFetchTime || (currentTime - lastFetchTime > CACHE_DURATION)) {
        // Prepare emissions data and update the last fetch time in Redis
        prepareEmissionsByCountry();
        setData(LAST_REFRESH_DATA_API_KEY, currentTime);
      }
    }
  } catch (error) {
    // Handle any errors that occur during the process
    console.error('Error fetching emissions data:', error);
    res.status(500).send('Internal Server Error');
  }
};
