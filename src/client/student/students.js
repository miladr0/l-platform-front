import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import {
  Table,
  Avatar,
  Form,
  Card,
  Icon,
  Statistic,
  Row,
  Col,
  Input,
  Button,
  Tag
} from "antd";
import "antd/dist/antd.css";
import moment from "moment";
import { apiPath } from "../../config";
import queryString from "query-string";

import {
  $pageSize,
  $page,
  $setSort,
  $setQueryParams,
  ORGANIZERS_INDEX_REQUEST,
  $setSearchKeys
} from "./students.redux";

import EmptyLoading from "../loading/EmptyLoading";

const formControl = {
  marginTop: "50px"
};

class OrganizersIndexView extends Component {
  componentDidMount() {
    let queryParams = queryString.parse(this.props.location.search);
    if (!queryParams) queryParams = null;
    this.props.onRequestOrganizers(queryParams);
  }

  getColumnSearchProps = dataIndex => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={node => {
            this.searchInput = node;
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => this.handleSearch(selectedKeys, confirm)}
          style={{ width: 188, marginBottom: 8, display: "block" }}
        />
        <Button
          type="primary"
          onClick={() => this.handleSearch(selectedKeys, confirm)}
          icon="search"
          size="small"
          style={{ width: 90, marginRight: 8 }}
        >
          Search
        </Button>
        <Button
          onClick={() => this.handleReset(clearFilters)}
          size="small"
          style={{ width: 90 }}
        >
          Reset
        </Button>
      </div>
    ),
    filterIcon: filtered => (
      <Icon type="search" style={{ color: filtered ? "#00BCD4" : "#00BCD4" }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => this.searchInput.select());
      }
    },
    render: text => text
  });

  handleSearch = (selectedKeys, confirm) => {
    confirm();
    this.props.$setSearchKeys(selectedKeys[0]);
    // this.setState({ searchText:  });
  };

  handleReset = clearFilters => {
    clearFilters();
    this.props.$setSearchKeys();
  };

  // PAGINATION OPTIONS
  paginationOptions = {
    showSizeChanger: true,
    showQuickJumper: true,
    onShowSizeChange: (_, pageSize) => {
      this.props.$pageSize(pageSize);
      this.props.onRequestOrganizers();
    },
    onChange: page => {
      this.props.$page(page, this.props.meta);
      this.props.onRequestOrganizers();
    },
    pageSizeOptions: this.props.meta.pageSizeOptions,
    total: this.props.meta.total,
    showTotal: (total, range) => `${range[0]} to ${range[1]} of ${total}`
  };


  handleSortChange = (pagination, filters, sorter) => {
    let sort;
    if (sorter.order === "descend") {
      sort = "DESC";
    } else {
      sort = "ASC";
    }
    this.props.$handleSort(sort, sorter.columnKey);
  };

  render() {
    console.log(this.props);
    const pagination = {
      ...this.paginationOptions,
      total: this.props.meta.total,
      current: this.props.meta.page,
      pageSize: this.props.meta.pageSize
    };

    const columns = [
      {
        title: "id",
        key: "id",
        render: (text, record) => record.id
      },
      {
        title: "Email",
        key: "email",
        render: (text, record) => record.email
      },
      {
        title: "Phone",
        key: "phone",
        render: (text, record) => record.phone
      },
      {
        title: "Action",
        key: "action",
        render: (text, record) => (
          <span>
            <Link to={`/dashboard/organizers/${record._id}`}>
              View Students
            </Link>
          </span>
        )
      }
    ];

    if (this.props.data) {
      return (
        <div style={formControl}>
          <Row gutter={16}>
            <Col span={6}>
              <Card title="Total Number of Customers" bordered={true}>
                <Statistic
                  title="So Far"
                  prefix={<Icon type="user" />}
                  value={this.props.meta.total}
                />
              </Card>
            </Col>
          </Row>

          <Table
            style={{ backgroundColor: "white", flex: 1 }}
            dataSource={this.props.data}
            pagination={pagination}
            columns={columns}
            onChange={this.handleSortChange}
            loading={this.props.loading}
          />
        </div>
      );
    } else {
      return <EmptyLoading />;
    }
  }
}
const mapStateToProps = state => {
  console.log(state);
  return {
    data: state.customers.data,
    loading: state.customers.loading,
    meta: state.customers.meta
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onRequestOrganizers: (queryParams = null) => {
      console.log(queryParams);
      if (queryParams) dispatch($setQueryParams(queryParams));

      dispatch({ type: ORGANIZERS_INDEX_REQUEST });
    },
    $page: (page, meta) => dispatch($page(page, meta)),
    $pageSize: pageSize => dispatch($pageSize(pageSize)),
    $handleSort: (sort, sortBy) => {
      dispatch($setSort(sort, sortBy));
      dispatch({ type: ORGANIZERS_INDEX_REQUEST });
    },
    $setSearchKeys: (searchKeys = null) => {
      dispatch($setSearchKeys(searchKeys));
      dispatch({ type: ORGANIZERS_INDEX_REQUEST });
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OrganizersIndexView);
