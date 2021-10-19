import React, { Fragment, useEffect, useState } from "react";
import CampaignCard from "../components/campaignCard";
import plusIcon from "../Assets/Images/icons/plus.png";
import { Row, Col, Spinner } from "react-bootstrap";
import { API } from "aws-amplify";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import strings from "../localization/localization";

function Campaigns() {
  const [loadCampaign, setLoadCampaign] = useState(false);
  useEffect(() => {
    (async () => {
      let storage: any = localStorage.getItem("userData");
      let _userData: any = storage ? JSON.parse(storage) : null;
      if (_userData) {
        setUserData(_userData);
        fetchAllCampaigns(_userData.userMfis[0].mfiId);
      }
    })();
  }, []); 
  const [isAdd, setIsAdd] = useState(false);
  const [campaigns, setCampaigns] = useState([]);
  const [userData, setUserData]: any = useState();
  const setLoading = () => {
    fetchAllCampaigns(userData.userMfis[0].mfiId);
    setLoadCampaign(!loadCampaign)
  };

  const fetchAllCampaigns = async (mfiId) => {
    console.log(mfiId);
    setLoadCampaign(true);
    await API.get("auth", `/api/campaign/?mfiId=${mfiId}`, {
      headers: { "Content-Type": "application/json" },
    }).then(async (response) => {
      if (response.success == true) {
        console.log(response.data)
        setCampaigns(response.data);
      } else {
        toast.error("error on loading data..");
      }
      
      setLoadCampaign(false);
    });
  };
  const setAddValue = ()=>{
    setIsAdd(false)
  }
  return (
    <Fragment>
      {loadCampaign ? (
        <Row>
          <Col>
            <div className="app-page-loader py-5">
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
        <div>
          <h3>{strings.manageCampaigns}</h3>
          <div className="p-3">
            <img
              className="app-action-icon"
              src={plusIcon}
              alt="icon"
              onClick={(e) => setIsAdd(true)}
            />
          </div>
          <Row>
            <Col>
              <Link
                className="app-back-link app-link"
                to={`/App/MFIProposals?mfi=${userData?.userMfis[0]?.mfiName}`}
              >
                <span>Back</span>
              </Link>
            </Col>
          </Row>
          {isAdd && (
            <Row>
              <Col>
                <CampaignCard
                reloadCampaignsValue = {()=>fetchAllCampaigns(userData.userMfis[0].mfiId)}
                  callLoading = {()=>setLoading()}
                  data=""
                  isAdd={true}
                  CallAddProposalCanceled={() => setAddValue()}
                />
              </Col>
            </Row>
          )}
          {campaigns &&
            campaigns.map((p: any, index) => (
              <Row key={index}>
                <Col>
                  <CampaignCard
                  reloadCampaignsValue = {()=>fetchAllCampaigns(userData.userMfis[0].mfiId)}
                    callLoading = {()=>setLoading()}
                    data={p}
                    isAdd={isAdd}
                    CallAddProposalCanceled={() => setAddValue()}
                  />
                </Col>
              </Row>
            ))}
        </div>
      )}
    </Fragment>
  );
}
export default Campaigns;
