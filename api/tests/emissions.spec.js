import assert from 'assert';
import sinon from 'sinon';
import * as redisHelper from '../helpers/redis.helper';
import * as seedsController from '../controllers/seeds.controller';
import { getEmissionsByCountry } from '../controllers/countries.controller';
import { EMISSIONS_REDIS_KEY, CACHE_DURATION, LAST_REFRESH_DATA_API_KEY } from '../configs/vars';

describe('Testing emissions controller', () => {
  let getDataStub;
  let setDataStub;
  let prepareEmissionsByCountryStub;
  let clock;
  let currentTimeProvider;

  beforeEach(() => {
    getDataStub = sinon.stub(redisHelper, 'getData');
    setDataStub = sinon.stub(redisHelper, 'setData');
    prepareEmissionsByCountryStub = sinon.stub(seedsController, 'prepareEmissionsByCountry');
    clock = sinon.useFakeTimers();
    currentTimeProvider = () => clock.now;
  });

  afterEach(() => {
    sinon.restore();
    clock.restore();
  });

  it('should return emissions data if available in cache', async () => {
    const mockData = { country: 'USA', emissions: 5000 };
    getDataStub.withArgs(EMISSIONS_REDIS_KEY).resolves(mockData);

    const req = {};
    const res = {
      json: sinon.spy(),
    };

    await getEmissionsByCountry(req, res, currentTimeProvider);

    assert(res.json.calledWith({ data: mockData, message: 'Emissions per country retrieved successfully!' }));
  });

  it('should prepare emissions data if not available in cache and no recent fetch', async () => {
    getDataStub.withArgs(EMISSIONS_REDIS_KEY).resolves(null);
    getDataStub.withArgs(LAST_REFRESH_DATA_API_KEY).resolves(null);

    const req = {};
    const res = {
      json: sinon.spy(),
    };

    await getEmissionsByCountry(req, res, currentTimeProvider);

    assert(prepareEmissionsByCountryStub.calledOnce);
    assert(setDataStub.calledWith(LAST_REFRESH_DATA_API_KEY, sinon.match.number));
    assert(res.json.calledWith({ message: 'Emissions data will be ready soon, check back later!' }));
  });

  it('should handle errors gracefully', async () => {
    getDataStub.withArgs(EMISSIONS_REDIS_KEY).throws(new Error('Redis error'));

    const req = {};
    const res = {
      status: sinon.stub().returnsThis(),
      send: sinon.spy(),
    };

    await getEmissionsByCountry(req, res, currentTimeProvider);

    assert(res.status.calledWith(500));
    assert(res.send.calledWith('Internal Server Error'));
  });
});
