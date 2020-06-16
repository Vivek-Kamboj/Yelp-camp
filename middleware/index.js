var campground =require("../models/campground.js");
var Comment =require("../models/comment.js");

var middlewareObj={}

middlewareObj.isLoggedIn=function(req,res,next){
	if(req.isAuthenticated())
	{
		return next();
	}
	req.flash("error","Please login First...");
	res.redirect("/login");
}


middlewareObj.CheckOwnerShip=function(req,res,next)
{
	if(req.isAuthenticated())
	{
		campground.findById(req.params.id,function(err,found_campground){
			if(err)
			{
				req.flash("error","Campground not found");
				res.redirect("back");
			}
			else
			{
				if(found_campground.author.id.equals(req.user.id))
				{
					next();
				}
				else
				{
					req.flash("error","You don't have permission to do that...");
					res.redirect("back");
				}
			}
		})
	}
	else
	{
		req.flash("error","Please login...");
		res.redirect("back");
	}
}


middlewareObj.CheckCommentOwnerShip=function(req,res,next)
{
	if(req.isAuthenticated())
	{
		Comment.findById(req.params.comment_id,function(err,found_comment){
			if(err)
			{
				req.flash("error","error");
				res.redirect("back");
			}
			else
			{
				if(found_comment.author.id.equals(req.user.id))
				{
					next();
				}
				else
				{
					req.flash("error","Permission denied...");
					res.redirect("back");
				}
			}
		})
	}
	else
	{
		req.flash("error","Please login...");
		res.redirect("back");
	}
}


module.exports=middlewareObj;