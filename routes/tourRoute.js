const express = require('express');
const tourController = require('../controllers/tourController');

const router = express.Router();

// router.param('id', tourController.checkId);

router
  .route('/:id')
  .delete(tourController.deleteTour)
  .get(tourController.getTour)
  .patch(tourController.udpateTour);
router
  .route('/')
  .get(tourController.getTours)
  // .post(tourController.checkBody, tourController.createTour);
  .post(tourController.createTour);

module.exports = router;
