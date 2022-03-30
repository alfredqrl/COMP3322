/* 
 * A global cache for hidden elements. It should store objects like:
 *
 *      var hidden_element = {
 *          "element": the HTML element object
 *          "display": the original display value
 *      }
 *
 * The stored values will be used in displayHiddenElements to "unhide" the HTML elements
 */
var hidden_elements = []


// Step 5. call hideContents when the page is loaded
function hideContents(){
    //alert(".....");
    
    // elements is an array of objects of HTML elements in class "needs_login".
    var elements = Array.from(document.getElementsByClassName("needs_login"));

    // Step 7. call hideElement on each element in the array
    for (let element of elements){
        hideElement(element);
    }
    
}


function hideElement(element) {
    // Step 6.1: create an object as specified in the top of this file
    //         the original display value can be obtained as 
    //         element.style.display
    var e = {
                "element": element,
                "display": element.style.display
            }
    // Step 6.2: push the created object into the array 'hidden_elements'
    hidden_elements.push(e);
    // hide the element by setting its display style to "none"
    element.style.display = "none";
}


function displayHiddenElements() {
    // Step 8.1: set the style.display to their original value for each element in "hidden_elements"
    for (let e of hidden_elements){
        e.element.style.display = e.display;
    }
    // Step 8.2: empty "hidden_elements" 
    hidden_elements=[];
}


function login(){
    // Step 9.2. Implement the login function and link it to the onclick event of the "login button"
    let userinput = prompt("Enter password to login:");
    if (userinput == "comp3322"){
        displayHiddenElements();
    }else{
        alert("Login Failed.");
    }
}

function formValidation(){
    // Step 10. implement form validation
    f = document.getElementById("reg_name");
    w = document.getElementById("reg_date");
    if (f.value=="" || w.value==""){
        alert("Please fill in your name and consultation date!");
        return false;
    }
}