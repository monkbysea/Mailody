const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', (req, res) => {
  res.render('recipient', { title: 'Mailody - Listen to your postcards' });
  console.log('Recipient Page');
});

module.exports = router;
