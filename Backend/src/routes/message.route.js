const express = require('express');

const router = express.Router();

router.get('/send', (req, res) => {
    res.send('Send Messages endpoint');
});

module.exports = router;