import React from 'react';

class DropDownList extends React.Component{
	render(){
		return(
			<div>
			<b>Choose one subject </b>

			{/* step 4 */}
			




			</div>
		)
	}
}


class NewNote extends React.Component{
	constructor(props) {
		super(props)
		this.state={
			inputNoteSubject: "",
			inputNoteContent: ""
		}

		this.handleInputChange = this.handleInputChange.bind(this)
	}

	handleInputChange(event){
		let target = event.target
		let name = target.name
		let value = target.value
    	this.setState({[name]: value})	
	}
	
	render(){
		return(
			<div>
			<p>
				<b>Add a new Note:</b>
			</p>
			<input
        	type="text"
			name="inputNoteSubject"
			placeholder="Note Subject"
			value={this.state.inputNoteSubject}
			onChange={e => this.handleInputChange(e)} />

			<input
        	type="text"
			name="inputNoteContent"
			placeholder="Note Content"
			value={this.state.inputNoteContent}
			onChange={e => this.handleInputChange(e)} />
			
			{/* step 7.1 */}




			</div>
		)
	}
}


class HintAndSubmit extends React.Component{
	constructor(props){
		super(props)
		this.handleClick = this.handleClick.bind(this)
	}

	handleClick(){
		let new_note = {subject: this.props.new_subject, content: `"${this.props.new_content}"`}
		// step 8
		

	
	}

	render(){
	// step 7.2	

		return


	}
}


class Lab7App extends React.Component{
	constructor(props) {
		super(props)
		this.state = {
			userNotes: userNotesDB,
			currentFilter: "all"
		}
		this.handleNotesChange = this.handleNotesChange.bind(this)
	}

	handleNotesChange(option){
	//step 5
		
			
		


	}

	render(){	
		const userNotes = this.state.userNotes
		return(
			<div>
				<h2>Lab7 Exercise</h2>
				<DropDownList handleNotesChange={this.handleNotesChange}/>
				{// step 3
					


					
				}
				<NewNote handleNotesChange={this.handleNotesChange}
							currentFilter={this.state.currentFilter}/>
			</div>
		)
	}
}

const userNotesDB = [
	{subject: 'science', content: '"This is note 1 for science"'},
	{subject: 'science', content: '"This is note 2 for science"'},
	{subject: 'science', content: '"This is note 3 for science"'},
	{subject: 'math', content: '"This is note 1 for math"'},
	{subject: 'math', content: '"This is note 2 for math"'},
	{subject: 'math', content: '"This is note 3 for math"'},
	{subject: 'culture', content: '"This is note 1 for culture"'},
	{subject: 'culture', content: '"This is note 2 for culture"'},
	{subject: 'culture', content: '"This is note 3 for culture"'},
];

export default Lab7App;
