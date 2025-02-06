import axios from 'axios'
import { FOOT_PRINT_API_KEY, FOOT_PRINT_BASE_URL } from '../configs/vars'

export default {
  get(apiUrl) {
    return axios.get(apiUrl, {
      auth: {
        username: 'any-user-name',
        password: FOOT_PRINT_API_KEY
      }
    })
  },

  // fetch all countries
  async getCountries() {
    const resp = await this.get(`${FOOT_PRINT_BASE_URL}countries`)
    return resp.data
  },

  // fetch a single country by countryCode
  async getDataForCountry(countryCode) {
    const resp = await this.get(`${FOOT_PRINT_BASE_URL}data/${countryCode}/all/EFCpc`)
    return resp.data
  }  
}