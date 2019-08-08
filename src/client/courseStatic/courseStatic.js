import React, { Component } from "react";
import { connect } from "react-redux";
import {
  Table,

} from "antd";
import "antd/dist/antd.css";
import {
  SINGLE_USER_REQUEST,
  $setUserId,
  REQUEST_SUBSCRIPTION,
  $setSubscriptionStatus
} from "./courseStatic.redux";
import EmptyLoading from "../loading/EmptyLoading";

const formControl = {
  marginTop: "50px"
};
const pStyle = {
  fontSize: 16,
  color: "rgba(0,0,0,0.85)",
  lineHeight: "24px",
  display: "block",
  marginBottom: 16
};

class User extends Component {
  componentDidMount() {
    this.props.getUserInfo(
      this.props.match.params.studentId,
      this.props.match.params.courseId
    );
  }

  render() {

    const columns = [
      {
        title: "student id",
        key: "student_id",
        render: (text, record) => record.student_id
      },
      {
        title: "Module id",
        key: "module_id",
        render: (text, record) => record.module_id
      },
      {
        title: "Question id",
        key: "question_id",
        render: (text, record) => record.question_id
      },
      {
        title: "Correct answer",
        key: "correct_ans",
        render: (text, record) => record.correct_ans
      },
      {
        title: "Student answer",
        key: "answer",
        render: (text, record) => record.answer
      },
    ];

    console.log(this.props);
    if (this.props.data) {
      return (
        <div style={formControl} loading="true">
          <p style={pStyle}>Correct Percentage: {this.props.data.correctPercentage}</p>
          <p style={pStyle}>Total Correct: {this.props.data.totalCorrect}</p>
          <p style={pStyle}>Total Question: {this.props.data.totalQuestion}</p>

          <Table
            style={{ backgroundColor: "white", flex: 1 }}
            dataSource={this.props.data.answers}
            columns={columns}
          />
        </div>
      );
    } else {
      return <EmptyLoading />;
    }
  }
}
const mapStateToProps = state => {
  return {
    data: state.courseStatic.info,
    loading: state.courseStatic.loading
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getUserInfo: (userId, courseId) => {
      console.log(userId, courseId);
      dispatch($setUserId(userId, courseId));
      dispatch({ type: SINGLE_USER_REQUEST });
    },
    setSubscription: status => {
      dispatch($setSubscriptionStatus(status));
      dispatch({ type: REQUEST_SUBSCRIPTION });
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(User);
