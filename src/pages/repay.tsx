import React, { Fragment } from "react";
import Card from "../layout";
import { Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import strings from "../localization/localization";

function Repay() {
  return (
    <Fragment>
      <Row>
        <Col>
          <h1 className="app-page-title">Repay</h1>
        </Col>
      </Row>

      <Card className="mt-3 app-card-has-title" cardClassName="py-3">
        <div className="app-card-title d-flex align-self-center">
          <h3>Outstanding Loans</h3>
        </div>
        <div className="mb-3 align-self-center text-left app-card-points">
          <div>1.Select loan </div>
          <div> 2.Enter amount</div>
        </div>
        <table className="app-table">
          <thead>
            <th>Balance</th>
            <th>Name</th>
            <th>Value</th>
          </thead>
          <tbody>
            <tr>
              <td>-₦200</td>
              <td>New Bike</td>
              <td>₦500</td>
            </tr>
            <tr>
              <td>-₦700</td>
              <td>New Roof</td>
              <td>₦700</td>
            </tr>
          </tbody>
        </table>
      </Card>
      <Card className="app-multi-cards" cardClassName="py-3">
        <div className="app-card-title d-flex align-self-center">
          <h3>{strings.repaymentAmount}</h3>
        </div>
        <div className="app-card-title d-flex align-self-center text-left">
          <span className="app-text-blue app-fz-60">₦</span>
          <input type="number" className="app-currency-amount" />
        </div>{" "}
      </Card>
      <Row className="justify-content-center mt-3">
        <Col xl={3} lg={4} md={8} sm={12}  className="align-self-center">
          <Row>
            <Col className="align-self-center text-left">
              <Link to="/App/Home" className="app-link">
                {strings.goBack}
              </Link>
            </Col>
            <Col className="align-self-center text-right">
              <button className="app-primary-btn">Confirm</button>
            </Col>
          </Row>
        </Col>
      </Row>

    </Fragment>
  );
}
export default Repay;
