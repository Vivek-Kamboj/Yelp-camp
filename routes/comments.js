var express=require("express");
var Router=express.Router({mergeParams:true});
var campground =require("../models/campground.js");
var Comment =require("../models/comment.js");
var middleware = require("../middleware");

Router.get("/new",middleware.isLoggedIn,function(req,res){
	campground.findById(req.params.id,function(err,campground){
		if(err)
		{
			req.flash("error","Something went wrong...");
			console.log(err)
		}
		else
		{
			res.render("comments/new",{campground:campground});
		}
	})
	
})

Router.post("/",middleware.isLoggedIn,function(req,res){
	campground.findById(req.params.id,function(err,campground){
		if(err)
		{
			req.flash("error","campground not found...");
			console.log(err);
			res.redirect("/campgrounds");
		}
		else
		{



			Comment.create(req.body.comment,function(err,comm){
				if(err)
				{
					req.flash("error","something went wrong");
					console.log(err)
				}
				else
				{
					comm.author.id=req.user._id;
					comm.author.username=req.user.username;
					comm.save();
					campground.comments.push(comm);
					campground.save();
					res.redirect("/campgrounds/"+campground._id);
				}
			})

		}
	})
})


Router.get("/:comment_id/edit",middleware.CheckCommentOwnerShip,function(req,res){
	Comment.findById(req.params.comment_id,function(err,comment){
		if(err)
		{
			req.flash("error","Comment not found");
			console.log(err);
			res.redirect("back");
		}
		else
		{
			res.render("comments/edit",{campground_id:req.params.id,comment:comment});
		}
	})
	
})



Router.put("/:comment_id",middleware.CheckCommentOwnerShip,function(req,res){
	Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,comment){
		if(err)
		{
			req.flash("error","campground not found..");
			console.log(err);
			res.redirect("back");
		}
		else
		{

			res.redirect("/campgrounds/"+req.params.id);
		}
	})
	
})


Router.delete("/:comment_id",middleware.CheckCommentOwnerShip,function(req,res){
	Comment.findByIdAndRemove(req.params.comment_id,function(err){
		if(err)
		{
			req.flash("error","ERROR...");
			console.log(err);
			res.redirect("back");
		}
		else
		{
			req.flash("success","Deleted");
			res.redirect("/campgrounds/"+req.params.id);
		}
	})
	
})






module.exports=Router;