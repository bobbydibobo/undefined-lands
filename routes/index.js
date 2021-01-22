/*----------------------
BIND DEPENDENCIES
----------------------*/
const express = require('express');

/*----------------------
ROUTER
----------------------*/
const router = express.Router();

/*----------------------
ROUTES
----------------------*/
router.get('/', (req, res) => {
    res.render('welcome');
});

module.exports = router;