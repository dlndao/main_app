import React, { Fragment, useEffect, useState } from "react";
import Card from "../layout";
import { Row, Col, Form, Spinner } from "react-bootstrap";
import { useHistory, useParams, withRouter } from "react-router-dom";
import { API, Auth } from "aws-amplify";
import Menu from "../components/menu";
import strings from "../localization/localization";
import Footer from "../components/footer";

function VerifyCode(props) {
  let history: any = useHistory();
  let { mfi }: any = useParams();

  const IntialInputs = () => ({
    inputs: {
      verifyCode: "",
    },
  });
  const [state, setState] = useState(IntialInputs());
  const [loading, setLoading] = useState(false);
  const [showErrors, setShowErrors] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");

  const handleClick = async () => {
    setShowErrors(true);
    let result: any;
    if (state.inputs.verifyCode !== "") {
      result = await Auth.confirmSignUp(phoneNumber, state.inputs.verifyCode);
      setShowErrors(false);

      if (result === 'SUCCESS') {
        let storage: any = localStorage.getItem("mfiData");
  let mfiData: any = storage ? JSON.parse(storage) : null;
  if(mfiData?.name||mfi){
    history.push(`/App/Login/${mfi?mfi:mfiData?.name}`);
  }
  else{
    history.push(`/App/Login`);
  }
      }
    }
  };
  useEffect(() => {
    const _phoneNumber = props.location?.state?.phoneNumber;
    setPhoneNumber(_phoneNumber);
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
  const handleResend = async (e) => {
    await Auth.resendSignUp(phoneNumber);
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
                    <Form.Control
                      type="text"
                      placeholder={strings.verifyCode}
                      value={state.inputs.verifyCode}
                      name="verifyCode"
                      onChange={(e) => {
                        handleChange(e);
                      }}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row className="justify-content-between">
                <Col className="text-left">
                  <button
                    type="button"
                    className="app-primary-btn"
                    onClick={handleClick}
                    disabled={state.inputs.verifyCode.length <= 0}
                  >
                    {loading ? (
                      <Spinner
                        className="mr-1 dln-button-loader"
                        as="span"
                        animation="border"
                        role="status"
                        aria-hidden="true"
                      />
                    ) : (
                      strings.verify
                    )}
                  </button>
                </Col>
                <Col className="text-right">
                  <button className="btn app-link" onClick={handleResend}>
                    Resend Code
                  </button>
                </Col>
              </Row>
            </Form>
          </Card>
          <Row className='justify-content-center'>
                <Col xl={7} lg={7} md={7} sm={12}><Footer/></Col></Row>
        </Fragment>
      )}
    </Fragment>
  );
}
export default withRouter(VerifyCode);
