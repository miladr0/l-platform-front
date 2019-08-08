import React from 'react'
import {Card, Row, Col} from 'antd';

const EmptyLoading = () => {
    return (
        <Row>
          <Col span={24}>
            <Card loading={true} style={{ height: "100vh" }} />
          </Col>
        </Row>
      );
}

export default EmptyLoading;