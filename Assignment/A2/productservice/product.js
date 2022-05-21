var express = require('express');
const { append } = require('express/lib/response');
const { default: monk } = require('monk');
var router = express.Router();

router.get('/loadpage', (req, res)=>{
    var categorySearch = req.query.category;
    var searchString = req.query.searchstring;

    console.log(categorySearch);
    

    var db = req.db;
    var col = db.get('productCollection');

    if (categorySearch == "all" && searchString == ""){
        col.find({}, {sort:{"name":1}},function(err, result){if (err != null){res.send(err)}}).then((docx)=>{
            res.json(docx);
        })
    }else if (categorySearch == "all" && searchString != ""){
        col.find({"name": {$regex: searchString}}, {sort:{"name":1}},function(err, result){
            if (err != null){
                res.send(err);
            }
        }).then((docx)=>{
            res.json(docx);
        });
    }else{
        col.find({"category" : categorySearch, "name": {$regex: searchString}}, {sort:{"name":1}},function(err, result){
            if (err != null){
                res.send(err);
            }
        }).then((docx)=>{
            res.json(docx);
        });
    }
});

router.get('/loadproduct/:productid', (req, res)=>{
    var id = req.params.productid;
    console.log(id);
    var db = req.db;
    var col = db.get('productCollection');
    var json = [];

    col.find({_id:monk.id(id)}, function(err, result){
        if (err != null){
            res.send(err);
        }
    }).then((docx)=>{
        json.push({"manufacturer":docx[0].manufacturer});
        json.push({"description":docx[0].description});
        res.json(docx);
    })
});

router.post('/signin', (req, res)=>{
    var username = req.body.username;
    var password1 = req.body.password;
    var json = [];

    var db = req.db;
    var col = db.get('userCollection');

    col.find({username:username}, function(err, result){
        if (err != null){
            res.send(err);
        }
    }).then((docx)=>{
        if (docx.length == 0){
            res.send('Login failure');
            return;
        }
        console.log(docx[0].password)
        console.log(password1)

        if (password1 == docx[0].password){
            console.log("true");
            var milliseconds = 60*1000;
            res.cookie('userID', monk.id(docx[0]._id), {maxAge: milliseconds});
            json.push({"totalnum":docx[0].totalnum});
            res.send(json);
        }else{
            console.log("fail")
            res.send('Login failure');
        }
    })
});

router.get('/signout', (req, res)=>{
    res.clearCookie('userID');
    res.send("");
});

router.get('/getsessioninfo', (req, res)=>{
    var db = req.db;
    var col = db.get('userCollection');
    var json = [];

    if (req.cookies.userID){
        col.find({_id:monk.id(req.cookies.userID)}, function(err, result){
            if (err != null){
                res.send(err);
            }
        }).then((docx)=>{
            json.push({"username": docx[0].username}, {"totalnum": docx[0].totalnum});
            res.send(json);
        })
    }else{
        res.send("");
    }
});

router.put('/addtocart', (req, res)=>{
    var productId = req.body.productId;
    var quantity = parseInt(req.body.quantity);
    var db = req.db;
    var col = db.get('userCollection');
    console.log("123")
    col.find({_id: monk.id(req.cookies.userID)}, function(err, result){
        if (err != null){
            res.send(err);
            return;
        }
    }).then((docx)=>{
        //console.log(docx);
        var cart = docx[0].cart;
        var totalnum = docx[0].totalnum;
        var found = false;
        for (let i = 0; i < cart.length; i++){
            console.log("1");
            var product = cart[i];
            console.log(product.productId + "  "+ productId);
            if (product.productId == productId){
                console.log("2");
                cart[i].quantity = cart[i].quantity + quantity;
                var totalnum = totalnum + quantity;
                col.update(
                    {"_id": monk.id(req.cookies.userID)},
                    {$set:{
                        "cart":cart, "totalnum":totalnum
                    }},
                    function(err, result){
                        if (err == null){
                            console.log("456");
                            res.send({"totalnum": totalnum})
                        }else{
                            console.log("789");
                            res.send({msg: err});
                        }
                    }
                )
                found = true;
            }
        }

        console.log(found);

        if (found == false){
            console.log("false");
            col.update(
                {"_id": req.cookies.userID},
                {$push:{
                    "cart": {"productId":monk.id(productId), "quantity": quantity}
                },
                $set:{"totalnum":totalnum + quantity}
            }, function(err, result){
                if (err == null){
                    console.log("234")
                    res.send({"totalnum": totalnum + quantity})
                }else{
                    console.log("567")
                    res.send({msg: err})
                }
            }
            )
        }
    })
});

