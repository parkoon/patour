const express = require('express');
const tourController = require('../controllers/tourController');
const router = express.Router();

router
  .route('/:id')
  .delete(tourController.deleteTour)
  .get(tourController.getTour)
  .patch(tourController.udpateTour);
router.route('/').post(tourController.createTour).get(tourController.getTours);

module.exports = router;
