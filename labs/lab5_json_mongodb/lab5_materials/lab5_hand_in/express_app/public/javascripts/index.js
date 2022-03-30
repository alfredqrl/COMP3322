//const res = require("express/lib/response");
//const { xml } = require("jade/lib/doctypes");

// step 4.1
function findAllDocs() {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", "get_scores", true);
    xmlhttp.send();

    xmlhttp.onreadystatechange = function(){
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200){
            var table = document.getElementById("scores_table");
            table.innerHTML = xmlhttp.responseText;
        }
    }
    console.log(1);

    calStatistics();
}

// step 4.2
function findDocsByUID(){
    var xmlhttp = new XMLHttpRequest();
    var findVal = document.getElementById("find_input").value;
    xmlhttp.open("GET", "/get_scores?find=" + findVal, true);
    xmlhttp.send();

    xmlhttp.onreadystatechange = function(){
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200){
            var table = document.getElementById("scores_table");
            table.innerHTML = xmlhttp.responseText;
        }
    }


}

// step 5.1
function calStatistics(){
    var statistics = document.getElementById("statistics");
    while (statistics.firstChild) {
        statistics.firstChild.remove()
    }

    var xmlhttp = new XMLHttpRequest();
    

    xmlhttp.onreadystatechange = function(){
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200){
            var json = JSON.parse(xmlhttp.responseText);
            console.log(json.length);
            for (i = 0; i < json.length; i++){
                var doc = json[i];
                var p = document.createElement("p");
                var score = doc.avg_score.toFixed(2);
                p.innerHTML = `Average score of ${doc._id}: ${score}`;
                document.getElementById("statistics").appendChild(p);
            }
        }
    }

    xmlhttp.open("GET", "/get_statistics", true);
    xmlhttp.send();
}

// step 6.1
function updateScore(uid, exam){
    var new_score = document.getElementById(`new_score_${uid}_${exam}`).value;
	var xmlhttp = new XMLHttpRequest();		
    
    
    var json;
    json = {
        "uid": uid,
        "exam": exam,
        "new_score": new_score
    }
    json = JSON.stringify(json);
    

    xmlhttp.onreadystatechange = function(){
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200){
            alert(xmlhttp.responseText);
            // refresh the table

            findAllDocs();
        }
    }
    
    xmlhttp.open("POST", "update_score", true);
    xmlhttp.setRequestHeader("Content-type", "application/json");
    xmlhttp.send(json);
}

