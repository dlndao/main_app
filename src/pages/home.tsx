import React, { Fragment, useEffect, useState } from "react";
import Borrow from "./borrow";
import Invest from "./invest";
import Repaid from "./repaid";
import Ignored from "./ignored";
import { Row, Col, Tabs, Tab } from "react-bootstrap";
import strings from "../localization/localization";
import Footer from "../components/footer";

function Home() {
  const [investText, setInvestText] = useState("");
  const [borrowText, setBorrowText] = useState("");
  const [repaidText, setRepaidText] = useState("");
  const [ignoredText, setIgnoredText] = useState("");
  const [selectedKey, setSelectedKey] = useState("borrow");
  useEffect(() => {
    (async () => {
      const language: any = localStorage.getItem("language");
      if (language) {
        strings.setLanguage(language);
        setInvestText(strings.invest);
        setBorrowText(strings.borrow);
        setRepaidText(strings.repaid);
        setIgnoredText(strings.ignored);
      }
    })();
  }, []);
  const removeClass = () => {
    let tooltip = document.getElementsByClassName("dln-poppver-tooltip");
    if (tooltip) {
      for (var ele of tooltip) {
        ele.classList.add("d-none");
        ele.classList.remove("show");
      }
    }
  };
  const handleSelectTab=(key,e)=>{
    setSelectedKey(key);
    removeClass()
  }
  return (
    <Fragment>
      <Row className="justify-content-center app-nav-containers">
        <Col xl={7} lg={7} md={7} sm={12}>
          <Tabs
            defaultActiveKey="borrow"
            transition={false}
            id="noanim-tab-example"
            className="app-nav-tabs d-flex justify-content-around"
            onSelect={(key,e) => handleSelectTab(key,e)}
          >
            <Tab eventKey="borrow" title={borrowText}>
             {selectedKey==="borrow" &&  <Borrow />}
            </Tab>

            <Tab eventKey="repaid" title={repaidText}>
             {selectedKey==="repaid" &&  <Repaid />}
            </Tab>
            <Tab eventKey="invest" title={investText}>
             {selectedKey==="invest" &&  <Invest />}
            </Tab>
            <Tab eventKey="ignored" title={ignoredText}>
             {selectedKey==="ignored" &&  <Ignored />}
            </Tab>
          </Tabs>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col xl={7} lg={7} md={7} sm={12}>
          <Footer />
        </Col>
      </Row>
    </Fragment>
  );
}
export default Home;
