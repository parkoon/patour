const express = require('express');
const tourController = require('../controllers/tourController');
const authController = require('../controllers/authController');
const reviewRouter = require('./reviewRoute');

const router = express.Router();

// router.param('id', tourController.checkId);

router.use('/:tourId/reviews', reviewRouter);

router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getTours);

router.route('/stats').get(tourController.getTourStats);
router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);

router
  .route('/:id')
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.deleteTour
  )
  .get(tourController.getTour)
  .patch(tourController.udpateTour);

router
  .route('/')
  .get(tourController.getTours)
  // .post(tourController.checkBody, tourController.createTour);
  .post(tourController.createTour);

module.exports = router;
