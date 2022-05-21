import React from 'react';
import logo from './logo.svg';
import './App.css';
import $ from 'jquery';
import { type } from '@testing-library/user-event/dist/type';


function CategoryList(props){
  return(
    <div className='item'>
      <a onClick={(e)=>props.handleCategoryChange("Phones")}>Phones </a>
      <a onClick={(e)=>props.handleCategoryChange("Tablets")}>Tablets </a>
      <a onClick={(e)=>props.handleCategoryChange("Laptops")}>Laptops </a>
    </div>
  );
}

class Header extends React.Component{
  constructor(props){
    super(props);

    this.state = {
      isLogIn: false,
      productHeader: [],
      category: "all",
      jsxLogIn: [],
      logInPage: false,
      username: "",
      password: "",
      afterLogIn:[],
      totalnum: 0,
    }

    this.handleCategoryChange = this.handleCategoryChange.bind(this);
    this.searchProduct = this.searchProduct.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    //this.props.handleSearchProduct = this.props.handleSearchProduct.bind(this);
    this.handleShoppingCartPage = this.handleShoppingCartPage.bind(this)
    this.logIn = this.logIn.bind(this);
    
   
  }

  handleShoppingCartPage(){
    //console.log("have clicked");
    $.ajax({
      type: "GET",
      url: "http://localhost:3001/loadcart",
      dataType: "json",
      xhrFields: {withCredentials: true},
      success: function(data){
        console.log(data);
        this.props.handleShoppingCartItem(data);
        this.props.handlePage("shoppingCartPage");
        
      }.bind(this)
    })
  }

  render(){
    let page = [];
    let logButton = null;
    
    var sessionInfo = this.props.sessionInfo;
    var hasSession = false;
    
    if(sessionInfo != ""){
      hasSession = true;
      //console.log(sessionInfo);
      this.state.isLogIn = true;
      this.state.logInPage = false;
      this.state.afterLogIn = [{"name": sessionInfo[0].username, "totalnum": sessionInfo[1].totalnum}]
    }

    var userShoppingList;
      //console.log(this.state.afterLogIn == []);
      if (this.state.afterLogIn.length != 0){
        //console.log(this.state.afterLogIn);
        var name = this.state.afterLogIn[0].name;
        var totalnum = this.state.afterLogIn[0].totalnum;
        //console.log(name);
        //console.log(totalnum);
        userShoppingList = <div id='shoppingList' onClick={(e)=>this.handleShoppingCartPage()}>
                            <img src={"http://localhost:3001/images/shopping.jpg"} 
                              style={{height:"20px", width:"20px"}} />
                            <p id='detail'>of shopping {totalnum} in Cart</p>
                            <p style={{float: "right"}}>Hello {name}</p>
                         </div>
      }

    if (this.state.isLogIn == false){
      logButton = <button onClick={this.logIn.bind(this)} className='log' id='logIn'>Log In</button>
    }else{
      logButton = <button onClick={this.logOut.bind(this)} className='log'id='logout'>Log Out</button>
    }

    if (this.state.logInPage){
      page.push(this.state.jsxLogIn);
    }else{
      if (this.state.isLogIn == false){
        page.push(
        <React.Fragment>
        <CategoryList 
          handleCategoryChange = {this.handleCategoryChange}
        />
        <select onChange={(e) => this.handleCategoryChange(e.target.value)}>
          <option value ={"all"}>all</option>
          <option value ={"Phones"}>phones</option>
          <option value={"Tablets"}>tablets</option>
          <option value={"Laptops"}>laptops</option>
        </select>
        <input 
          type="text"
          name="productHeader"
          placeholder="Choose Product"
          value={this.state.productHeader}
          onChange={this.handleInputChange}
        />
        <button onClick={this.searchProduct}>Search</button>
        {logButton}</React.Fragment>);
      }else{
        page.push(
          <React.Fragment>
          <CategoryList 
            handleCategoryChange = {this.handleCategoryChange}
          />
          <select onChange={(e) => this.handleCategoryChange(e.target.value)}>
            <option value ={"all"}>all</option>
            <option value ={"Phones"}>phones</option>
            <option value={"Tablets"}>tablets</option>
            <option value={"Laptops"}>laptops</option>
          </select>
          <input 
            type="text"
            name="productHeader"
            placeholder="Choose Product"
            value={this.state.productHeader}
            onChange={this.handleInputChange}
          />
          <button onClick={this.searchProduct}>Search</button>
          {userShoppingList}
          {logButton}</React.Fragment>);
      }
    }

    return(
      <div className='topBar'>
        {page}
      </div>
    );
  }

  
  handleCategoryChange(category) {

    $.ajax({
      type: "GET",
      dataType: "json",
      url:`http://localhost:3001/loadpage?category=${category}&searchstring=${""}`,
      xhrFields:{withCredentials: true},
      success: function(data){
        this.setState({category: category});
        this.props.handleSearchProduct(data);
        this.props.handlePage("search");
      }.bind(this)
    })
  }

