const express = require('express');
const router = express.Router();
const Cars = require('../../models.js/agency/AgencyCars');
const RentedCars = require('../../models.js/RentedCars');
const fetchuser = require('../../middleware/fetchuser');



router.post('/car-rent', fetchuser, async (req, res) => {
  try {
    const { carId, days, starting_date } = req.body
    const car = await Cars.find({ _id: carId });
    const rentedCar = new RentedCars({ userId: req.user.id, carId: carId, sellerId: car[0].sellerId, product: car, days: days, starting_date: starting_date });
    const savedCar = await rentedCar.save();
    res.json({ success: true, savedCar });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


router.get("/get-bookings", fetchuser, async (req, res) => {
  try {
    const allBookings = await RentedCars.find({ userId: req.user.id });
    res.json(allBookings);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal server error");
  }
});


router.delete('/cancel-booking', fetchuser, async (req, res) => {
  try {
    const { bookingId } = req.body;
    await RentedCars.deleteOne({ _id: bookingId });
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = router;