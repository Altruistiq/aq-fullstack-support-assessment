import assert from 'assert';
import sinon from 'sinon';
import * as redisHelper from '../helpers/redis.helper';
import * as seedsHelper from '../helpers/seeds.helper';
import footprintApi from '../helpers/footprint.helper';
import * as seedsController from '../controllers/seeds.controller';
import { DELAY_IN_REQUESTS } from '../configs/vars';

describe('Testing emissions controller and helper functions', function() {
  this.timeout(10); // Increase timeout to 30 seconds

  let setDataStub;
  let getDataStub;
  let footprintApiStub;
  let fetchDataStub;
  let clock;
  let currentTimeProvider;

  beforeEach(() => {
    setDataStub = sinon.stub(redisHelper, 'setData');
    getDataStub = sinon.stub(redisHelper, 'getData');
    footprintApiStub = sinon.stub(footprintApi, 'getCountries');
    fetchDataStub = sinon.stub(footprintApi, 'getDataForCountry');
    clock = sinon.useFakeTimers();
    currentTimeProvider = () => clock.now;
  });

  afterEach(() => {
    sinon.restore();
    clock.restore();
  });

  it('should prepare emissions data by country', async () => {
    const countriesMock = [
      {
        "score": "3A",
        "shortName": "Armenia",
        "countryCode": "1",
        "countryName": "Armenia",
        "isoa2": "AM"
      },
      {
        "score": "3A",
        "shortName": "Afghanistan",
        "countryCode": "2",
        "countryName": "Afghanistan",
        "isoa2": "AF"
      }
    ];
    const dataMock = [
      { year: 2020, carbon: 5000, countryName: "Afghanistan" },
      { year: 2021, carbon: 6000, countryName: "Armenia" }
    ];

    footprintApiStub.resolves(countriesMock);
    fetchDataStub.resolves(dataMock);

    const testPromise = seedsController.prepareEmissionsByCountry();
    
    await testPromise;

    assert(footprintApiStub.calledOnce);
    assert(fetchDataStub.calledTwice); // Called for each country in countriesMock
    assert(setDataStub.calledTwice);
  });

  it('should not fetch data for skipped countries', async () => {
    const countriesMock = [
      {
        "score": "3A",
        "shortName": "Armenia",
        "countryCode": "1",
        "countryName": "Armenia",
        "isoa2": "AM"
      },
      {
        "score": "3A",
        "shortName": "all",
        "countryCode": "2",
        "countryName": "all",
        "isoa2": "all"
      }
    ];
    const dataMock = [
      { year: 2020, carbon: 5000, countryName: "Afghanistan" },
      { year: 2021, carbon: 6000, countryName: "Armenia" }
    ];

    footprintApiStub.resolves(countriesMock);
    fetchDataStub.resolves(dataMock);

    const testPromise = seedsController.prepareEmissionsByCountry();
    
    // Advance the clock to resolve setTimeout in fetchData
    await clock.tickAsync(DELAY_IN_REQUESTS * (countriesMock.length - 1)); // One country is skipped
    await testPromise;

    assert(footprintApiStub.calledOnce);
    assert(fetchDataStub.calledOnce); // Only one call because one country is skipped
    assert(setDataStub.calledTwice);
  });

  it('should handle errors gracefully in prepareEmissionsByCountry', async () => {
    footprintApiStub.rejects(new Error('API error'));

    await seedsController.prepareEmissionsByCountry();

    assert(footprintApiStub.calledOnce);
    assert(fetchDataStub.notCalled);
    assert(setDataStub.notCalled);
  });

  it('should transform data correctly', () => {
    const inputData = {
      armenia: [
        { year: 2020, carbon: 5000.1234 },
        { year: 2021, carbon: 6000.5678 }
      ],
      afghanistan: [
        { year: 2020, carbon: 3000.1234 },
        { year: 2021, carbon: 4000.5678 }
      ]
    };

    const expectedOutput = {
      2020: [
        { country: 'armenia', total: 5000.1234 },
        { country: 'afghanistan', total: 3000.1234 }
      ],
      2021: [
        { country: 'armenia', total: 6000.5678 },
        { country: 'afghanistan', total: 4000.5678 }
      ]
    };

    const result = seedsHelper.transformData(inputData);
    assert.deepStrictEqual(result, expectedOutput);
  });

  it('should fetch data with rate limiting', async () => {
    fetchDataStub.resolves({ year: 2020, carbon: 5000 });

    const testPromise = seedsHelper.fetchData('AM');
    await clock.tickAsync(DELAY_IN_REQUESTS); // Advance the clock by the delay duration
    const result = await testPromise;

    assert(fetchDataStub.calledOnce);
    assert(result.year === 2020 && result.carbon === 5000);
  });

  it('should sort data by highest total', async () => {
    const inputData = {
      2020: [
        { country: 'armenia', total: 5000 },
        { country: 'afghanistan', total: 3000 }
      ],
      2021: [
        { country: 'armenia', total: 6000 },
        { country: 'afghanistan', total: 4000 }
      ]
    };

    const expectedOutput = {
      2020: [
        { country: 'armenia', total: 5000 },
        { country: 'afghanistan', total: 3000 }
      ],
      2021: [
        { country: 'armenia', total: 6000 },
        { country: 'afghanistan', total: 4000 }
      ]
    };

    const result = await seedsHelper.sortByHighestTotal(inputData);
    assert.deepStrictEqual(result, expectedOutput);
  });
});
