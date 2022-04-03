var express = require('express');
var router = express.Router();


// step 7.1
router.get('/get_courses', (req, res) => { 
	var db = req.db;
    var col = db.get("courseList");

    col.find({}).then((docx)=>{
        res.json(docx);
    })

});

// step 8.1
router.delete('/delete_course/:id', (req, res) => {
    var db = req.db;
    var col = db.get("courseList");
    console.log(req.params.id);
    var courseID = req.params.id;
    col.remove({"_id":courseID}, function(err, result){
        if (err == null){
            res.send("Successfully deleted");
        }else{
            res.send(err);
        }
    })

});

// step 9.1
router.put('/update_course/:id', (req, res) => {
    





});

// step 10.1
router.post('/add_course', (req, res) => {
    


    
});


module.exports = router;