//const { xml } = require("jade/lib/doctypes");

function loadNewsList(pageindex){
    document.getElementById("news").innerHTML = "";
    var searchStr = document.getElementById("searchNews").value;
    //alert(searchStr);
    //alert(searchStr);
    if (searchStr == null){
        searchStr = "";
    }
    
    var xmlhttp = new XMLHttpRequest();

    xmlhttp.onreadystatechange = function(){
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200){
            var json = JSON.parse(xmlhttp.responseText);
            // 2 onclick = loadNewsList(2)
            //set login/logout
            var loginStatus = json[json.length - 2].loginStatus;
            //console.log(json);
            document.getElementById("log").innerHTML = "";          
            var a = document.createElement("a");
            a.setAttribute("id","log_in_out");
            //alert(loginStatus);
            
            if (loginStatus == 0){
                a.setAttribute("href","/login?newsID=0");
                //a.setAttribute("id", "login");
                a.setAttribute("style","float:right");
                a.innerHTML = "Log in";

            }else if (loginStatus == 1){
                //a.onclick="logout()";
                a.setAttribute("onclick","logout()");
                //a.setAttribute("id","logout");
                a.setAttribute("style","float:right");
                a.innerHTML = "Log out";
            }           
            document.getElementById("log").appendChild(a);

            // display news in one page
            console.log(json);
            var index;
            var begin = 0;
            
            if(json[json.length - 1].totalNewsNum <= 5){
                index = json[json.length - 1].totalNewsNum;
            }else{  
                if (pageindex == 1){
                    index = 5;
                    begin = 0;
                }else{
                    begin = (pageindex - 1) * 5;
                    if (json[json.length - 1].totalNewsNum - begin <= 5){
                        index = json[json.length - 1].totalNewsNum;
                    }else if (json[json.length - 1].totalNewsNum - begin > 5){
                        index = begin + 5;
                    }
                }
            }
            
            for (let i = begin; i < index; i++){
                var a = document.createElement("a");
                a.setAttribute("id","newsHeader");
                a.setAttribute("href",`/displayNewsEntry?newsID=${json[i]._id}`);
                //a.setAttribute("style","color:black");
                a.innerHTML = `<h2>${json[i].headline}</h2>`;
                document.getElementById("news").appendChild(a);
                var time = document.createElement("p");
                time.setAttribute("id", "time");
                time.innerHTML = json[i].time.toLocaleString();
                document.getElementById("news").appendChild(time);
                var newsContent = document.createElement("p");
                newsContent.setAttribute("id", "newsContent");
                var cont = json[i].content.trim().split(" ");
                if (cont.length < 5){
                    cont = cont.join(" ");
                }else{
                    cont = cont.slice(0,5).join(" ");
                }
                //console.log(cont);
                newsContent.innerHTML = `${cont}<br>`;
                document.getElementById("news").appendChild(newsContent);
            }

            // display pages
            document.getElementById("pageindex").innerHTML = "";
            var pageNum;
            if (json[json.length - 1].totalNewsNum < 5){
                pageNum = 1;
            }else if (json[json.length - 1].totalNewsNum % 5 == 0){
                pageNum = json[json.length - 1].totalNewsNum / 5;
            }else{
                pageNum = parseInt(json[json.length - 1].totalNewsNum / 5) + 1;
            }
            for (let i = 1; i <= pageNum; i++){
                var page = document.createElement("a");
                page.setAttribute("onclick",`loadNewsList(${i})`);
                page.setAttribute("id",`pageNumber ${i}`);
                page.innerHTML = `${i} `;
                if (i == pageindex){
                    page.setAttribute("style", "font-weight:bold");
                }
                document.getElementById("pageindex").appendChild(page);
            }
        }
    }

    xmlhttp.open("GET","/retrievenewslist?page=" + pageindex + "&search=" + searchStr, true);
    xmlhttp.send();
}



function postComment(id){
    var commentInput = document.getElementById("loginBox").value;
    //alert(id);
    if (commentInput == ""){
        alert("No comment has been entered");
    }else{
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function(){
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200){
                // TODO: Display the comments to the current page
                var json = JSON.parse(xmlhttp.responseText);

                var img = document.createElement("img");
                var name1 = document.createElement("h2");
                var com = document.createElement("p");
                img.setAttribute("src",`${json[2].icon}`);
                img.setAttribute("id","image");
                name1.innerHTML = `${json[1].name}`;
                com.innerHTML = `${json[0].time}<br>${json[0].comment}`;
                com.setAttribute("id","com");
                
                document.getElementById("comments").prepend(com); 
                document.getElementById("comments").prepend(name1);
                document.getElementById("comments").prepend(img);
                
                document.getElementById("loginBox").value = "";
                
            }
        }

        xmlhttp.open("POST", "/handlePostComment", true);
        xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xmlhttp.send(`comment=${commentInput}&newsID=${id}&curTime=${Date()}`);
    }
}

function login(){
    var name = document.getElementById("userName").value;
    var password = document.getElementById("password").value;

    if (name == "" || password == ""){
        alert("Please enter username and password");
    }else{
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function(){
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200){
                var response = xmlhttp.responseText;
                if (response == "login success"){
                    document.getElementById("loginHeader").innerHTML = "<h1>You have successfully logged in</h1>";
                    document.getElementById("loginDetails").innerHTML = "";
                }else{
                    document.getElementById("loginHeader").innerHTML = `<h1>${response}</h1>`;
                }
            }
        }
        xmlhttp.open("GET", `/handleLogin?name=${name}&password=${password}`, true);
        xmlhttp.send();
    }
}

function logout(){
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function(){
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200){
            document.getElementById("log_in_out").innerHTML = "Log in";
            document.getElementById("log_in_out").href = "/login?newsID=0";
        }
    }
    xmlhttp.open("GET", "/handleLogout");
    xmlhttp.send();
}