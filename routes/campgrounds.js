var express=require("express");
var Router=express.Router();
var campground    =require("../models/campground.js");
var middleware = require("../middleware");

Router.get("/",function(req,res)
{
	campground.find({},function(err,allCampgrounds)
	{
		if(err)
		{
			console.log("----------->ERROR<----------");
			console.log(err);		
		}
		else
		{
			res.render("campgrounds/Index",{campgrounds:allCampgrounds});
		}
	})
	
	
})

Router.post("/",middleware.isLoggedIn,function(req,res)
{
	var name=req.body.name;
	var image=req.body.image;
	var des=req.body.description;
	var author={
		id:req.user._id,
		username:req.user.username
	}
	var newobject={name: name, image: image,description: des,author:author}
	campground.create(newobject,
		function(err,campground){
		if(err)
		{
			console.log("----------->ERROR<----------");
			console.log(err);
		}
		else
		{
			res.redirect("/campgrounds");
		}
	});
	
})

Router.get("/new",middleware.isLoggedIn,function(req,res){
	res.render("campgrounds/new");
});
Router.get("/:id",function(req,res){
	campground.findById(req.params.id).populate("comments").exec(function(err,found_campground){
		if(err)
		{
			console.log("----------->ERROR<-------------");
			console.log(err);
		}
		else
		{
			res.render("campgrounds/show",{campground:found_campground});
		}
	})
});


Router.get("/:id/edit",middleware.CheckOwnerShip,function(req,res){
	campground.findById(req.params.id,function(err,found_campground){
		if(err)
		{
			console.log("----------->ERROR<-------------");
			console.log(err);
			res.redirect("/campgrounds");
		}
		else
		{
			res.render("campgrounds/edit",{campground:found_campground});		
		}
	})
	
})

Router.put("/:id",middleware.CheckOwnerShip,function(req,res){

	var name=req.body.name;
	var image=req.body.image;
	var des=req.body.description;
	
	var newobject={name: name, image: image,description: des}
	campground.findByIdAndUpdate(req.params.id,newobject,function(err,campground){
		if(err)
		{
			console.log("----------->ERROR<-------------");
			console.log(err);
			res.redirect("/campgrounds");
		}
		else
		{
			res.redirect("/campgrounds/"+req.params.id);
		}
	})
})


Router.delete("/:id",middleware.CheckOwnerShip,function(req,res){
	campground.findByIdAndRemove(req.params.id,function(err){
		if(err)
		{
			res.redirect("/campgrounds")
		}else
		{
			res.redirect("/campgrounds")
		}
	})
})


module.exports=Router;