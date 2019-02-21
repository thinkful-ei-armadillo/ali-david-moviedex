'use strict';
require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const MOVIEDEX = require('./movies.json');

const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(validateToken);

function validateToken(req, res, next){
  const authToken = req.get('Authorization');
  const apiToken = process.env.API_TOKEN;

  if (!authToken || authToken.split(' ')[1] !== apiToken) {
    return res.status(401).json({ error: 'Unauthorized request'});
  }
  next();
}

function handleGetMovie(req,res){
  let results = MOVIEDEX;
  const genre = req.query.genre;
  const country = req.query.country;
  const avg_vote = req.query.avg_vote;

  if(req.query.genre){
    results = results.filter((item) => item.genre.toLowerCase().includes(genre.toLowerCase()));
  }

  if(req.query.country){
    results = results.filter((item) => item.country.toLowerCase().includes(country.toLowerCase()));
  }

  if(req.query.avg_vote){
    results = results.filter((item) => Number(avg_vote) <= item.avg_vote);
  }

  res.send(results);
}

app.get('/movie', handleGetMovie);

const PORT = 8000;

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
}); 