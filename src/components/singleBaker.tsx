import React, { useState, useEffect } from "react";
import { Row, Col, Form } from "react-bootstrap";
import { Avatar } from "@material-ui/core";
import resendIcon from "../Assets/Images/icons/resend.png";
import thanksIcon from "../Assets/Images/icons/thanks.png";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import { Tooltip as MaterialToolTip } from "@material-ui/core";
import { API } from "aws-amplify";
import { toast } from "react-toastify";
import strings from "../localization/localization";

function SingleBaker({ data, closeModal, proposalData, isBorrow = false }) {
  const IntialInputs = () => ({
    inputs: {
      email: "",
      amount: "",
      image: "",
      date: "",
      isbake: false,
      isinVited: false,
      id: "1",
      name: "",
    },
  });
  const [state, setState] = useState(IntialInputs());
  const [userData, setUserData]: any = useState();

  useEffect(() => {
    let currentdata = localStorage.getItem("userData");
    if (currentdata) {
      setUserData(JSON.parse(currentdata));
    }
    if (data && data !== "") {
      setState({
        ...state,
        inputs: {
          email: data.email,
          amount:
            data.dateBacked !== "" && data.dateBacked !== null
              ? data.amount
              : "---",
          image: data.profileImage,
          date:
            data.dateBacked === null && data.dateInvited !== null
              ? moment(data.dateInvited).format("YYYY/MM/DD")
              : moment(data.dateBacked).format("YYYY/MM/DD"),
          isbake:
            data.dateBacked !== "" && data.dateBacked !== null ? true : false,
          isinVited:
            data.dateInvited !== "" && data.dateInvited !== null ? true : false,
          id: data.id,
          name: data.name,
        },
      });
    }
  }, []);
  const handleResend = async () => {
    let bakersEmails: any = [];
    bakersEmails.push(state.inputs.email);
    await API.post("auth", "/api/borrow/sendBackInvitations", {
      headers: { "Content-Type": "application/json" },
      body: {
        sendToMails: bakersEmails,
        title: proposalData.title,
        description: proposalData.description,
        amount: proposalData.amount,
        address: isBorrow ? userData.id : proposalData.userId,
        proposalId: proposalData.id,
        userId: userData.id,
        proposalOwner: isBorrow
          ? userData.firstName + " " + userData.lastName
          : proposalData.user.firstName + " " + proposalData.user.lastName,
      },
    }).then((response) => {
      toast.success("Email Sent Successfully");
      closeModal();
    });
  };
  const handleThanks = async () => {
    await API.post("auth", "/api/borrow/sendThankYouEmail", {
      headers: { "Content-Type": "application/json" },
      body: {
        sendToMail: state.inputs.email,
        backerName:
          state.inputs.name.toLowerCase() === "user not registered" ||
          state.inputs.name.trim() === ""
            ? state.inputs.email
            : state.inputs.name,
        title: proposalData.title,
        description: proposalData.description,
        amount: proposalData.amount,
        address: isBorrow ? userData.id : proposalData.userId,
        backingAmount: state.inputs.amount,
        username: userData.firstName + " " + userData.lastName,
        proposalOwner: isBorrow
          ? userData.firstName + " " + userData.lastName
          : proposalData.user.firstName + " " + proposalData.user.lastName,
      },
    }).then((response) => {
      toast.success("Email Sent Successfully");
      closeModal();
    });
  };

  const handleThanksForRepaid = async () => {
    let storage: any = localStorage.getItem("mfiData");
    let mfiData: any 
    if(storage){
      mfiData=JSON.parse(storage)
    };
    await API.post("auth", "/api/borrow/sendThanksAfterRepaid", {
      headers: { "Content-Type": "application/json" },
      body: {
        sendToMail: state.inputs.email,
        backerName:
          state.inputs.name.toLowerCase() === "user not registered" ||
          state.inputs.name.trim() === ""
            ? state.inputs.email
            : state.inputs.name,
        title: proposalData.title,
        description: proposalData.description,
        amount: proposalData.amount,
        address: isBorrow ? userData.id : proposalData.userId,
        backingAmount: state.inputs.amount,
        username: userData.firstName + " " + userData.lastName,
        proposalOwner: isBorrow
          ? userData.firstName + " " + userData.lastName
          : proposalData.user.firstName + " " + proposalData.user.lastName,
        proposalId: proposalData.id,
        mfiName: mfiData?mfiData.name:"ROI"
      },
    }).then((response) => {
      toast.success("Email Sent Successfully");
      closeModal();
    });
  };

  return (
    <Row className="justify-content-center app-inner-page app-inner-page-tab my-3 ">
      <Col
        xl={9}
        lg={9}
        md={9}
        sm={12}
        className={`card app-baker-card  ${
          state.inputs.isbake && state.inputs.isinVited
            ? `app-invitedBaker-card`
            : state.inputs.isbake && !state.inputs.isinVited
            ? "app-notinvitedBaker-card"
            : "app-notBaker-card"
        }`}
      >
        <Form className="app-form">
          <Row>
            <Col className="col-3 app-user-profile-img-main text-center align-self-center">
              <MaterialToolTip
                PopperProps={{ disablePortal: true }}
                classes={{
                  tooltip: "dln-tooltip",
                  arrow: "dln-tooltip-arrow",
                }}
                arrow
                placement="top"
                title={strings.investorPhoto}
              >
                <Avatar
                  alt=""
                  src={state.inputs.image}
                  className="app-user-profile-img app-baker-img mx-auto"
                />
              </MaterialToolTip>
              <span className="app-text-gray">{data.name}</span>
            </Col>
            <Col className="app-proposal-right-side pt-3">
              <Row>
                <Col className="text-left">
                  <Form.Group>
                    <MaterialToolTip
                      PopperProps={{ disablePortal: true }}
                      classes={{
                        tooltip: "dln-tooltip",
                        arrow: "dln-tooltip-arrow",
                      }}
                      arrow
                      placement="top"
                      title={strings.investorEmail}
                    >
                      <Form.Control
                        type="text"
                        placeholder="email"
                        name="email"
                        value={state.inputs.email}
                        disabled={true}
                      />
                    </MaterialToolTip>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col className="text-left pr-0">
                  <Form.Group>
                    <MaterialToolTip
                      PopperProps={{ disablePortal: true }}
                      classes={{
                        tooltip: "dln-tooltip",
                        arrow: "dln-tooltip-arrow",
                      }}
                      arrow
                      placement="top"
                      title={
                        data.dateBacked === null && data.dateInvited !== null
                          ? `${strings.invitationDate}`
                          : "Backing date"
                      }
                    >
                      <label className="dln-datepicker app-readonly-datepicker">
                        <Form.Control
                          name="date"
                          className="form-control"
                          disabled={true}
                          value={state.inputs.date}
                        />
                      </label>
                    </MaterialToolTip>
                  </Form.Group>
                </Col>

                <Col className="text-left">
                  <Form.Group>
                    <MaterialToolTip
                      PopperProps={{ disablePortal: true }}
                      classes={{
                        tooltip: "dln-tooltip",
                        arrow: "dln-tooltip-arrow",
                      }}
                      arrow
                      placement="top"
                      title={strings.investedAmount}
                    >
                      <Form.Control
                        type="text"
                        placeholder={strings.amount}
                        name="amount"
                        value={state.inputs.amount}
                        disabled={true}
                        className={data.isbake && "dln-back-green"}
                      />
                    </MaterialToolTip>
                  </Form.Group>
                </Col>
              </Row>
            </Col>
            <Col className="col-auto  align-self-center">
              {state.inputs.isbake && (
                <MaterialToolTip
                  PopperProps={{ disablePortal: true }}
                  classes={{
                    tooltip: "dln-tooltip",
                    arrow: "dln-tooltip-arrow",
                  }}
                  arrow
                  placement="top"
                  title={strings.sendThankYouNote}
                >
                  <img
                    src={thanksIcon}
                    className="app-baker-card-icon"
                    onClick={() => {
                      proposalData.status === 6
                        ? handleThanksForRepaid()
                        : handleThanks();
                    }}
                  />
                </MaterialToolTip>
              )}
              {state.inputs.isinVited && !state.inputs.isbake && (
                <MaterialToolTip
                  PopperProps={{ disablePortal: true }}
                  classes={{
                    tooltip: "dln-tooltip",
                    arrow: "dln-tooltip-arrow",
                  }}
                  arrow
                  placement="top"
                  title={strings.resendInvitation}
                >
                  <img
                    src={resendIcon}
                    className="app-baker-card-icon"
                    onClick={() => handleResend()}
                  />
                </MaterialToolTip>
              )}
            </Col>
          </Row>
        </Form>
      </Col>
    </Row>
  );
}
export default SingleBaker;
