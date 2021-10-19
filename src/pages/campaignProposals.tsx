import React, { Fragment, useState, useEffect, useRef } from "react";
import { Row, Col, Spinner, Form } from "react-bootstrap";
import SingleProposal from "../components/singleProposal";
import { API, Storage } from "aws-amplify";
import FilterationBar from "../components/filterationBar";
import { useOutsideAlerter } from "../Helpers";
import { useUserState } from "contexts/UserAuthContext";
import strings from "../localization/localization";
import { useLocation, Link } from "react-router-dom";

function CampaignProposals() {
  const search = useLocation().search;
  const id = new URLSearchParams(search).get("id");
  const mfi = new URLSearchParams(search).get("mfi");
  const { user }: any = useUserState();
  const [proposals, setProposals] = useState([]);
  const [filteredProposals, setFilteredProposals] = useState([]);
  const [loadProposals, setLoadProposals] = useState(false);
  const [clickedFilter, setClickedFilter] = useState();
  const [userData, setUserData]: any = useState();
  const [callSpinnerFlag, setCallSpinnerFlag] = useState(false);
  const [mfiId, setMFIId] = useState();
  const [campaignName, setcampaignName] = useState();
  const [campaignDesc, setCampaignDes] = useState();
  const [campaingUrl, setCampaignUrl] = useState("")
  const [campaignId, setCampaignId] = useState()
  let storage: any = localStorage.getItem("mfiData");
  let mfiData: any = storage ? JSON.parse(storage) : null;

  const getMFIData = async (mfi) => {
    setLoadProposals(true);
    const mfiData = await API.get("auth", "/api/mfi", {
      headers: { "Content-Type": "application/json" },
      queryStringParameters: { name: mfi ? mfi : "roi" },
    }).then((response) => {
      localStorage.removeItem("mfiData");
      if (response) {
        localStorage.setItem("mfiData", JSON.stringify(response));
        setMFIId(response.id);
        getProposals(response.id);
      }
    });
  };
  useEffect(() => {
    (async () => {
      await getMFIData(mfi);
      const language: any = localStorage.getItem("language");
      if (language) {
        strings.setLanguage(language);
      }
    })();
  }, []);
  let _user: any = {};
  const getProposals = async (mfiId) => {
    // setLoadProposals(true);
    let data = localStorage.getItem("userData");
    if (data) {
      setUserData(JSON.parse(data));
      _user = JSON.parse(data);
    }
    const campaigns = await API.get("auth", `/api/campaign/?campaignId=${id}`, {
      headers: { "Content-Type": "application/json" },
    }).then(async (response) => {
      if (response.success) {
        setcampaignName(response.data[0].name);
        setCampaignDes(response.data[0].description)
        setCampaignUrl(response.data[0].campaignUrl)
        setCampaignId(response.data[0].id)
        if (response.data[0].mfiId === mfiId) {
          let campProposals: any = [];
          //get proposalCampaigns
          response.data.forEach((element: any) => {
            campProposals = [...campProposals, ...element["proposalCampaigns"]];
          });
          let proposalsArr: any = [];
          //get proposals
          for (let ele of campProposals) {
            let obj = ele["borrow"];
            obj["imageUrl"] = await Storage.get(obj["image"]);
            proposalsArr.push(obj);
          }
          setProposals(proposalsArr);
          setFilteredProposals(proposalsArr);
        }
      }
      setLoadProposals(false);
    });
  };
  useEffect(() => {
    if (clickedFilter) {
      handleFilter(clickedFilter);
    }
  }, [callSpinnerFlag]);
  const handleFilter = (filter) => {
    let data;

    setLoadProposals(true);
    if (filter == "drafted") {
      data = proposals.filter((prop: any) => prop.status === 1);
    } else if (filter == "published") {
      data = proposals.filter((prop: any) => prop.status === 2);
    } else if (filter == "locked") {
      data = proposals.filter((prop: any) => prop.status === 3);
    } else if (filter == "baked") {
      data = proposals.filter((prop: any) => prop.status === 4);
    } else if (filter == "funded") {
      data = proposals.filter((prop: any) => prop.status === 5);
    } else {
      data = proposals;
    }
    setClickedFilter(filter);
    setTimeout(function () {
      setFilteredProposals(data);
      setLoadProposals(false);
    });
  };
  const wrapperRef = useRef(null);
  useOutsideAlerter(wrapperRef);
  const handleCallSpinner = async () => {
    setLoadProposals(true);
    await getProposals(mfiId);
    setCallSpinnerFlag(!callSpinnerFlag);
  };
  return (
    <Fragment>
      {loadProposals ? (
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
        <Row className="justify-content-center app-nav-containers mt-0">
          <Col xl={7} lg={7} md={7} sm={12}>
            <Row>
              <Col><h4 className="text-capitalize">{campaignName} {strings.campaign}</h4></Col>
            </Row>
            <Row className="mt-4">
              <Col className="text-left">
                <Form.Group>
                  <label className="w-100 h-auto">
                    <Form.Control
                      type="text"
                      as="textarea"
                      placeholder="Campaign Description"
                      name="desc"
                      value={campaignDesc}
                      disabled={true}
                    />
                  </label>

                </Form.Group>
              </Col>

            </Row>
            <Row>
              {campaingUrl != "" && (
                <Col>
                  <a href={campaingUrl}> {campaingUrl}</a>
                </Col>
              )}
            </Row>
            <Row>
              <Col>
                <Row>
                  <Col>
                    {userData ? (
                      userData.userMfis.length > 0 ? (
                        <Link
                          className="app-back-link app-link"
                          to={`/App/Campaigns?mfi=${userData?.userMfis[0]?.mfiName}`}
                        >
                          {strings.viewAllCampaign}
                        </Link>
                      ) : (
                        <Link
                          className="app-back-link app-link"
                          to={`/App/Home?mfi=${mfi}`}
                        >
                          {strings.home}
                        </Link>
                      )
                    ) : (
                      <Link to="/App/start" className="app-link app-back-link">
                        {strings.getStart}
                      </Link>
                    )}
                  </Col>
                </Row>
              </Col>
            </Row>
            <div ref={wrapperRef}>
              <FilterationBar
                parentClickedFilter={clickedFilter}
                isAddShow={false}
                isDraftShow={true}
                handleAddButton=""
                handleFilter={handleFilter}
              />

              {filteredProposals && filteredProposals.length > 0 ? (
                filteredProposals.map((p: any, index) => (
                  <Row key={index}>
                    <Col>
                      <SingleProposal
                        isMfi={
                          userData && userData.userMfis.length > 0
                            ? true
                            : false
                        }
                        data={p}
                        callSpinner={handleCallSpinner}
                        CallAddProposalCanceled=""
                        isShowOnly={true}
                        isApprove={
                          userData && userData.userMfis.length > 0
                            ? true
                            : false
                        }
                        isShowAction={
                          userData && userData.id !== "" ? true : false
                        }
                        isCampaign={true}
                        campaignName={campaignName}
                        campaignId={campaignId}
                      />
                    </Col>
                  </Row>
                ))
              ) : (
                <Row className="mt-5">
                  <Col>
                    <h4>{strings.noDataToShow}</h4>
                  </Col>
                </Row>
              )}
            </div>
          </Col>
        </Row>
      )}
    </Fragment>
  );
}
export default CampaignProposals;
