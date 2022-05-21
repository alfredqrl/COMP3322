//Jiang Feiyu
//3035770800
//Assignment-2

const e = require("express");
var cookie = require("cookie-parser");
const { application } = require("express");
var express = require("express");
var router = express.Router();

//Task1.1 进行数据提取，并且匹配产品类别和名称 (connect to task2)
router.get("/loadpage", (req, res) => {
  // 参数提取
  var col = req.db.get("productCollection");
  var category = req.query.category;
  var searchstring = req.query.searchstring;

  // 若类别为所有，则返回全部
  if (category == "") {
	// 若搜索内容为空，则返回全部
	if (searchstring == ""){
		col.find({}, {}).then((docs) => {
			res.json(docs);
			})
	}
	// 若搜索内容不为空，则返回对应内容
	else{
		col.find({ name: {$regex:searchstring}}, {})
      	.then((docs) => {
			console.log("dew");
			res.json(docs);
      });
	};
  }
  // 若为指定种类，则先判定该种类是否存在，否则返回报错
  else {
    col
      .find({ category: category, name: {$regex:searchstring}}, {})
      .then((docs) => {
		res.json(docs);
      });
  }
});

//Task1.2 检索制造商和产品描述（完成）
router.get("/loadproduct/:id", (req, res) => {
  // 参数提取
  var col = req.db.get("productCollection");
  var id = req.params.id;
//   console.log(id);

  col.find({ _id: id },{}).then((docs) => {
	  res.json(docs);
	//   console.log(docs);
  });
});

//Task1.3 用户检索
router.post("/signin", (req, res) => {
  var username = req.param('username');
  var password = req.param('password');
  var userdb = req.db;
  var user = userdb.get("userCollection");
res.setHeader("Access-Control-Allow-Credentials", "true");
  user
    .find({
      username: username,
      password: password,
    })
    .then((user) => {
      // 长度为1 说明用户存在
      if(user[0]!=null){
		// for(var i ;i<user.length;i++){

		// }
        //设置cookie和过期时间
        res.cookie("userId", user[0]._id.toString(), {maxAge: 900000, httpOnly: true});
        //从数据库中对totalnum进行检索
           res.send(
                {
                  status: "success",
                  msg: "You have successfully logged in",
                  name: username,
                  userId: user[0]._id.toString(),
                  totalnum: user[0].totalnum,
                }
              );

        // 若用户不存在
      } else {
        res.send(
          {
            status: "incorrect",
            msg: "Login failure",
          }
        );
      }
    });
});

//Task1.4 退出
router.get("/signout", (req, res) => {
	res.clearCookie('userId');
  // 若类别为所有，则返回全部
  res.send();
});

//Task1.5 判断用户是否登录
router.get("/getsessioninfo", (req, res) => {
  console.log(req.cookies.userId);
  var userId = req.cookies.userId;
  var userdb = req.db;
  var user = userdb.get("userCollection");
  user
    .find({
      _id: userId,
    })
    .then((user) => {
		  //console.log(user);
	
		if(user[0]!=null){
			res.json(user[0]);
		}else{
			res.send();
		}
    })
	// .then(() => {
    //         res.send();
    //     }).catch(e => {
    //         // res.send();
    //     });
});

//Task1.6 加购物车
router.put("/addtocart", (req, res) => {
  var productId = req.body('productId');
  var quantity = req.body('quantity');
  var userdb = req.db;
  var userC = userdb.get("userCollection");
  var col = req.db.get("productCollection");
  var userId = req.cookies.userId;
  console.log(req.cookies.userId);
  console.log(productId)
  console.log(user)
  console.log(userC)
  console.log(quantity)
  userC
    .find({
      _id: userId,
    })
    .then((user) => {
		  console.log(user);
		  var exists=0;
		if(user[0]!=null){
			var totalnum;
			totalnum = user[0].totalnum;
			console.log(user);
			console.log(user[0].cart);
			for(var i=0;i<user[0].cart.length;i++){
				console.log(user[0].cart[i].productId);
				console.log(productId);
				if(user[0].cart[i].productId==productId)
				{
					user[0].cart[i].quantity=user[0].cart[i].quantity+Number(quantity);
					totalnum = totalnum+Number(quantity);
					console.log(totalnum);
					console.log(quantity);
					exists=1;
				}
			}
			console.log(exists);
			if(exists==0){
				user[0].cart[user[0].cart.length]={"productId" : productId, "quantity" : quantity};
				totalnum = totalnum+Number(quantity);
			}
			console.log(user[0].username);
			userC.update({username : user[0].username}, { $set: { "cart": user[0].cart, "totalnum": totalnum }}, (err, result) => { 
				console.log(err);
				console.log(result);
			});		
			user[0].totalnum=totalnum;
			res.json({totalnum:totalnum});
		}else{
			res.send();
		}
    });			
});