  handleInputChange(event){
    const target = event.target;
    const value = target.value;
    const name = target.name;
    this.setState({[name]: value});
  }

  searchProduct(){
    var product = this.state.productHeader;
    var category = this.state.category;
    //this.props.handlePage("");
    
    $.ajax({
      type: "GET",
      dataType: "json",
      url: `http://localhost:3001/loadpage?category=${category}&searchstring=${product}`,
      xhrFields:{withCredentials: true},
      success: function(data) {
        this.props.handleSearchProduct(data);
        this.props.handlePage("search");
      }.bind(this)
    })
  }
  

  handleCompare(){
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    //alert(username);
    //alert(password);
    var afterLogIn=[]
    if (username == "" || password == ""){
      alert("You must enter username and password");
    }else{
      $.ajax({
        type: "POST",
        url: "http://localhost:3001/signin",
        data: {"username":username, "password":password},
        xhrFields:{withCredentials: true},
        success: function(data){
          if (data == "Login failure"){
            if (document.getElementById("fail") == null){
              var p = document.createElement("p");
              p.innerHTML = "Login Fail";
              p.setAttribute("id", "fail");
              document.getElementById("logInPage").appendChild(p);
            }
          }else{
            afterLogIn.push({"name": username, "totalnum": data[0].totalnum});
            this.setState({logInPage: false});
            this.setState({afterLogIn: afterLogIn});
            this.props.handleAfterLogIn(afterLogIn);
            //console.log(this.state.afterLogIn);
            this.setState({isLogIn: true});
            this.props.handlePage("initial");
            this.props.isLogIn(true);
          }
        }.bind(this)
    })
    }
  }

  logIn(){
    
    // ajax request
    this.setState({logInPage: true});
    this.props.handlePage("login");
    var jsxLogIn = <div id='logInPage'>
                      <h1>Login</h1>
                      <div className='input-box'>
                        <input type="text" id='username' placeholder="User Name"/>
                      </div>
                      <div className='input-box'>
                        <input type="text" id='password' placeholder="Password"/>
                      </div>
                      <button onClick={this.handleCompare.bind(this)}>Sign in</button>
                   </div>;
    this.setState({jsxLogIn: jsxLogIn});  
  }

  logOut(){
    this.setState({isLogIn: false, afterLogIn: []});
    this.props.isLogIn(false);
    this.props.handlePage("initial");
    this.props.handleSessionInfo("");
    $.ajax({
      type: "GET",
      url: "http://localhost:3001/signout",
      xhrFields:{withCredentials: true},
      success: function(data){
        if (data != ""){
          alert(data);
        }
      }.bind(this)
    })
    ;
  }
}

function Item(props){
  return(
    <div className="cards__item" onClick={(e)=>props.onClicked(props.id)}>
      <img src={"http://localhost:3001/" + props.productImage} 
           style={{height:"100px", width:"100px"}}/>
      <p>{props.name}</p>
      <p>{props.price}</p>
    </div>
  )
}

