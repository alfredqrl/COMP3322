import React from 'react';
import './style.css';
import logoImg from "./logo.png"
import $ from 'jquery';

// Static React component defined as function
function Header() {
  return (
    <header>
      <img src={logoImg} alt="logo" width="128" height="128" />
      <h1>HKU<br/>Computer Science<br/>Course Management</h1>
    </header>
  );
}

function Nav() {
  return <nav><div>Welcome administrator</div></nav>
}

function Footer() {
  return <footer><div><a href="#top">Back to top</a></div></footer>
}

function CourseTableRow(props) {
  /* Step 10. Implement the function CourseTableRow */
}

function CourseTable(props) {
  return (
    <table className="center">
      <thead>
        <tr>
          <th>Course Name</th>
          <th>Credit</th>
          <th>Semester</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
      {
        props.courseInfo.map((course => {
          return <CourseTableRow 
                  /* Step 11. Fill in the missing attributes for CourseTableRow in the blank below */


                  // key is a special attribute React uses to identify list components
                  key={course._id} />
        }))
      }
      </tbody>
    </table>
  );
}

class UpdateForm extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      inputCourseName: "",
      inputCourseCredit: "",
      inputCourseSem: ""
    }

    this.handleInputChange = this.handleInputChange.bind(this)
    this.isInputFilled = this.isInputFilled.bind(this)
    this.addOrUpdateCourse = this.addOrUpdateCourse.bind(this)
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    // name correspond to the name attribute in the input tags
    const name = target.name;
    this.setState({[name]: value});
  }

  isInputFilled() {
    /* Step 12. Implement isInputFilled() */
  }

  addOrUpdateCourse() {
    /* Step 13. Implement addOrUpdateCourse() */
  }

  render() {
    return (
      <div id="update_form">
      <input
        type="text"
        name="inputCourseName"
        placeholder="Course Name"
        value={this.state.inputCourseName}
        onChange={this.handleInputChange} />
      <br/>
      <input
        type="text"
        name="inputCourseCredit"
        placeholder="Course Credit"
        value={this.state.inputCourseCredit}
        onChange={this.handleInputChange} />
      <br/>
      <input
        type="text"
        name="inputCourseSem"
        placeholder="Course Semester"
        value={this.state.inputCourseSem}
        onChange={this.handleInputChange} />
      <p>
        <button onClick={this.addOrUpdateCourse}>Add/Update Course</button>
      </p>
      </div>
    );
  }
}

class CoursesPage extends React.Component {
  constructor(props) {
    /* Step 7. Implement the constructor of CoursesPage */

  }

  showAllCourses() {
    /* Step 8. Implement the controller functions */
  }

  deleteCourse(id) {
    /* Step 8. Implement the controller functions */
  }

  componentDidMount() {
    /* Step 9. Invoke showAllCourses in componentDidMount() */
  }

  render() {
    return (
      <React.Fragment>
        <Header />
        <Nav />
        <section className="contents">
          <h2>Courses Overview</h2>
          <div>
            <CourseTable 
              courseInfo={this.state.courseInfo}
              deleteCourse={this.deleteCourse} />
          </div>
          <h2>Add/Update Course</h2>
          <UpdateForm
            courseInfo={this.state.courseInfo}
            showAllCourses={this.showAllCourses} />
        </section>
        <Footer />
      </React.Fragment>
    );
  }
}

export default CoursesPage;
