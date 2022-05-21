var conn = new Mongo();

var db = conn.getDB("assignment2");

// product collection
var name = [
    "iPhone 13", 
    "Huawei",
    "p3",
    "p4",
    "p5",
    "p6",
    "p7",
    "p8"
];

var category = [
    "Phones",
    "Phones",
    "Tablets",
    "Tablets",
    "Laptops",
    "Laptops",
    "Phones",
    "Tablets"
];

var price = [
    8000,
    6000,
    2000,
    3000,
    4000,
    600,
    9000,
    2000
];

var manufacturer = [
    "Apple Inc.", 
    "Huawei Limited",
    "p3 Inc.",
    "p4 Inc.",
    "p5 Inc.",
    "p6 Inc.",
    "p7 Inc.",
    "p8 Inc."
];

var productImage = [
    "images/iPhone13.jpg", 
    "images/huawei.jpg",
    "images/huawei.jpg",
    "images/huawei.jpg",
    "images/huawei.jpg",
    "images/huawei.jpg",
    "images/huawei.jpg",
    "images/huawei.jpg"
];

var description = [
    "Most advanced dual-camera system ever.", 
    "huawei good",
    "d3",
    "d4",
    "d5",
    "d6",
    "d7",
    "d8"
];

db.productCollection.remove({});

for (let i = 0; i < price.length; i++){
    db.productCollection.insert(
        {
            "name": name[i],
            "category": category[i],
            "price": price[i],
            "manufacturer": manufacturer[i],
            "productImage": productImage[i],
            "description": description[i]
        }
    )
}

// user collection
var username = [
    "Jack",
    "Apple",
    "James",
    "Amy"
];

var password = [
    "654321",
    "123",
    "321",
    "12345"
];

var id1 = db.productCollection.find({name: 'iPhone 13'}, {item:1});
var id2 = db.productCollection.find({name: 'Huawei'}, {item:1});

var cart = [
    [{"productId": id1[0]._id, "quantity": 1},{"productId": id2[0]._id, "quantity": 2}],
    [{"productId": id1[0]._id, "quantity": 5}],
    [],
    []
];

var totalnum = [3, 5, 0, 0];

db.userCollection.remove({});

for (let i = 0; i < username.length; i++){
    db.userCollection.insert({
        "username": username[i],
        "password": password[i],
        "cart": cart[i],
        "totalnum": totalnum[i]
    })
}