class Body extends React.Component{
  constructor(props){
    super(props);
    this.productInitialPage = this.productInitialPage.bind(this);
    this.getSession = this.getSession.bind(this);
    this.handleOneItemPage = this.handleOneItemPage.bind(this);
    this.handleQuantityChange = this.handleQuantityChange.bind(this);
    this.addToCart = this.addToCart.bind(this);
    this.back = this.back.bind(this);
    this.checkOut = this.checkOut.bind(this);
    this.handleUpdateRemove = this.handleUpdateRemove.bind(this);
    

    this.state={initialProduct: [], 
                sessionInfo:"",
                oneProductPage:"",
                quantity:0,
                totalItemNum:0,
                totalPrice:0,
                test:0,
                oneProduct: ""
    };
  }
  
  handleQuantityChange(quantity){
    this.setState({quantity: quantity});
  }

  addToCart(product, quantity){
    var name;
    var isLogIn = this.props.isLogIn;
    var sessionInfo = this.props.sessionInfo;
    //console.log(isLogIn);
    //console.log(sessionInfo);
    //console.log(quantity);
    console.log(product)
    //console.log(sessionInfo == null)
    if (isLogIn == false){
      document.getElementById('logIn').click();
    }else{
      if (quantity == 0){
        alert("At least you should buy one.");
      }else{
        console.log(product[0]._id + " "+ quantity);
        $.ajax({
        type: "PUT",
        url: "http://localhost:3001/addtocart",
        xhrFields:{withCredentials: true},
        data: {productId: product[0]._id, quantity: quantity},
        success: function(data){
          console.log(data);
          document.getElementById("detail").innerHTML = `of shopping ${data.totalnum} in Cart`;
          this.props.handlePage("addToCart");
        }.bind(this)
      })
      }
    }
  }

  back(){
    this.props.handlePage("initial");
  }

  handleOneItemPage(id){
    //console.log(id);
    $.ajax({
      type: "GET",
      url: "http://localhost:3001/loadproduct/" + id,
      xhrFields: {withCredentials: true},
      success: function(data){
        this.state.oneProduct = data;
        //console.log(data);
        var page = <div id='abc'><div className="oneProductPage">
                    <img src={"http://localhost:3001/" + data[0].productImage} style={{float: "left", width: "100px", height: "100px"}}/>
                    <p>{data[0].name}<br />Price: {data[0].price}<br />Manufacturer Info: {data[0].manufacturer}
                      <br />{data[0].description}
                    </p>
                    <form style={{float:"right"}}>
                      <fieldset className='field'>
                        <legend>Add To Cart</legend>
                        Quantity: <select onChange={(e) => this.handleQuantityChange(e.target.value)}>
                                    <option value ={0}>0</option>
                                    <option value ={1}>1</option>
                                    <option value ={2}>2</option>
                                    <option value={3}>3</option>
                                    <option value={4}>4</option>
                                  </select>
                        <a onClick={(e) => this.addToCart(data, this.state.quantity)}>Add to Cart</a>
                      </fieldset>
                    </form>
                   </div>
                   <div className='goBack'>
                      <button onClick={(e) => this.back()}>{"<"} go back</button>
                   </div>
                   </div>
        this.setState({oneProductPage: page});
        this.props.handlePage("oneProductPage");
      }.bind(this)
    })
  }

  productInitialPage() {
    
    $.getJSON(`http://localhost:3001/loadpage?category=${"all"}&searchstring=`,
    function(data, status){
      //console.log(data);
      
      this.setState({initialProduct : data});
    }.bind(this))
  }

  getSession() {
    var sessionInfo;
    //if (this.props.sessionInfo != ""){
      $.ajax({
      type: "GET",
      url: "http://localhost:3001/getsessioninfo",
      xhrFields:{withCredentials: true},
      success: function(data){
        sessionInfo = data;
        //console.log(sessionInfo);
        if (sessionInfo != ""){
          this.props.handleLogIn(true);
        }   
        this.props.handleSessionInfo(sessionInfo);
      }.bind(this)
    })
  //}
  }

  componentDidMount(){
     this.productInitialPage();
     this.getSession();
  }

  continueB(){
    window.location.reload();
    this.props.handlePage("initial");
  }

