const express = require('express');
const router = express.Router();
const AgencyCars = require('../models.js/agency/AgencyCars');


router.get("/get-all-cars", async (req, res) => {
  try {
    const allProducts = await AgencyCars.find();
    res.json(allProducts);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal server error");
  }
});


module.exports = router;