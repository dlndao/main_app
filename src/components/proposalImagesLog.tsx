import React, { useState, useEffect } from "react";
import { Modal, ModalBody } from "react-bootstrap";
import classNames from "classnames";
import plus from "../Assets/Images/icons/plus.png";
import { Row, Col, Spinner } from "react-bootstrap";
import SingleProposalImageLog from "./singleProposalImageLog";
import { API } from "aws-amplify";
import strings from "../localization/localization";

function ProposalImagesLog({
  photoLogClosed,
  proposalTitle,
  proposalId,
  isBorrow
}) {
  const [showAlbumModal, setShowAlbumModal]: any = useState(true);
  const [imagesObject, setImagesObject]: any = useState();
  const [addClicked, setAddClicked] = useState(false);
  const [isArabic, setIsArabic] = useState(false);
  const [loadUpdates, setLoadUpdates] = useState(false);

  const handleCloseModal = () => {
    setShowAlbumModal(false);
    photoLogClosed();
  };
  useEffect(() => {
    (async () => {
        const language: any = localStorage.getItem("language");
        if (language) {
          strings.setLanguage(language);
        }
      getUpdates();
    })();
  }, []);
  const handleAddImage = (e) => {
    setAddClicked(true);
  };
  const getUpdates = async () => {
    setLoadUpdates(true);
    await API.get("auth", "/api/borrow/proposalImages", {
      headers: { "Content-Type": "application/json" },
      queryStringParameters: { proposalId: proposalId },
    }).then((response) => {
      if (response.success) {
        setImagesObject(response.data);
        setLoadUpdates(false);
      }
    });
  };
  return (
    <Modal
      show={showAlbumModal}
      onHide={() => {
        handleCloseModal();
      }}
      size="xl"
      backdrop="static"
      className={classNames(
        "dln-centered-vertically-modal",
        isArabic && "app-arabic-lang"
      )}
      scrollable={true}
    >
      <Modal.Header closeButton>
        <Modal.Title>
          <div>{proposalTitle}</div>
        </Modal.Title>
      </Modal.Header>
      <ModalBody className="app-album-log-body">
      {isBorrow&&(  <div className="app-add-new-img-object">
          <img
            src={plus}
            alt="Add image"
            className="app-action-icon p-r-30"
            onClick={(e) => handleAddImage(e)}
          />
        </div>)}
        {addClicked && (
          <Row className="justify-content-center">
            <Col className="col-lg-8 col-md-8 col-sm-12">
              <SingleProposalImageLog
                item=""
                isAdd={true}
                CallAddProposalCanceled={() => setAddClicked(false)}
                proposalId={proposalId}
                callSpinner={()=>getUpdates()}
                isBorrow={isBorrow}
              />
            </Col>
          </Row>
        )}
              {loadUpdates ? (
        <Row>
          <Col>
            <div className="dln-section-spinner-container">
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
        imagesObject&&imagesObject.length>0
          ? imagesObject.map((item, index) => (
              <Row key={index} className="justify-content-center">
                <Col className="col-lg-8 col-md-8 col-sm-12">
                  <SingleProposalImageLog
                    item={item}
                    isAdd={false}
                    CallAddProposalCanceled={() => setAddClicked(false)}
                    proposalId={proposalId}
                    callSpinner={()=>getUpdates()}
                    isBorrow={isBorrow}
                  />
                </Col>
              </Row>
            ))
          :  (<h4 className="text-center">{strings.noDataToShow}</h4>))}
      </ModalBody>
    </Modal>
  );
}

export default ProposalImagesLog;
