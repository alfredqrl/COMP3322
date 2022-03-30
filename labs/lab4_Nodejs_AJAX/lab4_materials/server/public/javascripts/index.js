const { xml } = require("jade/lib/doctypes");

// Step 5.1
function init(){
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", "courses/get_user", true);
    xmlhttp.send();
    xmlhttp.onreadystatechange = function(){
        if (xmlhttp.readyState == 4 && this.status == 200){
            var nv = document.getElementById("nav_guide");
            nv.innerHTML = "Welcome" + " " + xmlhttp.responseText + " !";
            var a = document.createElement("a");
            a.setAttribute("href", "/logout");
            a.innerHTML = "Log out";
            document.getElementById("nav_guide").parentNode.appendChild(a);
        }
    }

    
    // show all courses
    showAllCourses();
}

// Step 6.1
function showAllCourses(){
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", "courses/get_courses", true);
    xmlhttp.send();
    xmlhttp.onreadystatechange = function(){
        if (xmlhttp.readyState == 4 && this.status == 200){
            var table = document.getElementById("course_table");
            table.innerHTML = xmlhttp.responseText;
        }
    }

}


function drag(ev){
    ev.dataTransfer.setData("text", ev.target.id);
}

function allowDrop(ev){
    ev.preventDefault();
}

// Step 7.2
function drop(ev){
    ev.preventDefault();
	var data = ev.dataTransfer.getData("text");
    ev.target.value = data;
}


// Step 7.3
function enrollCourse(){
    var xmlhttp = new XMLHttpRequest();
    var code = document.getElementById("enroll_course").value;
    xmlhttp.onreadystatechange = function(){
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200){
           alert(xmlhttp.responseText);
           showAllCourses(); 
        }
    }
    xmlhttp.open("POST", "courses/enroll", true);
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.send("code=" + code);
    


}