var express = require("express");
var app = express();
var swig = require("swig");


app.use("/public",express.static(__dirname+'/public'));
console.log(__dirname)
app.engine("html",swig.renderFile);
app.set("view engine","html");

swig.setDefaults({cache:false});

app.get("/",function(req,res){
	res.render("lock")
})


app.listen(8080);
console.log("start")






