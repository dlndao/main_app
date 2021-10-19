import React, { Fragment, useState, useEffect, useRef } from "react";
import { Row, Col, Overlay, Tooltip } from "react-bootstrap";
import {
  bakedIcon ,
fundedIcon ,
publishIcon , 
draftIcon,
lockIcon ,
repayIcon ,
bakedActiveIcon ,
fundedActiveIcon ,
publishActiveIcon,
draftActiveIcon ,
lockActiveIcon ,
repayActiveIcon ,
allIcon  ,
plusIcon 
} from "../Assets/Images";
import { Tooltip as MaterialToolTip } from '@material-ui/core';
import strings from "../localization/localization";

function FilterationBar({isAddShow,isDraftShow,handleFilter,handleAddButton,parentClickedFilter="",isShowRepaid=true}) {

  const [isDemoMode, setIsDemoMode] = useState(false);
  const [isbuttonClicked, setIsbuttonClicked] = useState(false);
  const [isallbuttonClicked, setIsallbuttonClicked] = useState(false);
  const [isdraftbuttonClicked, setIsdraftbuttonClicked] = useState(false);
  const [isrepaybuttonClicked, setIsrepaybuttonClicked] = useState(false);
  const [ispublishbuttonClicked, setIspublishbuttonClicked] = useState(false);
  const [isfundedbuttonClicked, setIsfundedbuttonClicked] = useState(false);
  const [islockedbuttonClicked, setIslockedbuttonClicked] = useState(false);
  const [isbakedbuttonClicked, setIsbakedbuttonClicked] = useState(false);
  const [clickedFilter, setClickedFilter] = useState("");
  ///


  const addproposal = useRef(null);
  const allFilter = useRef(null);
  const draftproposal = useRef(null);
  const publishproposal = useRef(null);
  const lockproposal = useRef(null);
  const bakeproposal = useRef(null);
  const fundproposal = useRef(null);
  const repayproposal = useRef(null);
  const handleAddProposal = () => {
    const DemoMode: any = localStorage.getItem("IsDemoMode");
    if (DemoMode === "true") {
      removeClickIcons();
      setIsDemoMode(DemoMode === "true" ? true : false);
      setIsbuttonClicked(!isbuttonClicked);
    } else {
      removeClickIcons();
      handleAddButton();
      removeClass();
    }
  };
  const removeClass = () => {
    let tooltip = document.getElementsByClassName("dln-poppver-tooltip");
    if (tooltip) {
      for (var ele of tooltip) {
        ele.classList.add("d-none");
        ele.classList.remove("show");
      }
    }
  };
 
  const removeClickIcons = () => {
    setIsallbuttonClicked(false);
    setIsbuttonClicked(false);
    setIsrepaybuttonClicked(false);
    setIsfundedbuttonClicked(false);
    setIsdraftbuttonClicked(false);
    setIslockedbuttonClicked(false);
    setIsbakedbuttonClicked(false);
    setIspublishbuttonClicked(false);
  };

  const handleClickFilter = (filter) => {
    
    const DemoMode: any = localStorage.getItem("IsDemoMode");
    if (DemoMode === "true") {
      removeClickIcons();
      setIsDemoMode(DemoMode === "true" ? true : false);
      if (filter == "drafted") {
        setIsdraftbuttonClicked(!isdraftbuttonClicked);
      } else if (filter == "published") {
        setIspublishbuttonClicked(!ispublishbuttonClicked);
      } else if (filter == "locked") {
        setIslockedbuttonClicked(!islockedbuttonClicked);
      } else if (filter == "baked") {
        setIsbakedbuttonClicked(!isbakedbuttonClicked);
      } else if (filter == "funded") {
        setIsfundedbuttonClicked(!isfundedbuttonClicked);
      } else if (filter == "repaid") {
        setIsrepaybuttonClicked(!isrepaybuttonClicked);
      } else {
        setIsallbuttonClicked(!isallbuttonClicked);
      }
    } else {
      removeClass();
      removeClickIcons();
      handleFilter(filter);
    }
  };
  useEffect(() => {
    (async () => {
      const language: any = localStorage.getItem("language");
      if (language) {
        strings.setLanguage(language);
      }
    })();
  }, []);
  return (
    <Fragment>
          <Row className="mt-3 app-filter-bar">
            {isAddShow&&  <div className="pl-0 col-auto d-flex align-self-end">
            <div className="app-action-container">
            <MaterialToolTip
            PopperProps={{ disablePortal: true }} 
                    classes={{
                      tooltip: isDemoMode ? 'd-none' : 'dln-tooltip',
                      arrow: 'dln-tooltip-arrow',
                    }}
                    arrow
                    placement='top'
                    title={strings.addNewProposal}
                  >
                <img
                  className="app-action-icon"
                  src={plusIcon}
                  alt="icon"
                  onClick={handleAddProposal}
                  ref={addproposal}
                />
                </MaterialToolTip>
                <Overlay
                  target={addproposal}
                  show={isDemoMode === true && isbuttonClicked === true}
                  placement="top"
                >
                  {(props) => (
                    <Tooltip
                      id="overlay-add"
                      className="dln-poppver-tooltip"
                      {...props}
                    >
                     {strings.addNewProposal}
                      <p>
                        {strings.addNewProposalDesc}
                      </p>
                    </Tooltip>
                  )}
                </Overlay>
              </div>
            </div>}
            <div className="pl-0 col-auto d-flex align-self-end">
              <div className="app-action-container">
              <MaterialToolTip
              PopperProps={{ disablePortal: true }} 
                    classes={{
                      tooltip: isDemoMode ? 'd-none' : 'dln-tooltip',
                      arrow: 'dln-tooltip-arrow',
                    }}
                    arrow
                    placement='top'
                    title={strings.allProposals}
                  >
                <img
                  className="app-action-icon"
                  src={allIcon}
                  alt="icon"
                  onClick={(e) => handleClickFilter("all")}
                  ref={allFilter}
                />
                </MaterialToolTip>
                <Overlay
                  target={allFilter}
                  show={isDemoMode === true && isallbuttonClicked === true}
                  placement="top"
                >
                  {(props) => (
                    <Tooltip
                      id="overlay-all"
                      className="dln-poppver-tooltip"
                      {...props}
                    >
                      {strings.allProposals}
                      <p>
                      {strings.allProposalsDesc}
                      </p>
                    </Tooltip>
                  )}
                </Overlay>
              </div>
            </div>
            <div className={isDraftShow?"col app-progress-filter":"col-auto app-progress-filter"}>
              <div className="app-text-gray">{strings.progress}</div>
              <div className="app-filters-container">
             {isDraftShow&&(  <Fragment>
              <MaterialToolTip
              PopperProps={{ disablePortal: true }} 
                    classes={{
                      tooltip: isDemoMode ? 'd-none' : 'dln-tooltip',
                      arrow: 'dln-tooltip-arrow',
                    }}
                    arrow
                    placement='top'
                    title={strings.selectDraftedProposals}
                  >
                <img id="drafted"
                  className={`app-action-icon`}
                  src={parentClickedFilter==="drafted"?draftActiveIcon:draftIcon}
                  alt="icon"
                  onClick={(e) => handleClickFilter("drafted")}
                  ref={draftproposal}
                />
                </MaterialToolTip>
                <Overlay
                  target={draftproposal}
                  show={isDemoMode === true && isdraftbuttonClicked === true}
                  placement="top"
                >
                  {(props) => (
                    <Tooltip
                      id="overlay-draft"
                      className="dln-poppver-tooltip"
                      {...props}
                    >
                     {strings.selectDraftedProposals}
                      <p>
                        {strings.selectDraftedProposalsDesc}
                      </p>
                    </Tooltip>
                  )}
                </Overlay></Fragment>)}
                <MaterialToolTip
                PopperProps={{ disablePortal: true }} 
                    classes={{
                      tooltip: isDemoMode ? 'd-none' : 'dln-tooltip',
                      arrow: 'dln-tooltip-arrow',
                    }}
                    arrow
                    placement='top'
                    title={strings.selectPublishedProposals}
                  >
                <img
                  className="app-action-icon"
                  src={parentClickedFilter==="published"?publishActiveIcon:publishIcon}

                  alt="icon"
                  onClick={(e) => handleClickFilter("published")}
                  ref={publishproposal}
                />
                </MaterialToolTip>
                <Overlay
                  target={publishproposal}
                  show={isDemoMode === true && ispublishbuttonClicked === true}
                  placement="top"
                >
                  {(props) => (
                    <Tooltip
                      id="overlay-publish"
                      className="dln-poppver-tooltip"
                      {...props}
                    >
                      {strings.selectPublishedProposals}
                      <p>
                      {strings.selectPublishedProposalsDesc}
                      </p>
                    </Tooltip>
                  )}
                </Overlay>
              </div>
            </div>
            <Col className="px-0">
              <div className="app-text-gray">{strings.active}</div>
              <div className="app-filters-container mr-0">
              <MaterialToolTip
              PopperProps={{ disablePortal: true }} 
                    classes={{
                      tooltip: isDemoMode ? 'd-none' : 'dln-tooltip',
                      arrow: 'dln-tooltip-arrow',
                    }}
                    arrow
                    placement='top'
                    title={strings.selectLockedProposals}
                  >
                <img
                  className="app-action-icon"
                  src={parentClickedFilter==="locked"?lockActiveIcon:lockIcon}

                  alt="icon"
                  onClick={(e) => handleClickFilter("locked")}
                  ref={lockproposal}
                />
                </MaterialToolTip>
                <Overlay
                  target={lockproposal}
                  show={isDemoMode === true && islockedbuttonClicked === true}
                  placement="top"
                >
                  {(props) => (
                    <Tooltip
                      id="overlay-lock"
                      className="dln-poppver-tooltip"
                      {...props}
                    >
                      {strings.selectLockedProposals}
                      <p>
                       {strings.selectLockedProposalsDesc}
                      </p>
                    </Tooltip>
                  )}
                </Overlay>
                <MaterialToolTip
                PopperProps={{ disablePortal: true }} 
                    classes={{
                      tooltip: isDemoMode ? 'd-none' : 'dln-tooltip',
                      arrow: 'dln-tooltip-arrow',
                    }}
                    arrow
                    placement='top'
                    title={strings.selectBackedProposals}
                  >
                <img
                  className="app-action-icon"
                  src={parentClickedFilter==="baked"?bakedActiveIcon:bakedIcon}

                  alt="icon"
                  onClick={(e) => handleClickFilter("baked")}
                  ref={bakeproposal}
                />
                </MaterialToolTip>
                <Overlay
                  target={bakeproposal}
                  show={isDemoMode === true && isbakedbuttonClicked === true}
                  placement="top"
                >
                  {(props) => (
                    <Tooltip
                      id="overlay-bake"
                      className="dln-poppver-tooltip"
                      {...props}
                    >
                      {strings.selectBackedProposals}
                      <p>
                      {strings.selectBackedProposalsDesc}
                      </p>
                    </Tooltip>
                  )}
                </Overlay>
                <MaterialToolTip
                PopperProps={{ disablePortal: true }} 
                    classes={{
                      tooltip: isDemoMode ? 'd-none' : 'dln-tooltip',
                      arrow: 'dln-tooltip-arrow',
                    }}
                    arrow
                    placement='top'
                    title={strings.selectFundedProposals}
                  >
                    <img
                  className="app-action-icon"
                  src={parentClickedFilter==="funded"?fundedActiveIcon:fundedIcon}

                  alt="icon"
                  onClick={(e) => handleClickFilter("funded")}
                  ref={fundproposal}
                />
                </MaterialToolTip>
                
                <Overlay
                  target={fundproposal}
                  show={isDemoMode === true && isfundedbuttonClicked === true}
                  placement="top"
                >
                  {(props) => (
                    <Tooltip
                      id="overlay-fund"
                      className="dln-poppver-tooltip"
                      {...props}
                    >
                      {strings.selectFundedProposals}
                      <p>
                        {strings.selectFundedProposalsDesc}
                      </p>
                    </Tooltip>
                  )}
                </Overlay>
            {isShowRepaid &&     <MaterialToolTip
                PopperProps={{ disablePortal: true }} 
                    classes={{
                      tooltip: isDemoMode ? 'd-none' : 'dln-tooltip',
                      arrow: 'dln-tooltip-arrow',
                    }}
                    arrow
                    placement='top'
                    title={strings.selectRepaidProposals}
                  >
                <img
                  className="app-action-icon"
                  src={parentClickedFilter==="repaid"?repayActiveIcon:repayIcon}
                  alt="icon"
                  onClick={(e) => handleClickFilter("repaid")}
                  ref={repayproposal}
                />
                </MaterialToolTip>}
                <Overlay
                  target={repayproposal}
                  show={isDemoMode === true && isrepaybuttonClicked === true}
                  placement="top"
                >
                  {(props) => (
                    <Tooltip
                      id="overlay-repay"
                      className="dln-poppver-tooltip"
                      {...props}
                    >
                      {strings.selectRepaidProposals}
                      <p>
                      {strings.selectRepaidProposalsDesc}
                      </p>
                    </Tooltip>
                  )}
                </Overlay>
              </div>
            </Col>
          </Row>
    </Fragment>
  );
}
export default FilterationBar;
