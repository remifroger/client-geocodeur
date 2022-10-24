const express = require('express')
const router = express.Router()
const nodemailer = require('nodemailer')
const { config } = require('../../middlewares/config.js')
const Geocoding = require('../../controllers/geocodingCtrl')

router.get("/startGeocoding", Geocoding.start)
router.post("/uploadCsv", Geocoding.upload)

module.exports = router