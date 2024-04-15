import axios from 'axios';

const CITY_API_URL = 'https://public.opendatasoft.com/explore/dataset/geonames-all-cities-with-a-population-1000/api/?disjunctive.cou_name_en&sort=name';

export interface City {
  city_name: string;
  country: string;
  timezone: string;
  // Add more properties as needed
}

export async function fetchCities(): Promise<City[]> {
  try {
    const response = await axios.get(CITY_API_URL);
    return response.data.map((city: any) => ({
      city_name: city.city_name,
      country: city.country,
      timezone: city.timezone,
      // Map other properties accordingly
    }));
  } catch (error) {
    console.error('Error fetching cities:', error);
    return [];
  }
}

