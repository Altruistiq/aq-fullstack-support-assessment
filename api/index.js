import express from 'express';
import bodyParser from 'body-parser';
import rateLimit from 'express-rate-limit';
import cors from 'cors';
import landingRoutes from './routes/v1/landing.routes';
import routesV1 from './routes/v1/index';
import { shouldFetchOnRestart } from './controllers/seeds.controller';
import { ALLOWED_ORIGINS, RATE_LIMITER_OPTIONS, PORT } from './configs/vars';

const app = express();

// Refresh emissions data on restart, based on the time
shouldFetchOnRestart();

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Rate Limiter Middleware
const limiter = rateLimit(RATE_LIMITER_OPTIONS);
app.use(limiter);

// CORS Middleware for allowed domains/origins
const corsOptions = {
  origin: function (origin, callback) {
    if (ALLOWED_ORIGINS.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
};
app.use(cors(corsOptions));

// Routes for the landing page
app.use('/', landingRoutes);

// Routes for API version 1
app.use('/v1', routesV1);

const port = PORT || 5000
// Start the server and listen on port mentioned in .env or 5000
app.listen(port, () => {
  console.log(`app is listening on port ${port}`);
});
