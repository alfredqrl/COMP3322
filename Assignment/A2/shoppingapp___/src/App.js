import { Route, Routes} from 'react-router-dom'
import './App.css';
import React from 'react';
// 路由配置
import {Link} from 'react-router-dom'
import $ from 'jquery';

//历史页
import { createBrowserHistory } from 'history'
export const history = createBrowserHistory()

class App extends React.Component {
  constructor(props) {
    super(props);
    this.homeRef = React.createRef()
    console.log(this.homeRef)
    this.state = {
      dataList:[]
    }
    this.toDetail = this.toDetail.bind(this);
    this.getDataList = this.getDataList.bind(this)
  }

  componentDidMount(){
    this.getDataList()
  }
  toDetail(item) {
    return '/detailed?id=' + item._id

  }
  //通过搜索框内容和类别获得数据
  getDataList(searchstring,category){
    // console.log(searchstring)
    // console.log(category)
    $.ajax({
      type:'GET',
      url: 'http://localhost:3001/loadpage',
      data:{
        "category":category||"",
        "searchstring":searchstring || ""
      },
      dataType: "JSON",
      crossDomain:true, //设置跨域为true
      xhrFields: {
          withCredentials: true //默认情况下，标准的跨域请求是不会发送cookie的
      },
      async: false
    }).done(function(response){
      this.setState({dataList:response})
      // console.log(response)
    }.bind(this));;
  }
  
  onRef(ref){
    this.child = ref
  }
  home (){
    
    this.listItems = this.state.dataList.map((item) =>
    <Link to={this.toDetail(item)}  key={item._id}>
      <li>
        <img src={`http://127.0.0.1:3001/`+`${item.productImage}`} alt=''/>
        <p>{item.name}</p>
        <p>{item.price}</p>
      </li>
    </Link>
    );
    return (
        <div>
          <ul className='products'>
            {this.listItems}
          </ul>
        </div>
    );
  }
  render() {
    return (
      <div>
        <Header getDataList={this.getDataList} />
        <div className="contents">
          <Routes>
            <Route element={<Login/>} path='/login'></Route>
            <Route element={this.home()} path='/home'></Route>
            <Route element={<Detailed/>} path='/detailed'></Route>
            <Route element={<Cart/>} path='/cart'></Route>
            <Route element={<Finish/>} path='/finish'></Route>
          </Routes>
        </div>
      </div>
    );
  }
}

export default App;
//还未调试
class Finish extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }
  render() {
    return (
      <div>
        <p>You have successfully placed order</p>
        <p>for XX items</p>
        <p>&nbsp;</p>
        <p>$XX paid</p>
        <Link to='/home'><button className='continue-browsing'>continue browsing &gt; </button>  </Link>
      </div>
    );
  }
}

//还未调试
class Cart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        numbers :[]
    }
    
    this.handlerChange = this.handlerChange.bind(this)
    this.checkout = this.checkout.bind(this)
  }
  componentDidMount(){
    this.getDataList()
  }
  handlerChange (e,index){
    let value = e.target.value < 0 ? 0 : e.target.value
    console.log(value)
    let arr = this.state.numbers;
    arr[index].quantity = value
    this.setState({numbers:[...arr]});
    var id =  this.props.arr[index]._id;
    if(Number(value) === 0){
      $.ajax({
        type: 'POST',
        url: 'http://localhost3001/deletefromcart/'+ id,
        dataType: "json",
        crossDomain:true, //设置跨域为true
        xhrFields: {
            withCredentials: true //默认情况下，标准的跨域请求是不会发送cookie的
        },
        async: false,
        success: (res)=>{
          if(res){
            this.getDataList()
          }
        }
      });
    }else{
      $.ajax({
        type:'PUT',
        url: 'http://localhost3001/updatecart',
        data:{"productId":arr[index].productId,"quantity":Number(value)},
        dataType: "json",
        crossDomain:true, //设置跨域为true
        xhrFields: {
            withCredentials: true //默认情况下，标准的跨域请求是不会发送cookie的
        },
        async: false,
        success: (res)=>{
          if(res){
            this.getDataList()
          }
        }
      });
    }

  }
  getDataList(){
    $.ajax({
      type:'GET',
      url: 'http://localhost3001/loadcart',
      data:{
      },
      dataType: "json",
      crossDomain:true, //设置跨域为true
      xhrFields: {
          withCredentials: true //默认情况下，标准的跨域请求是不会发送cookie的
      },
      async: false,
      success: (res)=>{
        if(res && res.cart.length > 0){
          this.setState({numbers:res.cart})
        }
      }
    });
  }
  checkout(){
    $.ajax({
      type: 'GET',
      url: 'http://localhost3001/checkout',
      dataType: "json",
      crossDomain:true, //设置跨域为true
      xhrFields: {
          withCredentials: true //默认情况下，标准的跨域请求是不会发送cookie的
      },
      async: false,
      success: (res)=>{
      }
    });
    window.location.href = '/#/finish'
  }
  render() {
    let totalPrice = 0
    this.state.numbers.forEach(element => {
      totalPrice += element.price * element.quantity
    });
    return (
     <div>
       <table className='detail'>
          <tbody>
            {this.state.numbers.map((item,index) =>
              <tr  key={item.productId}>
                <td className='detail-img'>
                  <img src="" alt=''/>
                </td>
                <td className='detial-info'>
                  <p>{item.name}</p>
                </td>
                <td className='detial-info'>
                <p>{item.price}</p>
                </td>
                <td className='detail-number'>
                  <div>
                    <p>Quantity <input type='number' value={item.quantity} onChange={(e) => {this.handlerChange(e,index)}}></input></p>
                  </div>
                </td>
              </tr>
        )}
          </tbody>
        </table>
        <p>Cart subtotal ({this.state.numbers.length} items) : ${totalPrice}</p>
        <button onClick={this.checkout}>Proceed to check out</button>
     </div>
    );
  }
}
//返回部分已经完成
class Back extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    }
    this.goBack = this.goBack.bind(this);
  }
  goBack() {
    history.go(-1)
  }
  render() {
    return (
      <button onClick={this.goBack} className='back-btn'><img src="http://127.0.0.1:3001/images/back.png" ></img>go back</button>
    );
  }
}

