import React, { Fragment, useEffect, useState } from "react";
import Card from "../layout";
import Menu from "../components/menu";
import Footer from "../components/footer";
import { Link, useParams } from "react-router-dom";
import { API } from "aws-amplify";
import { Row, Col, Spinner } from "react-bootstrap";
import strings from "../localization/localization";
{}
function Start() {
  let { mfi }: any = useParams();
  useEffect(() => {
    const language: any = localStorage.getItem("language");
    if (language) {
      strings.setLanguage(language);
      setSelectedLanguage(language);
    } else {
      localStorage.setItem("language", "en");
    }
    getMFIData(mfi)
    // if (!mfi) {
  
    //   setEnterAPI(true);
    // }
  }, []);
  const [enterAPI, setEnterAPI] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [slogan, setSlogan] = useState("");
  const [welcomeMsg, setWelcomeMsg] = useState("");

  const getMFIData = async (mfi) => {
    const mfiData = await API.get("auth", "/api/mfi", {
      headers: { "Content-Type": "application/json" },
      queryStringParameters: { name: mfi?mfi:"roi" },
    }).then((response) => {
      localStorage.removeItem("mfiData");
      if (response) {
        localStorage.setItem("mfiData", JSON.stringify(response));
        setSlogan(response.slogan);
        setWelcomeMsg(response.welcomeMessage);
        setEnterAPI(true);
      } else {
        setEnterAPI(true);
      }
    });
  };
  const handleSelectLanguage = (e) => {
    localStorage.removeItem("language");
    localStorage.setItem("language", e.target.value);
    setSelectedLanguage(e.target.value);
    window.location.reload();
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
            <div className="app-page-title d-flex align-self-center">
             {enterAPI&&(<h1>{welcomeMsg?welcomeMsg:"COMMUNITY LENDING"}</h1>)} 
            </div>
            {enterAPI&&(<p className="my-4">{slogan?slogan:"Get a 0% Interest Loan Today"}</p>)}
            <div className="my-4">
              <Link to="/App/Register" className="app-primary-btn">
                {strings.getStart}
              </Link>
            </div>
            <div>
              <Link to={`/App/Login/${mfi?mfi:""}`} className="app-link">
                {strings.login}
              </Link>
            </div>
             <p className="mt-2">
              <select
                value={selectedLanguage}
                onChange={(e) => handleSelectLanguage(e)}
                className="form-control app-language-control"
              >
                <option value="en">English</option>
                <option value="be">Bengali</option>
                <option value="ar">Arabic</option>
              </select></p> 
          </Card>
          {enterAPI && (<Row className='justify-content-center'>
                <Col xl={7} lg={7} md={7} sm={12}><Footer/></Col></Row>)}
        </Fragment>
      )}
    </Fragment>
  );
}
export default Start;
