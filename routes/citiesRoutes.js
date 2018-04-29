const express = require("express");
const router = express.Router();
const middleware = require("../middleware");
const dotenv = require('dotenv').config();
const multer = require('multer');
const City = require("../models/cityModel");

let storage = multer.diskStorage({
  filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});
let imageFilter = function (req, file, cb) {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};
let upload = multer({ storage: storage, fileFilter: imageFilter})
let cloudinary = require('cloudinary');

cloudinary.config({ 
  cloud_name: 'wanderlustoria', 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// INDEX ROUTE
router.get('/', function(req, res){
    City.find({}, function(err, allCities){
        if(err){
            console.log(err);
        } else {
            res.render("citiesIndex", {cities: allCities});
        }
    });
});

// NEW ROUTE
router.get('/new', middleware.isAdminAccount, function(req, res){
    res.render("citiesNew");
});

// CREATE ROUTE
router.post('/', middleware.isAdminAccount, upload.single('image'), function(req, res){
    cloudinary.v2.uploader.upload(req.file.path, function(err, result){
        if (err){
            req.flash("err", err.message);
            return res.redirect('back');
        }
        req.body.city.name = req.sanitize(req.body.city.name);
        req.body.city.country = req.sanitize(req.body.city.country);
        req.body.city.image = result.secure_url;
        req.body.city.imageId = result.public_id;
        req.body.city.headline = req.sanitize(req.body.city.headline);
        req.body.city.description = req.sanitize(req.body.city.description);
        req.body.city.author = {
            id: req.user._id,
            username: req.sanitize(req.user.username)
        };
        City.create(req.body.city, function(err, newCity){
            if(err){
                req.flash("error", err.message);
                res.redirect("back");
            } else {
                res.redirect("/cities");
            }
        });
    })
});

// SHOW ROUTE
router.get('/:cityId', function(req, res){
    City.findById(req.params.cityId).populate("stories").exec(function(err, foundCity){
        if(err){
            console.log(err);
        } else {
            res.render("citiesShow", {city: foundCity});
        }
    });
  });

// EDIT ROUTE
router.get("/:cityId/edit", middleware.isAdminAccount, function(req, res){
    City.findById(req.params.cityId, function(err, foundCity){
        if(err){
            console.log(err);
        } else {
            res.render("citiesEdit", {city: foundCity});
        }
    });
});

// UPDATE ROUTE
router.put("/:cityId", middleware.isAdminAccount, upload.single('image'), function(req, res){    
    City.findById(req.params.cityId, async function(err, foundCity){
        if(err){
            req.flash("error", err.message);
            res.redirect("back");
        } else {
            if (req.file) {
                try {
                    await cloudinary.v2.uploader.destroy(foundCity.imageId);
                    let result = await cloudinary.v2.uploader.upload(req.file.path);
                    foundCity.image = result.secure_url;
                    foundCity.imageId = result.public_id;
                } catch (err) {
                    req.flash("error", err.message);
                    return res.redirect("back");
                }
            }
            foundCity.name = req.sanitize(req.body.city.name);
            foundCity.country = req.sanitize(req.body.city.country);
            foundCity.headline = req.sanitize(req.body.city.headline);
            foundCity.description = req.sanitize(req.body.city.description);
            foundCity.save();
            req.flash("success", "Successfully updated");
            res.redirect("/cities/" + req.params.cityId);
        }
    });
});

// DESTROY ROUTE
router.delete("/:cityId", middleware.isAdminAccount, function(req, res){
    City.findByIdAndRemove(req.params.cityId, function(err){
        if(err){
            res.redirect("/cities");
        } else {
            res.redirect("/cities");
        }
    });
});

module.exports = router;