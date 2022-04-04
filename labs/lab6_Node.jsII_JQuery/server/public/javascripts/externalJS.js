/* =============  DO NOT MODIFY ============>> */

$(document).ready(function() {
    showAllCourses();
});

// store courses locally obtained from server
var courses_list = [];

// check whether input boxes are filled
function isInputFilled(){
    var checked = true;
    $('#update_form input').each(function(){
        if($(this).val() == "") 
			checked = false;
    });
    return checked;
}

/* <<=============  DO NOT MODIFY ============ */


// step 7.2
function showAllCourses(){
    var table_content = `
        <tr><th>Course Name</th>
        <th>Credit</th>
        <th>Semester</th>
        <th>Action</th>
    `;

    //$("#load")
    // Jquery source: https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js
    $.getJSON("/users/get_courses", function(courses_list){
        console.log(courses_list);
        $.each(courses_list, function(i, item){
            //console.log(this.name);
            table_content = table_content + `
                <tr>
                <td>${this.name}</td>
                <td>${this.credit}</td>
                <td>${this.semester}</td>
                <td><a href="#" class="linkDelete" rel="${this._id}">Delete</a></td>
                </tr>
            `;
        })
        $('#course_table').html(table_content);
    })
}

$("#course_table").on('click','.linkDelete', deleteCourse);

// step 8.2
function deleteCourse(event){
    event.preventDefault();
    $.ajax({
        type: "DELETE",
        url: "/users/delete_course/" + $(this).attr('rel'),
        success: function(result){
            alert(result);
            showAllCourses();
        }
    })
}


$("#submitCourse").on('click', addOrUpdateCourse);

function addOrUpdateCourse(event){
    event.preventDefault();

    if(isInputFilled()){
        var name = $("#inputName").val()
        console.log(name);
        var new_doc = {
            "name": name,
            "credit": $("#inputCredit").val(),
            "semester": $("#inputSemester").val(),
        }

		var names = courses_list.map(function(elem) { return elem.name; });
        var index = names.indexOf(name);
        console.log(names);
        console.log(name);
        console.log(courses_list);
        console.log(index);
        //console.log(courses_list[index]._id);
        if(index != -1){
            // step 9.2 course exists - do update
            $.ajax({
                type: "PUT",
                data: new_doc,
                url: `/users/update_course/${courses_list[index]._id}`,
                dataType: "JSON",
                success: function(result){
                    alert(result.msg);
                    showAllCourses();
                }
            })
        }else{
            // step 10.2 course doesn't exist - add
            $.ajax({
                type: "POST",
                data: new_doc,
                dataType: "JSON",
                url: "/users/add_course",
                success: function(result){
                    alert(result.msg);
                    showAllCourses();
                }
            })          
        }
    }else alert("Please fill in all fields.")
}