const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', (req, res) => {
  res.render('index', { title: 'Mailody - Listen to your postcards' });
  console.log('Index Page');
});

module.exports = router;
