import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
const path = require('path');


import MessageResponse from './interfaces/MessageResponse';
import gptRouter from './routes/gptRouter';

require('dotenv').config();

const app = express();

app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
app.use(express.json());

app.use('/api/v2', gptRouter);


app.get('/api/v1/generate/map', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/map1.html'));
});

app.get('/api/v1/generate/map2', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/map2.html'));
});

app.get('/api/v1/generate/map3', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/map3.html'));
});

app.get('/api/v1/generate/calendar', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/calendar.html'));
});

app.get('/api/v1/generate/dashboard1', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/dashboard-1.html'));
});

app.get('/api/v1/generate/dashboard2', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/dashboard-2.html'));
});


app.get('/api/v1/generate/chat1', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/chat-conversation-1.html'));
});

app.get('/api/v1/generate/chat2', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/chat-conversation-2.html'));
});

app.get('/api/v1/generate/track', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/track.html'));
});


export default app;
