var express=require("express");
var Router=express.Router();
var passport =require("passport");
var User =require("../models/user.js");

Router.get("/",function(req,res)
{
	res.render("landing");
})




Router.get("/register",function(req,res){
	res.render("register")
})

Router.post("/register",function(req,res){
	var newUser=new User({username:req.body.username});
	User.register(newUser,req.body.password,function(err,user){
		if(err)
		{
			req.flash("error","Please login...");
			console.log(err);
			return res.redirect("/register");
		}
		passport.authenticate("local")(req,res,function(){
			res.redirect("/campgrounds");
		})
	})

})

Router.get("/login",function(req,res){
	res.render("login");
})

Router.post("/login",passport.authenticate("local",
	{
		successRedirect:"/campgrounds",
		failureRedirect:"/login"
	}),function(req,res){
	
})

Router.get("/logout",function(req,res){
	req.logout();
	res.redirect("/campgrounds");
})


function isLoggedIn(req,res,next){
	if(req.isAuthenticated())
	{
		return next();
	}
	res.redirect("/login");
}

module.exports=Router;