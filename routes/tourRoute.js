const express = require('express');
const tourController = require('../controllers/tourController');

const router = express.Router();

// router.param('id', tourController.checkId);

router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getTours);

router.route('/stats').get(tourController.getTourStats);

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
