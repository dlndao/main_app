import React, { Fragment, useState, useEffect } from "react";
import Card from "../layout";
import { Row, Col, Form, Spinner } from "react-bootstrap";
import { useHistory, useParams } from "react-router-dom";
import validator from "validator";
import { API, Auth } from "aws-amplify";
import Menu from "../components/menu";
import Footer from "../components/footer";
import strings from "../localization/localization";
import { useUserState } from "contexts/UserAuthContext";
import { toast } from "react-toastify";

function Register() {
  let history: any = useHistory();
  const { user }: any = useUserState();
  const [isClickable , setClickable] = useState(true)
  const [loading, setLoading] = useState(false);
  const handleClick = async () => {
    setShowErrors(true);
    try{
      if (
        state.inputs.firstName !== "" &&
        state.inputs.lastName !== "" &&
        state.inputs.email !== "" &&
        state.inputs.phoneNumber !== "" &&
        state.inputs.password !== "" &&
        state.inputs.confirmPassword !== "" && state.inputs.confirmPassword === state.inputs.password &&
        state.inputs.isPoliceRead
      ) {         
        if(state.inputs.password.length < 8 ){
          return
        }
        setLoading(true)
        const user = await checkIsUserExist(state.inputs.email ,state.inputs.phoneNumber )
       if(user)  {
          setLoading(false)
         return
        } 
        //congnito saving
  
        const registeredUser = await Auth.signUp({
          username: state.inputs.phoneNumber.trim().startsWith("+") ? state.inputs.phoneNumber.trim().toLowerCase() : "+" + state.inputs.phoneNumber.trim().toLowerCase(),
          password: state.inputs.password,
          attributes: {
            phone_number: state.inputs.phoneNumber.trim().startsWith("+") ? state.inputs.phoneNumber.trim().toLowerCase() : "+" + state.inputs.phoneNumber.trim().toLowerCase(),
          },
        });
  
  
        //DB saving
        await API.post("auth", `/api/users`, {
          headers: {},
          body: {
            firstName: state.inputs.firstName,
            lastName: state.inputs.lastName,
            phone: state.inputs.phoneNumber.trim().startsWith("+") ? state.inputs.phoneNumber.trim().toLowerCase() : "+" + state.inputs.phoneNumber.trim().toLowerCase(),
            email: state.inputs.email,
            bio: state.inputs.bio,
            username: registeredUser.userSub,
          },
        }).then((response) => {
        });
        await Auth.signOut({ global: true });
        const location = {
          pathname: "/App/VerifyCode",
          state: {
            phoneNumber: state.inputs.phoneNumber.trim().startsWith("+") ? state.inputs.phoneNumber.trim().toLowerCase() : "+" + state.inputs.phoneNumber.trim().toLowerCase(),
          },
        };
        setLoading(false)
        history.push(location);
      }
      
    }catch(error){
      setLoading(false);
      toast.error(error.message);
    }
  };
  const checkIsUserExist = async (email, phone) => {
    const isUser = await API.get("auth", "/api/auth/userExists", {
      headers: { "Content-Type": "application/json" },
      queryStringParameters: { email: email, phone: phone },
    });
    if (isUser.data.byEmail && isUser.data.byPhone){
      toast.warning(strings.phoneAndEmailAlreadyEx);
      return true ;
    }else if(isUser.data.byEmail) {       
        toast.warning(strings.emailAlreadyExist);
        return true ;
    }else if (isUser.data.byPhone){      
      toast.warning(strings.phoneAlreadyExist);
      return true ;
    }else return false    
  }
  const IntialInputs = () => ({
    inputs: {
      firstName: "",
      lastName: "",
      phoneNumber: "",
      email: "",
      bio: "",
      password: "",
      confirmPassword: "",
      isPoliceRead: false
    },
  });
  const [state, setState] = useState(IntialInputs());
  const [profileImg, setProfileImg] = useState("");
  const [saveClicked, setSaveClicked] = useState(false);
  const [showErrors, setShowErrors] = useState(false);


  const handleChange = (e) => {
    const { value, name } = e.target;
    const { inputs } = state;
    inputs[name] = value;
    setState({
      ...state,
      inputs,
    });
    if (validator.isEmpty(
      state.inputs.firstName &&      
      state.inputs.lastName && 
      state.inputs.phoneNumber && 
      state.inputs.password && 
      state.inputs.confirmPassword && 
      state.inputs.firstName 
      )){
          setClickable(true)       
    }else{
      if (state.inputs.isPoliceRead){
        setClickable(false)
      }else{
        setClickable(true)
      }      
    }    
  };

  const handleCheckboxChange = (e: any) => {
    const value = e.target.checked;
    const { name } = e.target;
    const { inputs } = state;

    inputs[name] = value;
    setState({
      ...state,
      inputs,
    });
    if (validator.isEmpty(
      state.inputs.firstName &&      
      state.inputs.lastName && 
      state.inputs.phoneNumber && 
      state.inputs.password && 
      state.inputs.confirmPassword && 
      state.inputs.firstName 
      )){
          setClickable(true)       
    }else{
      if (state.inputs.isPoliceRead){
        setClickable(false)
      }else{
        setClickable(true)
      }      
    }    
  }
  const upload = async (e) => {
    setProfileImg(URL.createObjectURL(e.target.files[0]));
  };
  let { mfi }: any = useParams();

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
  useEffect(() => {
    if (mfi) {
      getMFIData(mfi);
    } else {
      setEnterAPI(true);
    }
  }, []);
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
                <Col md={6} sm={12} className="text-left">
                  <Form.Group>
                    <Form.Control
                      type="text"
                      placeholder={strings.firstName}
                      name="firstName"
                      onChange={(e) => {
                        handleChange(e);
                      }}
                      value={state.inputs.firstName}
                    />
                    {showErrors === true &&
                      validator.isEmpty(state.inputs.firstName) && (
                        <div className="app-error-msg">{strings.required}</div>
                      )}
                  </Form.Group>
                </Col>
                <Col md={6} sm={12} className="text-left">
                  <Form.Group>
                    <Form.Control
                      type="text"
                      placeholder={strings.lastName}
                      name="lastName"
                      onChange={(e) => {
                        handleChange(e);
                      }}
                      value={state.inputs.lastName}
                    />
                    {showErrors === true &&
                      validator.isEmpty(state.inputs.lastName) && (
                        <div className="app-error-msg">{strings.required}</div>
                      )}
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col className="text-left">
                  <Form.Group>
                    <Form.Control
                      type="text"
                      placeholder={strings.phone}
                      name="phoneNumber"
                      onChange={(e) => {
                        handleChange(e);
                      }}
                      value={state.inputs.phoneNumber}
                    />
                    {showErrors === true &&
                      validator.isEmpty(state.inputs.phoneNumber) && (
                        <div className="app-error-msg">{strings.required}</div>
                      )}
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col className="text-left">
                  <Form.Group>
                    <Form.Control
                      type="email"
                      placeholder={strings.email}
                      name="email"
                      onChange={(e) => {
                        handleChange(e);
                      }}
                      value={state.inputs.email}
                    />
                    {showErrors === true &&
                      validator.isEmpty(state.inputs.email) && (
                        <div className="app-error-msg">{strings.required}</div>
                      )}
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col className="text-left">
                  <Form.Group>
                    <Form.Control
                      type="password"
                      placeholder={strings.password}
                      name="password"
                      onChange={(e) => {
                        handleChange(e);
                      }}
                      value={state.inputs.password}
                    />
                    {showErrors === true &&
                      validator.isEmpty(state.inputs.password)  ?(
                        <div className="app-error-msg">{strings.required}</div>
                      ) :
                      showErrors === true && state.inputs.password.length < 8 &&(
                        <div className="app-error-msg">{strings.passwordLengthErrorMsg}</div>
                      )
                    } 
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col className="text-left">
                  <Form.Group>
                    <Form.Control
                      type="password"
                      placeholder={strings.confirmPassword}
                      name="confirmPassword"
                      onChange={(e) => {
                        handleChange(e);
                      }}
                      value={state.inputs.confirmPassword}
                    />
                    {showErrors === true &&
                      validator.isEmpty(state.inputs.confirmPassword) && (
                        <div className="app-error-msg">{strings.required}</div>
                      )}
                    {showErrors === true &&
                      !validator.isEmpty(state.inputs.confirmPassword) &&
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
                    <Form.Control
                      type="text"
                      as="textarea"
                      placeholder={strings.myBio}
                      name="bio"
                      onChange={(e) => {
                        handleChange(e);
                      }}
                      value={state.inputs.bio}
                    />

                  </Form.Group>
                </Col>
              </Row>
              {/* <Row>
            <Col>
              <Form.Group>
                <label
                  htmlFor="contained-button-file"
                  className="cursor-pointer"
                >
                  <span className="app-link">{strings.profileImage}</span>
                </label>
                <input
                  className="d-none"
                  id="contained-button-file"
                  type="file"
                />
              </Form.Group>
            </Col>
          </Row> */}
              <Row>
                <Col className="text-left">
                  <Form.Group>
                    <Form.Check
                      type="checkbox"
                      label="I have read and agree to the Terms of Service and Privacy Policy."
                      checked={state.inputs.isPoliceRead}
                      onChange={handleCheckboxChange}
                      name="isPoliceRead"
                    />
                    {showErrors === true &&
                      state.inputs.isPoliceRead === false && (
                        <div className="app-error-msg">{strings.required}</div>
                      )}
                  </Form.Group>
                </Col>
              </Row>
              <button
                type="button"
                className="app-primary-btn"
                onClick={handleClick}
                disabled= {isClickable}
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
                  strings.createProfile
                )}
              </button>
            </Form>
          </Card>
          <Row className='justify-content-center'>
            <Col xl={7} lg={7} md={7} sm={12}><Footer /></Col></Row>
        </Fragment>
      )}
    </Fragment>
  );
}
export default Register;
