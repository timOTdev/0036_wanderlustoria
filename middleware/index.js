const Story = require("../models/storyModel")
const Comment = require("../models/commentModel")

let middlewareObj = {};

middlewareObj.checkStoryOwner = function(req, res, next){
  if(req.isAuthenticated()){
    Story.findById(req.params.storyId, function(err, foundStory){
      if(err){
        res.redirect("back");
      }else{
        if(foundStory.author.id.equals(req.user._id)){
          next();
        }else{
          res.redirect("back");
        }
      }
    })
  }else{
    res.redirect("back");
  }
}

middlewareObj.isLoggedIn = function(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect("/login");
}

module.exports = middlewareObj;