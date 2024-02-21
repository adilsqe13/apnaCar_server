require('dotenv').config();
const express = require('express');
const router = express.Router();
const AgencyCars = require('../../models.js/agency/AgencyCars');
const RentedCars = require('../../models.js/RentedCars');
const fetchagency = require('../../middleware/fetchagency');
const cloudinary = require('cloudinary').v2;


router.put("/update-car", fetchagency, async (req, res) => {
  try {
    const { carId, vehicle_model, vehicle_number, rent, seating_capacity, public_id, imageUrl } = req.body;
    if (imageUrl !== undefined) {
      await AgencyCars.updateOne({ _id: carId }, { $set: { vehicle_model: vehicle_model, vehicle_number: vehicle_number, seating_capacity: seating_capacity, rent: rent, image: imageUrl, public_id: public_id } });
      const rentedCar = await RentedCars.findOne({ carId: carId });
      console.log(rentedCar);
      if (rentedCar) {
        const car = rentedCar.product[0];
        car.vehicle_model = vehicle_model;
        car.vehicle_number = vehicle_number;
        car.seating_capacity = seating_capacity;
        car.rent = rent;
        car.public_id = public_id;
        car.image = imageUrl;
        await RentedCars.updateOne({ carId: carId }, { $set: { product: [car] } });
      }
      res.json({ success: true });
    } else {
      await AgencyCars.updateOne({ _id: carId }, { $set: { vehicle_model: vehicle_model, vehicle_number: vehicle_number, seating_capacity: seating_capacity, rent: rent } });
      const rentedCar = await RentedCars.findOne({ carId: carId });
      if (rentedCar) {
        const car = rentedCar.product[0];
        car.vehicle_model = vehicle_model;
        car.vehicle_number = vehicle_number;
        car.seating_capacity = seating_capacity;
        car.rent = rent;
        await RentedCars.updateOne({ carId: carId }, { $set: { product: [car] } });
      }
      res.json({ success: true });
    }

  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal server error");
  }
})


router.post('/add-product', fetchagency, async (req, res) => {
  try {
    const { vehicle_model, vehicle_number, seating_capacity, rent, imageUrl, public_id, agencyName } = req.body
    const product = new AgencyCars({
      image: imageUrl, public_id, vehicle_model, vehicle_number, seating_capacity, rent, sellerId: req.seller.id, agencyName: agencyName
    })
    const saveProduct = await product.save()
    res.json({ success: true, saveProduct });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


router.get("/get-orders", fetchagency, async (req, res) => {
  try {
    const allOrders = await RentedCars.find({ sellerId: req.seller.id });
    res.json(allOrders);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal server error");
  }
});


router.get("/get-my-cars", fetchagency, async (req, res) => {
  try {
    const myCars = await AgencyCars.find({ sellerId: req.seller.id });
    res.json(myCars);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal server error");
  }
});



router.delete("/delete-car", fetchagency, async (req, res) => {
  try {
    const { carId } = req.body;
    const public_id = (await AgencyCars.findOne({ _id: carId })).public_id;
    cloudinary.config({
      cloud_name: process.env.CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET
    });
    await AgencyCars.deleteOne({ _id: carId });
    await RentedCars.deleteOne({ carId: carId });
    await cloudinary.uploader.destroy(public_id);
    res.json({ success: true });
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal server error");
  }
});



router.put('/order-confirm', fetchagency, async (req, res) => {
  try {
    const { orderId } = req.body
    await RentedCars.updateOne({ _id: orderId }, { $set: { order_status: 'Confirmed' } });
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});



router.get('/car-details/:carId', fetchagency, async (req, res) => {
  try {
    const carId = req.params.carId;
    const carDetails = await AgencyCars.find({ _id: carId });
    res.json(carDetails);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


module.exports = router;