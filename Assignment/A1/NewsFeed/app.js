var express = require('express');
const { json } = require('express/lib/response');
var app = express();
var cookieParser = require('cookie-parser');

app.use(express.json());
app.use(cookieParser());

var monk = require('monk');
var db = monk('127.0.0.1:27017/a1-db');

app.use(express.static('public'), function (req, res, next) {
    req.db = db;
    next();
})

/*
// use middleware
app.use(session({
  secret: 'random_string_goes_here', 
resave: false,
saveUninitialized: true
}));
*/



app.get('/', function (req, res) {
    res.sendFile(__dirname + "/public/" + "newsfeed.html");
})

app.get('/retrievenewslist', function (req, res) {
    //console.log(req.query.page);
    //console.log(req.query.search);
    var db = req.db;
    var col = db.get("newsList");
    var loginStatus;
    var json;

    // test for cookie
    //console.log(req.cookies.userID);
    if (req.cookies.userID){
        loginStatus = 1;
    }else{
        loginStatus = 0;
    }    

    col.find({headline:{$regex : req.query.search}}, {sort:{time:-1}}).then((docx)=>{
        json = docx;
        //console.log(json);
        // [{news1}, {new2}, …, {status: xxx}, {num: xx}]

        
        
        json.push({"loginStatus":loginStatus});
        //json.push({"totalNum":col.count({headline:{$regex : req.query.search}})});
        col.count({headline:{$regex : req.query.search}}).then((docx)=>{
            json.push({"totalNewsNum": docx});
            //console.log(json);
            res.send(json);
        })
    })   
})

