var quiz_shown = false;

// Step 4: control the video
function init() {
    document.getElementById("playButtonCanvas").addEventListener("mouseenter", playVideo);
    document.getElementById("playButtonCanvas").addEventListener("mouseleave", pauseVideo);
    setInterval(tick, 20);
    var aud = document.getElementById("lecture_video");
    aud.onended = showQuiz;
}

function pauseVideo() {
    var myVideo = document.getElementById("lecture_video");
    myVideo.pause();
}

function playVideo() {
    var myVideo = document.getElementById("lecture_video");
    myVideo.play();
}

// Step 5: Draw the play button

function colorGradient(percentage) {
    var start_rgb = [236, 47, 75]
    var end_rgb = [0, 255, 181]
    var result_rgb = []
    for(var i=0; i<3; i++) {
        result_rgb.push(start_rgb[i]*(1-percentage) + end_rgb[i]*percentage)
    }
    return "rgb("+ result_rgb[0] + "," + result_rgb[1] + "," + result_rgb[2]+")"
}

function drawArc(color, percentage) {
    var c = document.getElementById("playButtonCanvas");
    var ctx = c.getContext("2d");
    ctx.beginPath();
    
    ctx.arc(50, 50, 40, 0, 2*percentage*Math.PI);
    ctx.lineWidth = 20;
    ctx.strokeStyle = color;
    ctx.stroke();
}

function tick() {
    var vid = document.getElementById("lecture_video");
    var currentPercentage = vid.currentTime / vid.duration;
    drawArc("#AAAAAA", 1);
    drawArc(colorGradient(currentPercentage), currentPercentage);
}

// Step 6: call the showQuiz function on video finish


function drawArc(color, percentage) {
    var c = document.getElementById("playButtonCanvas");
    var ctx = c.getContext("2d");
    ctx.beginPath();
    
    ctx.arc(50, 50, 40, 0, 2*percentage*Math.PI);
    ctx.lineWidth = 20;
    ctx.strokeStyle = color;
    ctx.stroke();
}

function tick() {
    var vid = document.getElementById("lecture_video");
    var currentPercentage = vid.currentTime / vid.duration;
    drawArc("#AAAAAA", 1);
    drawArc(colorGradient(currentPercentage), currentPercentage);
}

// Step 6: call the showQuiz function on video finish


function showQuiz() {
    if (!quiz_shown) {
        // Step 7: create the quiz
		//alert("already called")
		var section = document.getElementById("contents");

        var h2 = document.createElement("h2");
        h2.setAttribute("id", "quiz_heading");
        h2.innerHTML = "Quiz Time";
        section.appendChild(h2);

        var p = document.createElement("p");
        p.setAttribute("id", "quiz_question");
        p.innerHTML = "Enter the result of evaluating the following expression."
        section.appendChild(p);

        var div = document.createElement("div");
        div.setAttribute("id", "quiz_container");
        section.appendChild(div);

        var p2 = document.createElement("p");
        p2.innerHTML = "\'1\' - \'1\'";
        div.appendChild(p2);

        var input = document.createElement("input");
        input.setAttribute("type", "text");
        input.setAttribute("id", "quiz_answer");
        div.appendChild(input);

        var button = document.createElement("button");
        button.innerHTML = "Check answer";
        button.addEventListener("click", checkQuizAnswer);
        div.appendChild(button);

        quiz_shown = true;
    }
};


// Step 8: check if the answer is correct. If so, remove the quiz container and 
//         change the display texts of the created <h2> heading and quiz description <p>
function checkQuizAnswer() {
    var f = document.getElementById("quiz_answer");
    var section = document.getElementById("contents");
    var div = document.getElementById("quiz_container");
    var h2 = document.getElementById("quiz_heading");
    var p = document.getElementById("quiz_question");
    if (f.value == 0){
        section.removeChild(div);
        h2.innerHTML = "Quiz finished! Congratulations!";
        p.innerHTML = "Please proceed to study the next chapter.";
    }
}