const express = require("express");
const router = express.Router();
const middleware = require("../middleware");
const City = require("../models/cityModel");

// CLOUDINARY AND MULTER SETUP
const dotenv = require('dotenv').config();
const multer = require('multer');
const cloudinary = require('cloudinary');
let storage = multer.diskStorage({
  filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});
let imageFilter = function (req, file, cb) {
    if(!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};
let upload = multer({ storage: storage, fileFilter: imageFilter})
cloudinary.config({ 
  cloud_name: 'wanderlustoria', 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// INDEX ROUTE
router.get('/', function(req, res){
    let perPage = 9;
    let pageQuery = parseInt(req.query.page);
    let pageNumber = pageQuery ? pageQuery : 1;
    let noMatch = null;

    if(req.query.search) {
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        City.find({name: regex})
        .skip((perPage * pageNumber) - perPage)
        .limit(perPage)
        .exec(function(err, allCities){
            City.count({name: regex}).exec(function(err, count){
                if(err){
                    req.flash("error", err.message);
                    res.redirect("back");
                }
                else{
                    if(allCities.length === 0){
                        noMatch = "No matches found."
                    }
                    res.render("citiesIndex", {
                        cities: allCities, 
                        noMatch: noMatch,
                        current: pageNumber,
                        pages: Math.ceil(count / perPage),
                        search: req.query.search,
                    });
                }
            })
        })
    }
    else{
        City.find({})
        .skip((perPage * pageNumber) - perPage)
        .limit(perPage)
        .exec(function(err, allCities){
            City.count().exec(function(err, count){
                if(err){
                    req.flash("error", err.message);
                    res.redirect("back");
                }
                else{
                    res.render("citiesIndex", {
                        cities: allCities, 
                        current: pageNumber, 
                        pages: Math.ceil(count / perPage), 
                        noMatch: null,
                        search: false,
                    });
                }
            });
        });
    }
});

// NEW ROUTE
router.get('/new', middleware.isAdminAccount, function(req, res){
    res.render("citiesNew");
});

// CREATE ROUTE
router.post('/', middleware.isAdminAccount, upload.single('image'), function(req, res){
    cloudinary.v2.uploader.upload(req.file.path, function(err, result){
        if(err){
            req.flash("err", err.message);
            return res.redirect('back');
        }
        req.body.city.name = req.sanitize(req.body.city.name);
        req.body.city.country = req.sanitize(req.body.city.country);
        req.body.city.tagline = req.sanitize(req.body.city.tagline);
        req.body.city.description = req.sanitize(req.body.city.description);
        req.body.city.image = result.secure_url;
        req.body.city.imageId = result.public_id;
        req.body.city.author = {
            id: req.user._id,
            username: req.sanitize(req.user.username)
        };
        City.create(req.body.city, function(err, newCity){
            if(err){
                req.flash("error", err.message);
                return res.redirect("back");
            } 
            else{
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
        } 
        else{
            res.render("citiesShow", {city: foundCity});
        }
    });
  });

// EDIT ROUTE
router.get("/:cityId/edit", middleware.isAdminAccount, function(req, res){
    City.findById(req.params.cityId, function(err, foundCity){
        if(err){
            console.log(err);
        } 
        else{
            res.render("citiesEdit", {city: foundCity});
        }
    });
});

// UPDATE ROUTE
router.put("/:cityId", middleware.isAdminAccount, upload.single('image'), function(req, res){    
    City.findById(req.params.cityId, async function(err, foundCity){
        if(err){
            req.flash("error", err.message);
            return res.redirect("back");
        } 
        else{
            if(req.file){
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
            foundCity.tagline = req.sanitize(req.body.city.tagline);
            foundCity.description = req.sanitize(req.body.city.description);
            foundCity.save();
            req.flash("success", "City updated");
            res.redirect("/cities/" + req.params.cityId);
        }
    });
});

// DESTROY ROUTE
router.delete("/:cityId", middleware.isAdminAccount, function(req, res){
    City.findById(req.params.cityId, async function (err, foundCity){
        if(err){
            req.flash("error", err.message);
            res.redirect("back");
        } 
        try{
            cloudinary.v2.uploader.destroy(foundCity.imageId);
            foundCity.remove();
            req.flash("success", "City deleted");
            res.redirect("/cities");
        }
        catch(err){
            req.flash("error", err.message);
            res.redirect("back");
        }
    });
});

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

module.exports = router;