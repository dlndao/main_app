import React, { useState, useEffect, Fragment } from "react";
import { Spinner } from "react-bootstrap";
import classNames from "classnames";
import { Row, Col, Form } from "react-bootstrap";
import save from "../Assets/Images/icons/save.png";
import deleteIcon from "../Assets/Images/icons/delete.png";
import { Avatar } from "@material-ui/core";
import { Storage, API } from "aws-amplify";
import { v4 as uuid } from "uuid";
import moment from "moment";
import { toast } from "react-toastify";
import cancelIcon from "../Assets/Images/icons/cancel.png";
import ConfirmationModal from "./confirmationModal";
import strings from "../localization/localization";
import validator from "validator";

function SingleProposalImageLog({
  item,
  isAdd,
  CallAddProposalCanceled,
  proposalId,
  callSpinner,
  isBorrow=false
}) {
  const [description, setDescription]: any = useState("");
  const [fileName, setFileName] = useState("");
  const [fileData, setFileData] = useState();
  const [fileType, setFileType] = useState();
  const [uploadImage, setUploadImage] = useState(false);
  const [proposalImg, setProposalImg] = useState(item.image);
  const [saveClicked, setSaveClicked] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showErrors, setShowErrors] = useState(false);

  const fileImgInput: any = React.useRef<HTMLInputElement>();

  useEffect(() => {
    const language: any = localStorage.getItem("language");
    if (language) {
      strings.setLanguage(language);
    }
    if (!isAdd && item && item !== "") {
      setProposalImg(item.image);
    }
  });

  const handleChange = (e) => {
    setDescription(e.target.value);
  };
  const upload = async (e) => {
    const genericId = uuid();
    setUploadImage(true);
    setProposalImg(URL.createObjectURL(e.target.files[0]));
    let file = fileImgInput.current.files[0];
    let reader = new FileReader();
    reader.readAsArrayBuffer(file);
    setFileType(e.target.files[0].type);
    setFileName(genericId + "_" + proposalId + "_" + e.target.files[0].name);
    reader.onload = async (event: any) => {
      setFileData(event.target.result);
    };
  };
  const saveImage = async (name, data, type) => {
    let fileKey;
    await Storage.put("proposalImages" + "/" + name, data, {
      contentType: type,
      level: "public",
    }).then((result) => {
      fileKey = result; //result.key;
    });
    return fileKey.key;
  };

  const handleSave = async (e) => {
    setShowErrors(true);

    e.preventDefault();
    if (description !== "" && uploadImage) {
      setSaveClicked(true);
      let key: any = null;
      if (uploadImage) {
        key = await saveImage(fileName, fileData, fileType);
      }
      await API.post("auth", "/api/borrow/proposalImage", {
        headers: { "Content-Type": "application/json" },
        body: {
          proposalId: proposalId,
          image: key,
          description: description,
        },
      }).then((response) => {

        toast.success("Proposal Update Saved Successfully");
        if (isAdd) {
          CallAddProposalCanceled();
        }
        callSpinner();
        setUploadImage(false);
        setSaveClicked(false);
      });
    }
  };
  const handleCancel = (e) => {
    CallAddProposalCanceled();
  };
  const handleOpenModalDelete = async () => {
    setShowDeleteModal(true);
  };
  const handleDelete = async (id) => {
    await API.del("auth", `/api/borrow/proposalImage`, {
      headers: { "Content-Type": "application/json" },
      queryStringParameters: { id: item.id },
    }).then((response) => {
      toast.success("Proposal update deleted Successfully");
      callSpinner();
    });
  };

  return (
    <div className="p-3 app-proposal-update mb-3">
      <Row>
        <Col className="col-3 d-flex align-items-center justify-content-center">
          <label
            // htmlFor={`contained-button-file-${state.inputs.id}`}
            className={classNames(
              "app-user-profile-img-container position-relative"
            )}
          >
            <Avatar
              alt=""
              src={proposalImg}
              className="app-album-image app-proposal-img"
            />

            <input
              accept="*/*"
              className="d-none"
              type="file"
              ref={fileImgInput}
              onChange={(e) => upload(e)}
              disabled={!isAdd}
            />
          </label>
        </Col>
        <Col className="col-9">
          <Form.Group>
            <Form.Control
              type="text"
              as="textarea"
              className="text-left "
              value={item.description}
              name="desc"
              onChange={handleChange}
              disabled={!isAdd}
            />
            {showErrors === true && validator.isEmpty(description) && (
              <div className="text-left app-error-msg">{strings.required}</div>
            )}
          </Form.Group>

          <Row>
            <Col className="col-4 d-flex align-items-center justify-content-center">
              <div>
                updated{" "}
                {isAdd
                  ? moment(new Date()).format("DD/MM/YYYY")
                  : moment(item.date).format("DD/MM/YYYY")}
              </div>
            </Col>
            <Col className="col-4  align-items-center justify-content-center">
              {saveClicked ? (
                <Spinner
                  className="mr-1 dln-button-loader"
                  as="span"
                  animation="border"
                  role="status"
                  aria-hidden="true"
                />
              ) : (
                <img
                  className={classNames(
                    "app-action-icon mt-1",
                    !isAdd ? "d-none" : ""
                  )}
                  src={save}
                  alt="icon"
                  onClick={(e) => handleSave(e)}
                />
              )}
            </Col>
            <Col>
              <img
                className={classNames(
                  "app-action-icon mt-1",
                  !isAdd ? "d-none" : ""
                )}
                src={cancelIcon}
                alt="icon"
                onClick={(e) => handleCancel(e)}
              />
            </Col>
           {isBorrow&& <Col className="d-flex ">
              <div className="ml-auto mt-1">
                <img
                  className={classNames(
                    "app-action-icon",
                    isAdd ? "d-none" : ""
                  )}
                  src={deleteIcon}
                  alt="icon"
                  onClick={(e) => {
                    handleOpenModalDelete();
                  }}
                />
              </div>
            </Col>}
            {showDeleteModal && (
              <ConfirmationModal
                message={strings.confirmationDeleteProposalUpdate}
                ConfirmationModalConfirm={() => handleDelete(item.id)}
                ConfirmationModalCancel={() => setShowDeleteModal(false)}
              />
            )}
          </Row>
        </Col>
      </Row>
      <Row className="pl-4">
        <Col>
          {showErrors === true && uploadImage === false && (
            <div className="text-left app-error-msg">{strings.required}</div>
          )}
        </Col>
      </Row>
    </div>
  );
}

export default SingleProposalImageLog;