app.get('/displayNewsEntry', function(req, res){
    var newsID = req.query.newsID;
    var db = req.db;
    var col = db.get("newsList");
    var col2 = db.get("userList");
    var json;
    var loginStatus;
    if (req.cookies.userID){
        loginStatus = 1;
    }else{
        loginStatus = 0;
    }

    col.find({_id:monk.id(newsID)}).then((docx)=>{
        json = docx;
        //console.log(docx);
        //console.log(newsID);
        var headline = json[0].headline;
        var timeOfNews = json[0].time;
        var content = json[0].content;
        var jsonUser;
        
        var userIDMakeComment = [];      // _id of the user
        var userNameMakeComment = [];    // name of the user
        var userPasswordMakeComment = [];// password of the user
        var userIconMakeComment = [];    // icon of the user
        var timeMakeComment = [];
        var commentDetails = [];
        var htmlNewsPage = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta http-equiv="X-UA-Compatible" content="IE=edge">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <script src="javascripts/script.js"></script>
                <link rel="stylesheet" href="stylesheets/style.css">
                <title>NewsFeed</title>
            </head>
            <div id="NewsTitle">
                <button id="backToFirstPage" onclick="window.location.href='/newsfeed.html'" style="float:left">
                    <-
                </button>
                <h1> ${headline} </h1>
                <p> ${timeOfNews} </p>
            </div>

            <div id = "newsContents">
                <p> ${content} </p><br><br><br>
            </div>

            <div id="comments">
                
            </div>

            <div id="postComment">
                <script>
                    var loginBox = document.createElement("input");
                    loginBox.setAttribute("type","text");
                    loginBox.setAttribute("id","loginBox");
                    var button = document.createElement("button");
                    button.setAttribute("id","log");
                    button.setAttribute("type","button");
                    var loginStatus = ${loginStatus};
                    if (loginStatus == 1){
                        loginBox.setAttribute("enabled","");
                        button.setAttribute("onclick","postComment('${newsID}')");
                        button.innerHTML = "post comment";
                    }else{
                        loginBox.setAttribute("disabled","");
                        button.innerHTML = "login to comment";
                        button.setAttribute("onclick", "window.location.href='/login?newsID=${newsID}'");
                    }
                    document.getElementById("postComment").appendChild(loginBox);
                    document.getElementById("postComment").appendChild(button);
                </script>
            </div>
            
        `;

        if(json[0].comments != ''){
            col.aggregate([
                {
                    $match:{
                        _id: monk.id(newsID)
                    }
                },
                {                  
                    $lookup:
                        {
                            from: "userList",
                            localField: "comments.userID",
                            foreignField: "_id",
                            as: "info"
                        }
                }
            ]).then((docx)=>{
                //console.log(docx[0].info);
                jsonUser = docx;
                //console.log(jsonUser[0].comments);
                jsonUser[0].comments.sort(function(a,b){
                    return a.time - b.time;
                })
                
                for (var i = jsonUser[0].comments.length-1; i >= 0; i--){
                    timeMakeComment.push(docx[0].comments[i].time.toLocaleString());
                    commentDetails.push(docx[0].comments[i].comment);
                    //console.log()
                    for (var j = 0; j < jsonUser[0].info.length; j++){
                        //console.log(jsonUser[0].comments[i].userID);
                        //console.log(jsonUser[0].info[j]._id);
                        //console.log()
                        if (jsonUser[0].comments[i].userID.toString() == jsonUser[0].info[j]._id.toString()){
                            //console.log("true");
                            userIDMakeComment.push(jsonUser[0].info[j]._id);
                            userNameMakeComment.push(jsonUser[0].info[j].name);
                            userPasswordMakeComment.push(jsonUser[0].info[j].password);
                            userIconMakeComment.push(jsonUser[0].info[j].icon);
                        }else{
                            //console.log("false");
                        }
                    }
                }
                //console.log(userIDMakeComment);
                //console.log(commentDetails.length);
                for (var j = 0; j < timeMakeComment.length; j++){
                    htmlNewsPage = htmlNewsPage + `                 
                    <script>
                        var img = document.createElement("img");
                        var name1 = document.createElement("h2");
                        var com = document.createElement("p");
                        img.setAttribute("src","${userIconMakeComment[j]}");
                        img.setAttribute("id","image");
                        name1.innerHTML = "${userNameMakeComment[j]}";
                        com.innerHTML = "${timeMakeComment[j]}<br>${commentDetails[j]}";
                        com.setAttribute("id","com");
                        document.getElementById("comments").appendChild(img);
                        document.getElementById("comments").appendChild(name1);
                        document.getElementById("comments").appendChild(com);  
                    </script>
                    
                    `;                  
                }
                res.send(htmlNewsPage + "</html>");
            })
        }else{
            //res.send(htmlNewsPage);
            htmlNewsPage = htmlNewsPage + "</html>";
            res.send(htmlNewsPage);
            return;
        }
    })
})

app.post('/handlePostComment', express.urlencoded({ extended: true }), function(req,res){

    var comment = req.body.comment;
    var newsID = req.body.newsID;
    var time = req.body.curTime;
    var userIDPostComment = req.cookies.userID;
    var userName;
    var userIcon;
    var jsonDisplay = [];
    jsonDisplay.push({"userID":userIDPostComment, "time":time.toLocaleString(), "comment":comment});
    //console.log(userIDPostComment);
    var db = req.db;
    var col = db.get("userList");
    var col2 = db.get("newsList");

    col.find({_id:monk.id(userIDPostComment)}).then((docx)=>{
        //console.log(docx);
        userName = docx[0].name;
        userIcon = docx[0].icon;
        jsonDisplay.push({"name": userName});
        jsonDisplay.push({"icon": userIcon});
        
        res.send(jsonDisplay);

        col2.update(
            {"_id":newsID},
            {$push:
                {"comments":{
                    "userID" : monk.id(userIDPostComment),
                    "time" : time.toLocaleString(),
                    "comment" : comment
                }}
            }
        )
    })
    
})

app.get('/login', function(req,res){

    var news = req.query.newsID;
    var check = 0;
    if (news == 0){
        check = 1;
    }
    
    var htmlLoginPage =`
    
        <!DOCTYPE html>
        <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta http-equiv="X-UA-Compatible" content="IE=edge">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <script src="javascripts/script.js"></script>
                <link rel="stylesheet" href="stylesheets/style.css">
                <title>NewsFeed</title>
            </head>
            <body>

            <div id="loginHeader">
                <h1> You can log in here </h1>
            </div>

            <div id="loginDetails">
                <form>
                    User Name: <input type="text" id="userName"><br>
                    Password: <input type="text" id="password"><br>
                    <input type="button" value="Submit" onclick="login()">
                </form>
            </div>

            <div id="goBack">
                <script>
                    var a =  document.createElement("a");
                    a.innerHTML = "Go back";
                    a.setAttribute("id","goBack");
                    if (${check} == 1){
                        a.setAttribute("href","/newsfeed.html");                                              
                    }else{
                        a.setAttribute("href","/displayNewsEntry?newsID=${news}");
                    }
                    document.getElementById("goBack").appendChild(a);
                </script>
            </div>

            </body>
        </html>
    `;
    res.send(htmlLoginPage);
})

app.get("/handleLogin", function(req,res){
    var name = req.query.name;
    var password = req.query.password;
    var db = req.db;
    var col = db.get("userList");
    col.find({name:name}).then((docx)=>{
        if (docx.length == 0){
            res.send("Username is incorrect");
            return;
        }
        
        if (password == docx[0].password){
            var milliseconds = 60*1000;
            res.cookie('userID', monk.id(docx[0]._id), { maxAge: milliseconds});
            //console.log(req.cookies.userID);
            res.send("login success");
        }else{
            res.send("Password is incorrect");
        }
        
    })
})

app.get("/handleLogout", function(req,res){
    res.clearCookie('userID');
    res.send("logout success");
})


var server = app.listen(8081, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log("Example app listening at http://%s:%s", host, port);
})