// //Task1.6-2 加购物车
// router.post("/addtocart", (req, res) => {
//   var productId = req.param('productId');
//   var quantity = req.param('quantity');
//   var userdb = req.db;
//   var userC = userdb.get("userCollection");
//   var col = req.db.get("productCollection");
//   var userId = req.cookies.userId;
//   console.log(req.cookies.userId);
//   userC
//     .find({
//       _id: userId,
//     })
//     .then((user) => {
// 		  console.log(user);
// 		  var exists=0;
// 		if(user[0]!=null){
// 			var totalnum;
// 			totalnum = user[0].totalnum;
// 			console.log(user);
// 			console.log(user[0].cart);
// 			for(var i=0;i<user[0].cart.length;i++){
// 				console.log(user[0].cart[i].productId);
// 				console.log(productId);
// 				if(user[0].cart[i].productId==productId)
// 				{
// 					user[0].cart[i].quantity=user[0].cart[i].quantity+Number(quantity);
// 					totalnum = totalnum+Number(quantity);
// 					console.log(totalnum);
// 					console.log(quantity);
// 					exists=1;
// 				}
// 			}
// 			console.log(exists);
// 			if(exists==0){
// 				user[0].cart[user[0].cart.length]={"productId" : productId, "quantity" : quantity};
// 				totalnum = totalnum+Number(quantity);
// 			}
// 			console.log(user[0].username);
// 			userC.update({username : user[0].username}, { $set: { "cart": user[0].cart }}, (err, result) => { 
// 				console.log(err);
// 				console.log(result);
// 			});		
// 			userC.update({username : user[0].username}, { $set: { "totalnum": totalnum }}, (err, result) => { 
// 				console.log(err);
// 				console.log(result);
// 			});	
// 			user[0].totalnum=totalnum;
// 			res.json({totalnum:totalnum});
// 		}else{
// 			res.send();
// 		}
//     });			
// });


//Task1.7 加载购物车
router.get("/loadcart", (req, res) => {
  // 参数提取
  var mycartproducts = new Array();
  var mycarts = new Array();
  var userdb = req.db;
  var userC = userdb.get("userCollection");
  var userId = req.cookies.userId;
  var col = req.db.get("productCollection");
 userC
    .find({
      _id: userId,
    })
    .then((user) => {
		  console.log(user[0].cart);
	  for(var i=0;i<user[0].cart.length;i++){
				console.log(user[0].cart[i].productId);
				mycartproducts[i]=user[0].cart[i].productId;		
			}
		col.find({ _id : { $in : mycartproducts } } )
			.then((products) => {
console.log(products)
			 for(var i=0;i<products.length;i++){
				console.log(products[i].name);
				var quantity;
				for(var j=0;j<user[0].cart.length;j++){
					console.log(products[i].name);
					console.log(user[0].cart[j].productId);
					if(products[i]._id==user[0].cart[j].productId){
						quantity=user[0].cart[j].quantity;
					}
				}
				mycarts[i]={
					productId:products[i]._id,
					name:products[i].name,
					price:products[i].price,
					quantity:quantity,
					img: products[i].productImage
				}
			}
console.log(mycarts);
			res.send({
                  status: "success",
			      cart: mycarts,
                }
              );
		})
	  });
});

//Task1.8 更新购物车
router.put("/updatecart", (req, res) => {
  var productId = req.param('productId');
  var quantity = req.param('quantity');
  var userdb = req.db;
  var userC = userdb.get("userCollection");
  var col = req.db.get("productCollection");
  var userId = req.cookies.userId;
  console.log(req.cookies.userId);
  userC
    .find({
      _id: userId,
    })
    .then((user) => {
		  console.log(user);
		  var exists=0;
		if(user[0]!=null){
			var totalnum;
			totalnum = user[0].totalnum;
			console.log(user);
			console.log(user[0].cart);
			for(var i=0;i<user[0].cart.length;i++){
				console.log(user[0].cart[i].productId);
				console.log(productId);
				if(user[0].cart[i].productId==productId)
				{
					totalnum=totalnum-user[0].cart[i].quantity+quantity
					user[0].cart[i].quantity=quantity;
					console.log(totalnum);
					console.log(quantity);
				}
			}
			console.log(user[0].username);
			console.log(totalnum);
			userC.update({username : user[0].username}, { $set: { "cart": user[0].cart, "totalnum": totalnum  },}, (err, result) => { 
				console.log(err);
				console.log(result);
			});		
			user[0].totalnum=totalnum;
			res.json({totalnum:totalnum});
		}else{
			res.send();
		}
    });			
});

