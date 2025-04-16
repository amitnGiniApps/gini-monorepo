import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';

import MessageResponse from './interfaces/MessageResponse';
import gptRouter from './routes/gptRouter';

require('dotenv').config();

const app = express();

app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
app.use(express.json());

app.get<{}, MessageResponse>('/', (req, res) => {
  res.json({
    message: '🦄🌈✨👋🌎🌍🌏✨🌈🦄',
  });
});

app.use('/api/v1', gptRouter);


export default app;
