import footprintApi from './../helpers/footprint.helper';
import { transformData, fetchData, sortByHighestTotal } from './../helpers/seeds.helper';
import { setData, getData } from '../helpers/redis.helper';
import { SKIPPED_COUNTRIES, EMISSIONS_REDIS_KEY, REFRESH_DURATION, LAST_REFRESH_DATA_KEY } from './../configs/vars';

/**
 * Prepare emissions data by country.
 * 
 * Fetches data for all countries from the footprint API, processes it, and stores the results in Redis.
 * 
 * @returns {Promise<Object>} The emissions data organized by country.
 */
export const prepareEmissionsByCountry = async () => {
  try {
    const dataByCountry = {};

    // Fetch all countries data from the footprint API
    const countries = await footprintApi.getCountries();

    const promises = []

    // Create a request for each country
    for (const country of countries) {
      const countryName = country.countryName.toLowerCase().trim();
      
      if (!SKIPPED_COUNTRIES.includes(countryName) && !dataByCountry[countryName]) {
        promises.push(fetchData(country.countryCode));
      }
    }

    let results = await Promise.allSettled(promises);

    results = results
      .filter(result => result.status === 'fulfilled')
      .map(result => result.value);

    // Key by country name, transform and sort the data
    results.forEach(r => {
      const countryName = r[0].countryName.toLowerCase().trim()
      dataByCountry[countryName] = r;
    })

    let emissionsPerCountry = transformData(dataByCountry);
    emissionsPerCountry = await sortByHighestTotal(emissionsPerCountry);

    // Store the processed data in Redis
    setData(EMISSIONS_REDIS_KEY, emissionsPerCountry);
    setData(LAST_REFRESH_DATA_KEY, Date.now());

    return emissionsPerCountry;
  } catch (error) {
    console.error('Error fetching emissions data:', error);
  }
};

/**
 * Check if emissions data should be fetched on restart.
 * 
 * If the data has not been fetched recently, trigger the preparation of emissions data.
 */
export const shouldFetchOnRestart = async () => {
  const lastFetchTime = await getData(LAST_REFRESH_DATA_KEY);
  const currentTime = Date.now();
  
  // Check if data needs to be refreshed based on the refresh duration
  if (!lastFetchTime || (currentTime - lastFetchTime > REFRESH_DURATION)) {
    prepareEmissionsByCountry();
  }
};