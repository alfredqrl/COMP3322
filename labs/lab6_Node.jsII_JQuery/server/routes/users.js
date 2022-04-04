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
    var db = req.db;
    var col = db.get("courseList");
    //console.log(req.params.id.length);
    col.update({"_id": req.params.id},
        {$set:{
            'name': req.body.name,
            'credit': req.body.credit,
            'semester': req.body.semester}
        }, function(err, result){
            if (err == null){
                res.json({msg: "Successfully updated!"});
            }else{
                res.json({msg: err});
            }
    })
});

// step 10.1
router.post('/add_course', (req, res) => {
    var db = req.db;
    var col = db.get("courseList");
    col.insert(req.body, function(err, result){
        if (err == null){
            res.json({msg: "Successfully added!"});
        }else{
            res.json({msg: err});
        }
    })
});


module.exports = router;