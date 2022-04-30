var router = require('express').Router();
const controller = require('../controllers/controller');
// Register User
router.get('/signin/:username/:token',controller.signUser);
router.post('/register/:username',controller.registerUser);
// Budget Homes
router.get('/:token/budget/:maxPrice/:minPrice',controller.findBudgetHomes);
// Sqft Homes
router.get('/:token/sqft/:minSqft',controller.findMinSqft);
// Age Homes 
router.get('/:token/age/:year',controller.findHomebyYear);

module.exports = router;