class Detailed extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id:'',
      detailInfo:{},
      quantity:1,
      toCartPage:false
    }
   
  }
  componentDidMount(){
    // 操作本页面地址，取出id
    let id = window.location.href.split('?')[1].split('=')[1]
    this.getData(id)
    this.addToChar = this.addToChar.bind(this)
    this.handlerChange = this.handlerChange.bind(this)
  }
  handlerChange(e){
    this.setState({quantity:e.target.value})
  }
  addToChar(){
    let id = window.location.href.split('?')[1].split('=')[1]
    $.ajax({
        type: 'PUT',
        url: `http://localhost:3001/addtocart`,
        dataType: 'JSON',
        crossDomain:true, //设置跨域为true
        data: {'productId':id, "quantity": Number(this.state.quantity)},
        xhrFields: {
          withCredentials: true //默认情况下，标准的跨域请求是不会发送cookie的
      },
      async: false
  }).done(function(res){
        console.log(res);
        this.setState({toCartPage:false});
        window.location.reload()
        // console.log(this.state.toCartPage)
  }.bind(this));
  }

  getData(id){
    $.ajax({
              type: 'GET',
              url: `http://localhost:3001/loadproduct/` + id,
              // data: new_doc,
              dataType: 'JSON',
              crossDomain:true, //设置跨域为true
              xhrFields: {
                withCredentials: true //默认情况下，标准的跨域请求是不会发送cookie的
              },
              async: false
          }).done(function(res){
              // console.log(res);
              this.setState({detailInfo:res[0]})
          }.bind(this));
  }
  
  render() {
    if(this.state.toCartPage){
      return (
        <div>
          <table className='detail'>
            <tbody>
              <tr>
                <td className='detail-img'>
                <p>${this.state.detailInfo.productImage}</p>
                <img src={`http://127.0.0.1:3001/`+`${this.state.detailInfo.productImage}`} alt=''/>
                </td>
                <td className='detial-info'>
                  <div>
                    √ Added to Cart
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <Link to='/home'><button className='continue-browsing'>continue browsing &gt; </button>  </Link>
          
        </div>
      )
    }else{

      return (
        <div>
          <table className='detail'>
            <tbody>
              <tr>
                <td className='detail-img'>
                <img src={`http://127.0.0.1:3001/`+`${this.state.detailInfo.productImage}`} alt=''/>
                </td>
                <td className='detial-info'>
                  <p>{this.state.detailInfo.name}</p>
                  <p>{this.state.detailInfo.price}</p>
                  <p>{this.state.detailInfo.manufacturer}</p>
                  <p>{this.state.detailInfo.description}</p>
                </td>
                <td className='detail-number'>
                  <div>
                    <p>Quantity <input type='number' defaultValue={'1'} onChange={(e) => {this.handlerChange(e)}}></input></p>
                    <button onClick={this.addToChar}>Add to Cart</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <Back/>
        </div>
      );
    }
  }
}

