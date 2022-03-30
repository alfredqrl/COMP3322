/* =============  DO NOT MODIFY ============>> */

const { response } = require('express');
var express = require('express');
var app = express();
var session = require('express-session');

// use middleware
app.use(session({
  	secret: 'random_string_goes_here', 
	resave: false,
	saveUninitialized: true
}));

app.use(express.static('public'));

// user and course data
var user_name = ["Alice", "Bob", "Jack"];
var user_password = ["password1", "password2", "password3"];

var course_code = ["comp3322", "comp3234", "comp9602", "comp9501", "comp9301"];
var course_name = ["World Wide Web", "Compute Network", "Convex Optimization", "Machine Learning", "System Design"];
var course_year = ["1", "2", "2", "3", "3"];
var course_enrollment = new Array(course_code.length).fill("No");

/* <<============  DO NOT MODIFY ============= */


// Step 3
app.get('/', (req, res) => {
	var response;
  	if(req.session.loginName) {
		res.sendFile(__dirname + "/public/" + "courses.html");

  	}else{
    	res.sendFile(__dirname + "/public/" + "login.html");
  	}
	//res.sendFile(response);
});

// Step 4
app.post('/login_post', express.urlencoded({ extended: true }), (req, res) => {
	var name = req.body.loginName;
	var pwd = req.body.loginPassword;
	var index = user_name.indexOf(name);

	var response;
	if (index != -1 && user_password[index] == pwd){
		req.session.loginName = name;
		response = __dirname + "/public/" + "courses.html";
	}else{
		response = __dirname + "/public/" + "fail.html";
	}
	res.sendFile(response);

});


// step 5.2
app.get('/courses/get_user', (req, res) => {
	var response = req.session.loginName;
	res.send(response);
});

// step 5.3
app.get('/logout', (req, res) => {
	req.session.loginName = null;
	res.redirect("/");
});


// Step 6.2
app.get('/courses/get_courses', (req, res) => {
	var response = "";
	
	// render table header
	response +=  "<tr><th>Course Code</th>";
	response +=  "<th>Course Name</th>";
	response += "<th>Grade Year</th>";
	response += "<th>Enrolled</th></tr>";
	
	response += "<tr><td id='comp3322' draggable='true' ondragstart='drag(event)'>" + course_code[0] +"</td>";
	response += "<td>"+ course_name[0] + "</td>";
	response += "<td>"+ course_year[0] + "</td>";
	response += "<td>" + course_enrollment[0] + "</td></tr>";
	
	response += "<tr><td id='comp3234' draggable='true' ondragstart='drag(event)'>" + course_code[1] +"</td>";
	response += "<td>"+ course_name[1] + "</td>";
	response += "<td>"+ course_year[1] + "</td>";
	response += "<td>" + course_enrollment[1] + "</td></tr>";

	response += "<tr><td id='comp9602' draggable='true' ondragstart='drag(event)'>" + course_code[2] +"</td>";
	response += "<td>"+ course_name[2] + "</td>";
	response += "<td>"+ course_year[2] + "</td>";
	response += "<td>" + course_enrollment[2] + "</td></tr>";

	response += "<tr><td id='comp9501' draggable='true' ondragstart='drag(event)'>" + course_code[3] +"</td>";
	response += "<td>"+ course_name[3] + "</td>";
	response += "<td>"+ course_year[3] + "</td>";
	response += "<td>" + course_enrollment[3] + "</td></tr>";

	response += "<tr><td id='comp9301' draggable='true' ondragstart='drag(event)'>" + course_code[4] +"</td>";
	response += "<td>"+ course_name[4] + "</td>";
	response += "<td>"+ course_year[4] + "</td>";
	response += "<td>" + course_enrollment[4] + "</td></tr>";

	//response += "<tr><td>" + course_code[0] + course_name[0] + course_year[0] + course_enrollment[0] + "</td></tr>";

	res.send(response);
});


// Step 7.4
app.post('/courses/enroll', express.urlencoded({ extended: true}), (req, res) => {
	var code = req.body.code;
	console.log(code);
	var index = course_code.indexOf(code);
	var response;
	if (index != -1 && course_enrollment[index] == "No"){
		course_enrollment[index] = "Yes";
		response = "Successfully enrolled in the course " + code;
	}else{
		if (index != -1 && course_enrollment[index] == "Yes"){
			response = "You have already enrolled in this course";
		}else{
			response = "The course code doesn't exist";
		}
	} 

	res.send(response);

});


// launch the server with port 8081
var server = app.listen(8081, () => {
	var host = server.address().address
	var port = server.address().port
	console.log("lab4 app listening at http://%s:%s", host, port)
});