//Task1.8-2 更新购物车
// router.post("/updatecart", (req, res) => {
//   var productId = req.param('productId');
//   var quantity = req.param('quantity');
//   var userdb = req.db;
//   var userC = userdb.get("userCollection");
//   var col = req.db.get("productCollection");
//   var userId = req.cookies.userId;
//   console.log(req.cookies.userId);
//   userC
//     .find({
//       _id: userId,
//     })
//     .then((user) => {
// 		  console.log(user);
// 		  var exists=0;
// 		if(user[0]!=null){
// 			var totalnum;
// 			totalnum = user[0].totalnum;
// 			console.log(user);
// 			console.log(user[0].cart);
// 			for(var i=0;i<user[0].cart.length;i++){
// 				console.log(user[0].cart[i].productId);
// 				console.log(productId);
// 				if(user[0].cart[i].productId==productId)
// 				{
// 					totalnum=totalnum-user[0].cart[i].quantity+quantity
// 					user[0].cart[i].quantity=quantity;
// 					console.log(totalnum);
// 					console.log(quantity);
// 				}
// 			}
// 			console.log(user[0].username);
// 			userC.update({username : user[0].username}, { $set: { "cart": user[0].cart }}, (err, result) => { 
// 				console.log(err);
// 				console.log(result);
// 			});		
// 			userC.update({username : user[0].username}, { $set: { "totalnum": totalnum }}, (err, result) => { 
// 				console.log(err);
// 				console.log(result);
// 			});	
// 			user[0].totalnum=totalnum;
// 			res.json({totalnum:totalnum});
// 		}else{
// 			res.send();
// 		}
//     });			
// });
//Task1.9 删除商品
router.delete("/deletefromcart/:productid", (req, res) => {
  // 参数提取
  var productid = req.params.productid;
  var userdb = req.db;
  var userC = userdb.get("userCollection");
  var userId = req.cookies.userId;
  userC
    .find({
      _id: userId,
    })
    .then((user) => {
		  console.log(user);
		  var exists=0;
		if(user[0]!=null){
			var totalnum;
			totalnum = user[0].totalnum;
			console.log(user);
			console.log(user[0].cart);
			for(var i=0;i<user[0].cart.length;i++){
				console.log(user[0].cart[i].productId);
				console.log(productid);
				if(user[0].cart[i].productId==productid)
				{
					totalnum=totalnum-user[0].cart[i].quantity;
					user[0].cart.splice(i,1)
				}
			}
			console.log(user[0].username);
			userC.update({username : user[0].username}, { $set: { "cart": user[0].cart, "totalnum": totalnum }}, (err, result) => { 
				console.log(err);
				console.log(result);
			});		
			// userC.update({username : user[0].username}, { $set: { "totalnum": totalnum }}, (err, result) => { 
			// 	console.log(err);
			// 	console.log(result);
			// });	
			user[0].totalnum=totalnum;
			res.json({totalnum:totalnum});
		}else{
			res.send();
		}
    });	
});

//Task1.10 结算
router.get("/checkout", (req, res) => {
  var userId = req.cookies.userId;
  var userdb = req.db;
  var userC = userdb.get("userCollection");
  console.log(req.cookies.userId);
  userC
    .find({
      _id: userId,
    })
    .then((user) => {
		  console.log(user);
		  var exists=0;
		if(user[0]!=null){
			var totalnum;
			totalnum = user[0].totalnum;
			console.log(user);
			console.log(user[0].cart);
			userC.update({username : user[0].username}, { $set: { "cart": [], "totalnum": 0  }}, (err, result) => { 
				console.log(err);
				console.log(result);
			});		
			// userC.update({username : user[0].username}, { $set: { "totalnum": 0 }}, (err, result) => { 
			// 	console.log(err);
			// 	console.log(result);
			// });	
			res.send();
		}else{
			res.send();
		}
    });			
});

module.exports = router;
