function student(f, l, age){
    this.firstName = f;
    this.lastName = l;
    this.age = age;
    this.fullNameAndAge = function(){
        return this.firstName + this.lastName + this.age;
    }
}

var s1 = new student("tong","anze",15);

console.log(s1.fullNameAndAge());