  checkOut(){
    if (this.state.totalItemNum != 0){
      $.ajax({
        type: "GET",
        url: "http://localhost:3001/checkout",
        xhrFields: {withCredentials: true},
        success: function(data){
          if (data == ""){
            alert("success checked out");
            document.getElementById("detail").innerHTML = 'of shopping 0 in Cart';
            this.props.handlePage("checkout");
            this.state.totalItemNum = 0;
            this.state.totalPrice = 0;
          }
        }.bind(this)
      })
    }else{
      alert("No item to checkout!");
    }
  }

  handleUpdateRemove(productId, value, name){
    console.log(value);
    console.log(productId);
    console.log(name);
    if (value != 0){
      console.log("send");
      $.ajax({
        type: "PUT",
        url: "http://localhost:3001/updatecart",
        xhrFields: {withCredentials: true},
        data: {productId: productId, quantity: value},
        success: function(data){
          console.log(data);
          this.props.handlePage("shoppingCartPage");
          document.getElementById("detail").innerHTML = `of shopping ${data.totalnum} in Cart`;
          document.getElementById("shoppingList").click();
        }.bind(this)
      })
    }else{
      $.ajax({
        type: "DELETE",
        url: "http://localhost:3001/deletefromcart/" + productId,
        xhrFields: {withCredentials: true},
        success: function(data){
          console.log(data);
          //this.props.handlePage("shoppingCartPage");
          //document.getElementById("reload").click();
          //window.location.reload();
          document.getElementById("shoppingList").click();
          document.getElementById("detail").innerHTML = `of shopping ${data.totalnum} in Cart`;
        }.bind(this)
      })
    }
  }

  render(){
    var product = this.props.inputSearchProduct;
    var line = [];
    
    if (this.props.page == "initial"){
      product = this.state.initialProduct;
    }

    if (this.props.page == "initial" || this.props.page == "search"){
      for (let i = 0; i < product.length; i++){
        if ((i + 1) % 4 != 0){
          line.push(<Item productImage = {product[i].productImage}
                        name = {product[i].name}
                        price = {product[i].price}
                        id = {product[i]._id}
                        onClicked = {this.handleOneItemPage}                     
          />)
        }else{
          line.push(<Item productImage = {product[i].productImage}
                        name = {product[i].name}
                        price = {product[i].price}
                        id = {product[i]._id}
                        onClicked = {this.handleOneItemPage}
          />)
        }
      }
    }else if (this.props.page == "oneProductPage"){
      line.push(this.state.oneProductPage);
    }else if (this.props.page == "shoppingCartPage"){
      console.log(this.props.shoppingCartItem);
      var shoppingCartItem = this.props.shoppingCartItem;
      console.log(shoppingCartItem[0]);
      var totalPrice = 0;
      var eachItemRow = [];
      //try{
        if (shoppingCartItem != null){

        
        console.log(shoppingCartItem);
        for (let i = 0; i < shoppingCartItem[0].length; i++){
          //console.log(shoppingCartItem[i+2].productImage);
          eachItemRow.push(<tr>
                            <td>
                              <img src={"http://localhost:3001/" + shoppingCartItem[i+2].productImage}
                                  style={{height: "100px", width: "100px"}} />
                            </td>
                            <td>{shoppingCartItem[i+2].name}</td>
                            <td>${shoppingCartItem[i+2].price}</td>
                            <td><input type="number" min={0} max={100} step={1} 
                                defaultValue={shoppingCartItem[0][i].quantity}
                                onChange={(e)=>this.handleUpdateRemove(shoppingCartItem[i+2]._id, e.target.value, shoppingCartItem[i+2].name)} id="numberChange"/></td>
                           </tr>
                          );
          totalPrice = totalPrice + shoppingCartItem[i+2].price * shoppingCartItem[0][i].quantity;
          
        }
        console.log(shoppingCartItem[1])
        this.state.totalItemNum = shoppingCartItem[1]; 
        this.state.totalPrice = totalPrice;
      //}catch(err){
        //console.log("123");
        //eachItemRow = [];
      //}
      }
      console.log(totalPrice);
      
      line.push(<React.Fragment>
                  <h1>Shopping Cart</h1>
                  <table className='shoppingCart'>
                    <tr>
                      <th>Images</th>
                      <th>Item Name</th>
                      <th>Price</th>
                      <th>Quantity</th>
                    </tr>
                    {eachItemRow}
                  </table>
                  <h3>Cart subtotal ({shoppingCartItem[1]} item(s)): ${totalPrice}</h3>
                  <button onClick={(e)=>this.checkOut()}>Proceed to check out</button>
                  <a id="reload" onClick={(e)=>this.continueB()}>continue browsing {">>>"}</a>
                </React.Fragment>)
    }else if (this.props.page == "checkout"){
      var num = this.state.totalItemNum;
      var price = this.state.totalPrice;

      line.push(<React.Fragment>
        <div className='paid'>
          <h3>√ You have successfully placed order for {num} item(s)</h3>
          <h3>${price} paid</h3>
        </div>
        <div className='continueBrowsing'>
          <a onClick={(e)=>this.continueB()}>continue browsing {">>>"}</a>
        </div>
      </React.Fragment>)
    }else if (this.props.page == "addToCart"){
      console.log(this.state.oneProduct);
      line.push(<React.Fragment>
        <div className='addToCart'>
          <img src={"http://localhost:3001/" + this.state.oneProduct[0].productImage} 
              style={{height:"100px", width:"100px"}} />
          <p>√ Added to Cart</p>
        </div>
        <div className='continueBrowsing'>
        <a onClick={(e)=>this.continueB()}>continue browsing {">>>"}</a>
        </div>
      </React.Fragment>)
    }

    return(
      <React.Fragment>
      <div id='bodyContent'>
        {(this.props.page == "initial" || this.props.page == "search")?
          <div className='cards'>
            {line}
          </div>
        :<div>{line}</div>}
      </div>
      <div id='welcome'>
        <p>Welcome to the iShop!</p>
      </div>
      </React.Fragment>
    )
  }
}

