var express       =require("express"),
	app           =express(),
	bodyParser    =require("body-parser"),
	mongoose      =require("mongoose"),
	passport      =require("passport"),
	localStrategy =require("passport-local"),
	methodOverride=require("method-override"),
	flash		  =require("connect-flash"),
	seedDB        =require("./seeds"),
	campground    =require("./models/campground.js"),
	User          =require("./models/user.js"),
	Comment       =require("./models/comment.js");



var indexRoutes      = require("./routes/index"),
	campgroundRoutes = require("./routes/campgrounds"),
	commentRoutes    = require("./routes/comments");


mongoose.connect("mongodb://localhost/yelp_camp");


//seedDB();


app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(__dirname+"/public"));
app.use(methodOverride("_method"));
app.use(flash());


app.set("view engine","ejs")

//for passport config
app.use(require("express-session")({
	secret: "hi, its vivek... making some stuff--",
	resave: false,
	saveUninitialized: false
}))
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
	res.locals.currentUser=req.user;
	res.locals.error=req.flash("error");
	res.locals.success=req.flash("success");
	next();
})


//==================
//Routes
//==================


app.use(indexRoutes);
app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);
app.get("*",function(req,res){
	res.send("404");
})



app.listen(2500,function()
{
	console.log("Server started!!");
})