//登录部分已经完成
class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userName:'',
      password:'',
      status: "incorrect"
    }
    this.login = this.login.bind(this)
    this.handlerInput = this.handlerInput.bind(this)
    
  }
  login (){
    if(this.state.userName === '' || this.state.password === ''){
      alert("You must enter username and password");
    }else{
      $.ajax({
        type:'POST',
        url: 'http://localhost:3001/signin',
        dataType: "json",
        data: {
          "username":this.state.userName,
          "password":this.state.password
        },
        crossDomain:true, //设置跨域为true
        xhrFields: {
            withCredentials: true //默认情况下，标准的跨域请求是不会发送cookie的
        },
        success: function(res){
          console.log(res);
          if(res){
            if (res.status == "success"){
              window.location.href = '/#/home'
              window.location.reload();
            }else{
              alert("Login failure");
            }
            
          }
        }
     });
    }
  }
  getUserInfo(){
    $.ajax({
      type: 'GET',
      url: "http://localhost:3001/getsessioninfo",
      dataType: "json",
      crossDomain:true, //设置跨域为true
      xhrFields: {
          withCredentials: true //默认情况下，标准的跨域请求是不会发送cookie的
      },
      success: function(res){
        if(res._id){
          // window.location.href = "/#/home"
        }
      }
   });
  }

  handlerInput(e){
    if(e.target.type === 'text'){
      this.setState({userName : e.target.value})
    }else{
      this.setState({...this.state,password : e.target.value})
    }
  }
  render() {
    // this.getUserInfo()
    return (
      <div className='login-page'>
        <div className='login-box'>
            <div><label>Username</label> <input type='text' onChange={this.handlerInput}/></div>
            <div><label>Password</label> <input type='password' onChange={this.handlerInput}/></div>
            <div className='login-btn'>
              <button onClick={this.login}>Sign in</button>
            </div>
        </div>
      </div>
    );
  }
}

//导航栏组件
class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // the string displayed in the button that is used to login/logout
      userId:'',
      userName:'',
      logButtonString : "Sign in",
      totalnum:0,
      searchstring :'',
      type:''
    }
    
    this.handlerInput = this.handlerInput.bind(this)
    this.handlerChange = this.handlerChange.bind(this)
    this.search = this.search.bind(this)
    this.logOut = this.logOut.bind(this)
    this.toCart = this.toCart.bind(this)
  }
  componentDidMount(){
    this.getUserInfo()
  }
  //搜索方法，显示搜索的类别和输入框内容，同时通过getDataList方法获取相关数据
  search(){
    console.log(this.state.searchstring)
    console.log(this.state.type)
    this.props.getDataList(this.state.searchstring,this.state.type)
  }
  // 更改类别
  handlerChange(e){
    this.setState({type : e.target.value})
    console.log({type : e.target.value})
  }
  // 输入框接收
  handlerInput(e){
    this.setState({searchstring : e.target.value})
    console.log({searchstring : e.target.value})
    console.log(this.state.searchstring)
  }
  // 登出，连接后端signout
  logOut(){
    $.ajax({
      type: "GET",
      url: "http://localhost:3001/signout",
      dataType: "JSON",
      crossDomain:true, //设置跨域为true
      xhrFields: {
          withCredentials: true //默认情况下，标准的跨域请求是不会发送cookie的
      },
      async: false
    }).done(function(response) {
      }.bind(this));
    // 刷新页面返回首页
   window.location.href = '/#/home';
   window.location.reload()
  }
  // 获取用户信息
  getUserInfo(){
    $.ajax({
      type: "GET",
      url: "http://localhost:3001/getsessioninfo",
      dataType: "JSON",
      crossDomain:true, //设置跨域为true
      xhrFields: {
          withCredentials: true //默认情况下，标准的跨域请求是不会发送cookie的
      },
      }).done(function(res) {
        if(res._id){
          this.setState({logButtonString:res.username,userId:res._id,totalnum:res.totalnum});
        }else{
          this.setState({userId:''});
        }
      }.bind(this));
  }
  // 导航到购物车
  toCart(){
    window.location.href = '/#/cart'
  }
  // 显示页面
  render() {
    const userId = this.state.userId;
 
    let button = null;
    // 如果没登录，就跳转到登录页面；如果登录了，就显示为登出按钮
    if (userId) {
      button = <div>
        <div>Hello {this.state.logButtonString}</div>
        <div>
          <div onClick={this.logOut} className="login-out">Sign out</div>
        </div>
      </div>;
    } else {
      button = <Link to={'/login'}><div>Sign in</div></Link>;
    }

    let cartInfo = null;
    if(userId){
      cartInfo = 
      <div className='header-car' onClick={this.toCart}>
          {/* <img src={imgURL} alt=""/> */}
          <span>{this.state.totalnum} in Cart</span>
      </div>
    }

    return (
      <header>
        <div className="title">Phones Tablets Laptops</div>
        <div className="login-name">
          {button}
        </div>
        <div className="search">
          <select onChange={this.handlerChange}>
            <option value="">ALL</option>      
            <option value="Phones">Phones</option>      
            <option value="Tablets">Tablets</option>      
            <option value="Laptops">Laptops</option>      
          </select>
          <input type="text" onChange={this.handlerInput}/>
          <button onClick={this.search} className="search-icon"><img src="http://127.0.0.1:3001/images/search.png" /></button>
        </div>
        <div className='cart-info'>
          {cartInfo}

        </div>
      </header>
    );
  }
}

