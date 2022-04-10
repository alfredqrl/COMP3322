import React from 'react';
import ReactDOM from 'react-dom';

class CountdownTimer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {count: this.props.count};
  }
  
  componentDidMount() {
	  this.timerID = setInterval(()=>this.tick(), 1000);
  }

  tick(){
	  if (this.state.count > 0){
	  	this.setState((prevState, props)=>{
	  		return {count: prevState.count-1}
	  	});
	  } else {
		  clearInterval(this.timerID);
	  }
  }
  
  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  render() {
    return (
		<h2>Countdown Timer: {this.state.count}</h2>
    );
  }
}

ReactDOM.render(
	<CountdownTimer count="10" />, 
	document.getElementById('root')
);