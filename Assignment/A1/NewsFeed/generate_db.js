var conn = new Mongo();

var db = conn.getDB("a1-db");

//var _id = ["123", "12"];
var name = ["Amy", "Alice"];
var password = ["123456", "123456"]
var icon = ["images/amy.jpg", "images/alice.jpg"]

db.userList.remove({});

for (let i = 0; i < name.length; i++){
    db.userList.insert(
        {
            //"_id": _id[i],
            "name": name[i],
            "password": password[i],
            "icon": icon[i]},
    )
}


//var _id = ["567","222"];
var headline = [
    "Jason Day signs with Bridgestone Golf",
    "inspire",
    "COMP3322 is too difficult",
    "Destory the city",
    "Russia & Ukraine",
    "Display"
];
var content = [
    "Twelve-time PGA TOUR winner Jason Day has signed with Bridgestone Golf to use its golf ball.",
    "2nd content is too long to be diaplayed",
    "3rd a b c d e f g h i j k l m n o p q",
    "alert alert alert",
    "this should be implemted later",
    "hello hello hello world"
];
var time = [
    new Date(), 
    new Date(),
    new Date(),
    new Date(),
    new Date(),
    new Date(),
];

var idUser1 = db.userList.find({name:'Amy'},{item:1});
var idUser2 = db.userList.find({name:'Alice'},{item:1});

var comments = [
    [{"userID": idUser1[0]._id,"time":time[0],"comment":"Fantastic!"},{"userID": idUser2[0]._id,"time":time[0],"comment":"Fantastic!"}], 
    [{"userID": idUser2[0]._id,"time":time[1],"comment":"Fantastic!"}],
    [],
    [],
    [],
    []
];


db.newsList.remove({});

for (let i = 0; i < headline.length; i++){
    db.newsList.insert(
        {
            "headline": headline[i],
            "time": time[i],
            "content": content[i],
            "comments": comments[i]},
    )
}