class App extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      isLogIn : false,
      inputSearchProduct: [],
      page: "initial",
      sessionInfo: "",
      shoppingCartItem: "",
      afterLogIn:[]
    }
    this.handleLogIn = this.handleLogIn.bind(this);
    this.handleSearchProduct = this.handleSearchProduct.bind(this);
    this.handlePage = this.handlePage.bind(this);
    this.handleSessionInfo = this.handleSessionInfo.bind(this);
    this.handleShoppingCartItem = this.handleShoppingCartItem.bind(this);
    this.handleAfterLogIn = this.handleAfterLogIn.bind(this);
  }

  handlePage(page){
    this.setState({page:page});
  }
  
  handleLogIn(data){
    this.setState({
      isLogIn : data
    });
  }

  handleSearchProduct(Search){
    this.setState({
      inputSearchProduct : Search
    });
  }

  handleSessionInfo(name){
    this.setState({
      sessionInfo: name
    })
  }

  handleShoppingCartItem(item){
    console.log(item);
    this.setState({
      shoppingCartItem: item
    })
  }

  handleAfterLogIn(data){
    this.setState({
      afterLogIn: data
    })
  }

  render(){
    return(<React.Fragment>
      <Header 
        key={" "}
        isLogIn = {this.handleLogIn} 
        handleSearchProduct = {this.handleSearchProduct}
        sessionInfo = {this.state.sessionInfo}
        handlePage = {this.handlePage}
        handleSessionInfo = {this.handleSessionInfo}
        handleShoppingCartItem = {this.handleShoppingCartItem}
        handleAfterLogIn = {this.handleAfterLogIn}
      />
      <Body 
        key={"2"}
        page = {this.state.page}
        handlePage = {this.handlePage}
        inputSearchProduct = {this.state.inputSearchProduct}
        handleSessionInfo = {this.handleSessionInfo}
        shoppingCartItem = {this.state.shoppingCartItem}
        isLogIn = {this.state.isLogIn}
        sessionInfo = {this.state.sessionInfo}
        afterLogIn = {this.state.afterLogIn}
        handleLogIn = {this.handleLogIn}
        
      />
    </React.Fragment>
    );
  }
}


export default App;
