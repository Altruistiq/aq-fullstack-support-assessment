export type Country = {
  countryCode: string;
  countryName: string;
  isoa2: string;
  score: string;
  shortName: string;
};

export type CountryEmissionsForYear = {
  country: string;
  total: number; // this represents the emissions for that year
};

export type Emissions = { 
  data: {
    [year: number]: CountryEmissionsForYear 
  };
  message: string;
}

export type Year = {
  year: number;
};
