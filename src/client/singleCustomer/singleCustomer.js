import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Table, Avatar, Row, Col } from "antd";
import "antd/dist/antd.css";
import { apiPath } from "../../config";

import {
  SINGLE_REPORT_EVENT_INDEX_REQUEST,
  $page,
  $pageSize,
  $setEventId
} from "./singleCustomer.redux";

import EmptyLoading from "../loading/EmptyLoading";

const formControl = {
  marginTop: "50px"
};
const DescriptionItem = ({ title, content }) => (
  <div
    style={{
      fontSize: 14,
      lineHeight: "22px",
      marginBottom: 7,
      color: "rgba(0,0,0,0.65)"
    }}
  >
    <p
      style={{
        marginRight: 8,
        display: "inline-block",
        color: "rgba(0,0,0,0.85)"
      }}
    >
      {title}:
    </p>
    {content}
  </div>
);

class SingleReportEvents extends Component {
  componentDidMount() {
    const { customerId } = this.props.match.params;
    console.log(this.props);
    this.props.onRequestReportEvents(customerId);
  }


  // PAGINATION OPTIONS
  // PAGINATION OPTIONS
  paginationOptions = {
    showSizeChanger: true,
    showQuickJumper: true,
    onShowSizeChange: (_, pageSize) => {
      this.props.$pageSize(pageSize);
      this.props.onRequestReportEvents();
    },
    onChange: page => {
      this.props.$page(page, this.props.meta);
      this.props.onRequestReportEvents();
    },
    pageSizeOptions: this.props.meta.pageSizeOptions,
    total: this.props.meta.total,
    showTotal: (total, range) => `${range[0]} to ${range[1]} of ${total}`
  };

  render() {
    const pagination = {
      ...this.paginationOptions,
      total: this.props.meta.total,
      current: this.props.meta.page,
      pageSize: this.props.meta.pageSize
    };

    const columns = [
      {
        title: "Student Id",
        key: "st_id",
        render: (text, record) => (
          <span>
              {record.st_id}
          </span>
        )
      },
      {
        title: "start time",
        key: "st_id",
        render: (text, record) => (
          <span>
              {record.start_time}
          </span>
        )
      },
      {
        title: "course id",
        key: "title",
        render: (text, record) => (
          <span>
              {record.course_id}
          </span>
        )
      },
      {
        title: "teacher name",
        key: "teacher_name",
        render: (text, record) => (
          <span>
              {record.teacher_name}
          </span>
        )
      },
      {
        title: "Open course statics",
        key: "action",
        render: (text, record) => (
          <span>
            <Link to={`/dashboard/students/course-statics/${record.st_id}/${record.course_id}`}>
              View course statics
            </Link>
          </span>
        )
      }
    ];

    if (this.props.data) {
      return (
        <div style={formControl}>
          <Row>
            <Col span={12}>
              <DescriptionItem
                title="email"
                content={this.props.data[0].email}
              />{" "}
            </Col>
            <Col span={12}>
            <DescriptionItem
                title="phone"
                content={this.props.data[0].phone}
              />
            </Col>
          </Row>

          <Table
            style={{ backgroundColor: "white", flex: 1 }}
            dataSource={this.props.data}
            pagination={pagination}
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
    data: state.singleCustomer.data,
    meta: state.singleCustomer.meta
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onRequestReportEvents: (customerId = null) => {
      if(customerId)
      dispatch($setEventId(customerId));
      dispatch({ type: SINGLE_REPORT_EVENT_INDEX_REQUEST });
    },

    $page: (page, meta) => dispatch($page(page, meta)),
    $pageSize: pageSize => dispatch($pageSize(pageSize)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SingleReportEvents);
