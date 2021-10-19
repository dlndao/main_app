import React, { Fragment, useEffect, useState } from "react";
import Card from "../layout";
import { Row, Col, Form, Spinner } from "react-bootstrap";
import { useHistory, useParams, withRouter } from "react-router-dom";
import { API, Auth } from "aws-amplify";
import Menu from "../components/menu";
import strings from "../localization/localization";
import validator from "validator";
import Footer from "../components/footer";

function ResetPassword(props) {
  let history: any = useHistory();
  let { mfi }: any = useParams();

  const IntialInputs = () => ({
    inputs: {
      confirmPassword: "",
      password: "",
      code: ''
    },
  });
  const [state, setState] = useState(IntialInputs());
  const [loading, setLoading] = useState(false);
  const [showErrors, setShowErrors] = useState(false);

  const handleClick = async () => {
    setShowErrors(true);
    if (state.inputs.confirmPassword === state.inputs.password && state.inputs.password.length >= 8 && state.inputs.code != '') {
      const identity = props.location.props.state?.inputs;
      
      
      try {
        setLoading(true);
        let getUser = await Auth.forgotPasswordSubmit(`+${identity.phone}`, state.inputs.code, state.inputs.password);
        
        let storage: any = localStorage.getItem("mfiData");
        let mfiData: any = storage ? JSON.parse(storage) : null;
        if (mfiData?.name || mfi) {
          history.push(`/App/Login/${mfi ? mfi : mfiData?.name}`);
        }
        else {
          history.push(`/App/Login`);
        }
        setLoading(false);
      } catch (err) {
        alert(err.message ? err.message : err)
        setLoading(false);
      }
    setShowErrors(false);
  }
};
useEffect(() => {
  const language: any = localStorage.getItem("language");
  if (language) {
    strings.setLanguage(language);
  }
  
  if (mfi) {
    getMFIData(mfi);
  } else {
    setEnterAPI(true);
  }
}, []);
const [enterAPI, setEnterAPI] = useState(false);
const getMFIData = async (mfi) => {
  const mfiData = await API.get("auth", "/api/mfi", {
    headers: { "Content-Type": "application/json" },
    queryStringParameters: { name: mfi },
  }).then((response) => {
    localStorage.removeItem("mfiData");
    if (response) {
      localStorage.setItem("mfiData", JSON.stringify(response));
      setEnterAPI(true);
    } else {
      setEnterAPI(true);
    }
  });
};

const handleChange = (e) => {
  const { value, name } = e.target;
  const { inputs } = state;

  inputs[name] = value;
  setState({
    ...state,
    inputs,
  });
};
return (
  <Fragment>
    {!enterAPI ? (
      <Row>
        <Col>
          <div className="app-page-loader app-all-page-loader py-5">
            <div className="dln-spinner-body pt-0 ">
              <Spinner
                className="mr-1 app-page-spinner"
                as="span"
                animation="border"
                role="status"
                aria-hidden="true"
              />
            </div>
          </div>
        </Col>
      </Row>
    ) : (
      <Fragment>
        {enterAPI && <Menu isStart={true} />}
        <Card>
          <Form className="app-form">
            <Row>
              <Col className="text-left">
                <Form.Group>
                  <Form.Label>{strings.password}</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder={strings.password}
                    value={state.inputs.password}
                    name="password"
                    onChange={(e) => {
                      handleChange(e);
                    }}
                  />
                  {showErrors === true &&
                    state.inputs.password.length < 8 && (
                      <div className="app-error-msg">
                        {strings.passwordLengthErrorMsg}
                      </div>
                    )}
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col className="text-left">
                <Form.Group>
                  <Form.Label>{strings.confirmPassword}</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder={strings.confirmPassword}
                    value={state.inputs.confirmPassword}
                    name="confirmPassword"
                    onChange={(e) => {
                      handleChange(e);
                    }}
                  />
                  {showErrors === true &&
                    !validator.equals(
                      state.inputs.password,
                      state.inputs.confirmPassword
                    ) && (
                      <div className="app-error-msg">
                        {strings.ConfirmpasswordNotMatchedPassword}
                      </div>
                    )}
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col className="text-left">
                <Form.Group>
                  <Form.Label>{strings.verifyCode}</Form.Label>
                  <Form.Control type="text" placeholder={strings.verifyCode} value={state.inputs.code} name="code" onChange={(e) => {
                    handleChange(e);
                  }} />
                </Form.Group>
              </Col>
            </Row>
            <button
              type="button"
              className="app-primary-btn"
              onClick={handleClick}
              disabled={
                state.inputs.password.length <= 0 ||
                state.inputs.confirmPassword.length <= 0 ||
                loading
              }
            >
              {strings.resetPassword}
            </button>
          </Form>
        </Card>
        <Row className="justify-content-center">
          <Col xl={7} lg={7} md={7} sm={12}>
            <Footer />
          </Col>
        </Row>
      </Fragment>
    )}
  </Fragment>
);
}
export default withRouter(ResetPassword);
