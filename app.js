var bodyParser = require("body-parser"), 
methodOverride = require("method-override"),
mongoose      = require("mongoose"),
express       = require("express"),
app           =express(),
ejsLint = require('ejs-lint');


//APP CONFIG
mongoose.connect("mongodb://localhost/restful_poll_app");
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.use(methodOverride("_method"));


//MONGOSE/MODEL CONFIG
var pollSchema=new mongoose.Schema({
    question : String,
    image: String,
    optiona:{type:String, required:true},
    optionb:{type:String ,required:true},
    optionc:String,
    created: {type: Date, default: Date.now()},
    author: {type: String, default:"anonymous"},
    votesa:{type: Number, default:0},
    votesb:{type: Number, default:0},
    votesc:{type: Number, default:0}
    });
var Poll=mongoose.model("poll",pollSchema);

// Poll.create({
//     question:'Test quiestion',
//     image:'http://via.placeholder.com/350x150',
//     optiona:'2',
//     optionb:'2',
//     optionc:'2',
// });

//RESTFUL ROUTES
app.get("/",function(req,res){
    
    res.redirect("/polls");
});
//INDEX ROUTE
app.get("/polls",function(req,res){
    
    Poll.find({},function(err,polls){
        // console.log(polls);
        if(err){
            console.log(err);
        }else{
             res.render("index",{polls:polls});
        }
    });
});
//NEW ROUTE
app.get("/polls/new",function(req, res) {
    
    res.render('new');
});
//CREATE ROUTE
app.post("/polls",function(req,res){
    //CREATE NEW poll
   
    Poll.create(req.body.poll,function(err, newpoll) {
        // body..
        if(err){
            res.render("new");
        }else{
                //REDIRECT TO THE INDEX
            res.redirect("/polls/"+newpoll.id);
        }
    });

});
 //<!--<a href="/<%=poll._id%>/edit" class="ui black basic button">Edit</a>-->
//SHOW ROUTE
// app.get("/:id",function(req, res) {
//     console.log(req.params.id);
//     Poll.findById(req.params.id,function(err, foundpoll){
        
//       if(err){
//           res.redirect("/");
//       }else{
//           res.render("show",{poll:foundpoll});
//       }
//     });
// });
app.get("/polls/:id",function(req, res) {
    Poll.findById(req.params.id,function(err,found){
        if(err){
            res.redirect('/');
        }else{
            res.render('show',{found:found});
        }
    });
});
//EDIT ROUTE
app.get("/polls/:id/edit",function(req, res) {
    Poll.findById(req.params.id,function(err,foundpoll){
        if(err){
            res.redirect("/");
        }
        else{
         res.render("edit",{poll:foundpoll});
            
        }
    });
});
//UPDATE ROUTE
app.put("/polls/:id",function (req,res) {
    Poll.findByIdAndUpdate(req.params.id,req.body.poll,function(err,updatedpoll){
        if(err){
            res.redirect("/");
        }else{
            res.redirect("/polls/"+req.params.id);
        }
    });
});
//DELETE ROUTE
app.delete("/polls/:id",function(req,res){
   //DESTROY poll
   Poll.findByIdAndRemove(req.params.id,function(err) {
       if(err){
           res.redirect("/");
       }else{
           res.redirect("/polls");

       }
   });
});
//POST TO AN SPECIFIC ID ROUTE
var a=0;
var b=0;
var c=0;
app.post("/polls/:id",function(req,res){
    
   if(req.body.poll.ans==='a'){
       a++;
   } else if(req.body.poll.ans==='b'){
       b++;
   }else if(req.body.poll.ans==='c'){
       c++;}
    res.redirect('/polls/'+req.params.id+"/results");
});
//GET INDIVIDUAL RESULTS ROUTE
app.get('/polls/:id/results',function(req, res) {
    Poll.findById(req.params.id,function(err, foundpoll) {
            console.log(a);
            console.log(b);
            console.log(c);
            
            res.render('individual',{found:foundpoll,a:a,b:b,c:c});
        }
)});
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server started");
});

