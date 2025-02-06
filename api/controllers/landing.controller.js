import footprintApi from './../helpers/footprint.helper';
import { SUCCESS_STATUS_CODE } from './../configs/vars'

/**
 * Controller to get landing data and render a welcome page.
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getLandingData = async (req, res) => {
    try {
        // Fetch all countries data from the footprint API
        const countries = await footprintApi.getCountries();

        // Fetch specific country data (with country code 229) from the footprint API
        const country = await footprintApi.getDataForCountry(229);

        // Send an HTML response with the retrieved data
        return res.status(SUCCESS_STATUS_CODE).send(`
          <center>
            <h1>Welcome to Altruistiq!</h1>
            <div style="display: flex; flex-direction: row;">
              <div style="width: 50%; margin-right: 20px;">    
                <h3>Example countries JSON (first 5 results)</h3> 
                <pre style="  
                  text-align: left;
                  background: #f8f8f8;
                  border: 1px solid #efefef;
                  border-radius: 6px;
                  padding: 2em;"
                >${JSON.stringify(countries.slice(0, 5), null, 2)}</pre>
              </div>
              <div style="width: 50%;">    
                <h3>Example country JSON (first 5 years)</h3>
                <pre style="  
                  text-align: left;
                  background: #f8f8f8;
                  border: 1px solid #efefef;
                  border-radius: 6px;
                  padding: 2em;"
                >${JSON.stringify(country?.slice(0, 5), null, 2)}</pre>
              </div>
            </div>
          </center>    
        `);
    } catch (error) {
        // Handle any errors that occur during the process
        console.error('Error fetching landing data:', error);
        res.status(500).send('Internal Server Error');
    }
};