router.get('/loadcart', (req, res)=>{
    var db = req.db;
    var col = db.get('userCollection');
    var col2 = db.get('productCollection');
    var cart;
    var json = [];

    col.find({_id: monk.id(req.cookies.userID)}).then((docx)=>{
        var valGet = docx
        cart = valGet[0].cart;
        json.push(cart);
        json.push(valGet[0].totalnum);

        if (cart.length != 0){
            col.aggregate([
                {
                    $match: {
                        _id: monk.id(req.cookies.userID)
                    }
                },
                {
                    $lookup:{
                        from: "productCollection",
                        localField: "cart.productId",
                        foreignField: "_id",
                        as: "info"
                    }
                }
            ]).then((docx)=>{
                for (let i = 0; i < docx[0].info.length; i++){
                    json.push(docx[0].info[i])
                }
                res.send(json);
                
            })
        }else{
            res.send(json);
        }
    })
});

router.put('/updatecart', (req, res)=>{
    var db = req.db;
    var col = db.get('userCollection');
    var productId = req.body.productId;
    var quantity = parseInt(req.body.quantity);

    col.find({"_id": req.cookies.userID}, {}, function(err, docx){
        var cart = docx[0].cart;
        var totalnum = docx[0].totalnum;

        for (let i = 0; i < cart.length; i++){
            var prod = cart[i];
            
            if (prod.productId == productId){
                var temp = cart[i].quantity
                cart[i].quantity = quantity;
                var finalTotalnum = totalnum + (quantity - temp);
                col.update(
                    {"_id":monk.id(req.cookies.userID)},
                    {$set:{
                        "cart":cart, "totalnum":finalTotalnum
                    }},
                    function(err, result){
                        res.send((err == null)?{"totalnum": finalTotalnum}:{msg: err});
                    }
                ) 
            }
        }
    })
});

router.delete('/deletefromcart/:productid', (req, res)=>{
    var db = req.db;
    var col = db.get('userCollection');
    var productId = req.params.productid;

    col.find({"_id": req.cookies.userID}, {}, function(err, docx){
        console.log(docx);
        var totalnum = docx[0].totalnum;
        var cart = docx[0].cart;
        for (let i = 0; i < cart.length; i++){
            var prod = cart[i];
            console.log(prod.productId + " " + productId)
            console.log(prod.productId == productId)
            if (prod.productId == productId){
                var quantity = prod.quantity;
                col.update(
                    {"_id": req.cookies.userID},
                    {$pull:
                        {"cart":{"productId":monk.id(productId)}},
                    $set: {"totalnum":totalnum - quantity}
                    },
                    function(err, result){
                        res.send((err == null)?{"totalnum": totalnum - quantity}:{msg: err});
                        return;
                    }
                )
            }
        }
    })    
});

router.get('/checkout', (req, res)=>{
    var db = req.db;
    var col = db.get('userCollection');

    col.update({_id:req.cookies.userID},
        {$set: {
            cart:[], 
            totalnum: 0
        }},
        function(err, result){
            if (err != null){
                res.send(err);
            }else{
                res.send("");
            }
        }
    )
});

module.exports = router;