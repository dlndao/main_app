import React, { Fragment, useState, useEffect, useRef } from "react";
import { Row, Col, Form, Overlay, Tooltip } from "react-bootstrap";
import classNames from "classnames";
import { Avatar } from "@material-ui/core";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { API } from "aws-amplify";
import {
  deleteIcon,
  viewBlue,
  draftIcon,
  saveIcon,
  cancelIcon,
} from "../Assets/Images";
import ConfirmationModal from "./confirmationModal";
import { Tooltip as MaterialToolTip } from "@material-ui/core";
import validator from "validator";
import strings from "../localization/localization";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
function CampaignCard({ data, isAdd, CallAddProposalCanceled, callLoading , reloadCampaignsValue}) {
  const IntialInputs = () => ({
    inputs: {
      startDate: new Date(),
      endDate: new Date(),
      desc: "",
      title: "",
      campaignUrl: '',
    },
    isUpdateMode: false,
  });
  const [profileImg, setProfileImg] = useState("");
  const [state, setState] = useState(IntialInputs());
  const [showErrors, setShowErrors] = useState(false);
  const [invalidDate, setInvalidDate] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [deleteCampaignId, setDeleteCampaignId] = useState();

  let storage: any = localStorage.getItem("mfiData");
  let mfiData: any = storage ? JSON.parse(storage) : null;
  const [mfiId, setMFIID] = useState(false);
  const handleChange = (e) => {
    const { value, name } = e.target;
    const { inputs } = state;

    inputs[name] = value;
    setState({
      ...state,
      inputs,
    });
  };

  useEffect(() => {
    if (mfiData) {
      setMFIID(mfiData.id);
    }

    if (!isAdd && data && data !== "") {
      setState({
        ...state,
        inputs: {
          startDate: new Date(data.startDate),
          endDate: new Date(data.endDate),
          desc: data.description,
          title: data.name,
          campaignUrl: data.campaignUrl,
        },
        isUpdateMode: isAdd,
      });
    } else {
      setState({ ...state, isUpdateMode: true });
    }
  }, []);
  const handleDateChange = (date, name) => {
    const { inputs }: any = state;
    inputs[name] = date;
    var today = new Date();
    var isToday = today.toDateString() == state.inputs.endDate.toDateString();

    if (isToday) {
      setInvalidDate(true);
    } else {
      setInvalidDate(false);
    }
    setState({
      ...state,
      inputs,
    });
  };
  const handleCancel = () => {
    setState({
      ...state,
      isUpdateMode: false,
      inputs: {
        ...state.inputs,
        title: state.inputs.title,
        desc: state.inputs.desc,
        startDate: new Date(state.inputs.startDate),
        endDate: new Date(state.inputs.endDate),
      },
    });
    CallAddProposalCanceled();
  };
  const createNewCampaign = async () => {
    setShowErrors(true);
    var today = new Date();
    var isToday = today.toDateString() == state.inputs.endDate.toDateString();

    if (isToday) {
      setInvalidDate(true);
    } else {
      setInvalidDate(false);
      if (state.inputs.title != "" || state.inputs.desc != "" || state.inputs.campaignUrl != "") {
        await API.post("auth", "/api/campaign", {
          headers: { "Content-Type": "application/json" },
          body: {
            mfiId: mfiId,
            name: state.inputs.title,
            description: state.inputs.desc,
            startDate: state.inputs.startDate.toDateString(),
            endDate: state.inputs.endDate.toDateString(),
            campaignUrl: state.inputs.campaignUrl
          },
        }).then(async (response) => {
          console.log(response);
          if (response.success == true) {
            setState({
              ...state,              
              isUpdateMode: false,
            });
            //enable add button to work again
            CallAddProposalCanceled()
            reloadCampaignsValue()
            toast.success(strings.addedCampaign);
          } else {
            toast.error("error..");
          }
        });
      }
    }
  };

  const deleteCampaign = async (id) => {    
    await API.del("auth", `/api/campaign/`, {
      headers: { "Content-Type": "application/json" },
      body: { id: id }
    }).then(async (response) => {
      if (response.success == true) {
        toast.success(strings.campaignRemoved);
        callLoading()
      } else {
        toast.error("error..");
      }            
    });
  }

  return (
    <Fragment>
      <Row className="justify-content-center app-inner-page app-inner-page-tab mt-3">
        <Col
          xl={8}
          lg={8}
          md={8}
          sm={8}
          className={classNames("card app-card app-single-prop")}
        >
          <Form className="app-form py-4">
            <Row>
              <Col className="col-auto app-user-profile-img-main text-left">
                <MaterialToolTip
                  PopperProps={{ disablePortal: true }}
                  classes={{
                    tooltip: "dln-tooltip",
                    arrow: "dln-tooltip-arrow",
                  }}
                  arrow
                  placement="top"
                  title="campaign image"
                >
                  <Avatar
                    alt=""
                    src={profileImg}
                    className="app-user-profile-img app-proposal-img"
                  />
                </MaterialToolTip>
              </Col>
              <Col>
                <Row>
                  <Col className="text-center">
                    <Form.Group>
                      <label className="w-100">
                        <Form.Control
                          type="text"
                          placeholder={strings.campaignTitle}
                          name="title"
                          onChange={(e) => {
                            handleChange(e);
                          }}
                          value={state.inputs.title}
                          disabled={!state.isUpdateMode}
                        />
                      </label>
                      {showErrors === true &&
                        validator.isEmpty(state.inputs.title) && (
                          <div className="app-error-msg">
                            {strings.required}
                          </div>
                        )}
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col className="text-center">
                    <Form.Group>
                      <label className="w-100">
                        <Form.Control
                          type="text"
                          placeholder={strings.campaignUrl}
                          name="campaignUrl"
                          onChange={(e) => {
                            handleChange(e);
                          }}
                          value={state.inputs.campaignUrl}
                          disabled={!state.isUpdateMode}
                        />
                      </label>
                      {showErrors === true &&
                        validator.isEmpty(state.inputs.campaignUrl) && (
                          <div className="app-error-msg">
                            {strings.required}
                          </div>
                        )}
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col className="text-left">
                    <Form.Group>
                      <label className="dln-datepicker">
                        <DatePicker
                          name="startDate"
                          className="form-control"
                          selected={state.inputs.startDate}
                          onChange={(date, name) =>
                            handleDateChange(date, "startDate")
                          }
                          popperPlacement="top"
                          disabled={!state.isUpdateMode}
                        />
                      </label>
                      <div className="app-footer-info">{strings.startDate}</div>
                    </Form.Group>
                  </Col>
                  <Col className="text-left">
                    <Form.Group>
                      <label className="dln-datepicker">
                        <DatePicker
                          name="endDate"
                          className="form-control"
                          selected={state.inputs.endDate}
                          onChange={(date, name) =>
                            handleDateChange(date, "endDate")
                          }
                          popperPlacement="top"
                          disabled={!state.isUpdateMode}
                        />
                      </label>
                      <div className="app-footer-info">{strings.endDate}</div>
                      {showErrors === true && invalidDate && (
                        <div className="app-error-msg">{strings.invalidDate}</div>
                      )}
                    </Form.Group>
                  </Col>
                </Row>

              </Col>
            </Row>
            <Row>
              <Col className="text-left">
                <Form.Group>
                  <label className="w-100">
                    <Form.Control
                      type="text"
                      as="textarea"
                      placeholder={strings.campaignSec}
                      name="desc"
                      maxLength={256}
                      onChange={(e) => {
                        handleChange(e);
                      }}
                      value={state.inputs.desc}
                      disabled={!state.isUpdateMode}
                    />
                  </label>
                  {showErrors === true &&
                    validator.isEmpty(state.inputs.title) && (
                      <div className="app-error-msg">
                        {strings.required}
                      </div>
                    )}
                </Form.Group>
              </Col>
            </Row>
            <Fragment>
              {!state.isUpdateMode ? (
                <Row>
                  <Col>
                    <MaterialToolTip
                      PopperProps={{ disablePortal: true }}
                      classes={{
                        tooltip: "dln-tooltip",
                        arrow: "dln-tooltip-arrow",
                      }}
                      arrow
                      placement="top"
                      title="Delete this campaign"
                    >
                      <img
                        className="app-action-icon"
                        src={deleteIcon}
                        alt="icon"
                        onClick={(e) => 
                          {setShowConfirmationModal(true) ;
                            setDeleteCampaignId(data.id)
                          }
                        }
                      />
                    </MaterialToolTip>
                  </Col>
                  <Col>
                    <MaterialToolTip
                      PopperProps={{ disablePortal: true }}
                      classes={{
                        tooltip: "dln-tooltip",
                        arrow: "dln-tooltip-arrow",
                      }}
                      arrow
                      placement="top"
                      title="View Campaign Proposals"
                    >
                      <Link
                        to={`/App/proposalsByCampaign?mfi=${mfiData.name}&id=${data.id}`}
                      >
                        <img
                          className="app-action-icon"
                          src={viewBlue}
                          alt="icon"
                        //onClick={(e) => handleInvest(e)}
                        />
                      </Link>
                    </MaterialToolTip>
                  </Col>
                </Row>
              ) : (
                <Row>
                  <Col>
                    <MaterialToolTip
                      PopperProps={{ disablePortal: true }}
                      classes={{
                        tooltip: "dln-tooltip",
                        arrow: "dln-tooltip-arrow",
                      }}
                      arrow
                      placement="top"
                      title="Publish this campaign"
                    >
                      <img
                        className="app-action-icon"
                        src={saveIcon}
                        alt="icon"
                        onClick={() => createNewCampaign()}
                      />
                    </MaterialToolTip>
                  </Col>
                  {/* <Col>
                    <MaterialToolTip
                      PopperProps={{ disablePortal: true }}
                      classes={{
                        tooltip: "dln-tooltip",
                        arrow: "dln-tooltip-arrow",
                      }}
                      arrow
                      placement="top"
                      title="Draft this Campaign"
                    >
                      <img
                        className="app-action-icon"
                        src={draftIcon}
                        alt="icon"
                      //onClick={(e) => handleInvest(e)}
                      />
                    </MaterialToolTip>
                  </Col> */}
                  <Col>
                    <MaterialToolTip
                      PopperProps={{ disablePortal: true }}
                      classes={{
                        tooltip: "dln-tooltip",
                        arrow: "dln-tooltip-arrow",
                      }}
                      arrow
                      placement="top"
                      title=""
                    >
                      <img
                        className="app-action-icon"
                        src={cancelIcon}
                        alt="icon"
                        onClick={() => handleCancel()}
                      />
                    </MaterialToolTip>
                  </Col>
                </Row>
              )}
              {showConfirmationModal && (
                <ConfirmationModal
                  message={`Are you need to archive "${data.name}" campaign?`}
                  ConfirmationModalConfirm={() =>
                    deleteCampaign(deleteCampaignId)
                  
                  }
                  ConfirmationModalCancel={() =>
                    setShowConfirmationModal(false)
                  }
                />
              )}
            </Fragment>
          </Form>
        </Col>
      </Row>
    </Fragment>
  );
}
export default CampaignCard;
