import React, { Fragment, useState, useEffect,useRef } from "react";
import { Row, Col, Spinner } from "react-bootstrap";
import bankIcon from "../Assets/Images/icons/bank.png";
import SingleProposal from "../components/singleProposal";
import { API } from "aws-amplify";
import FilterationBar from "../components/filterationBar";
import  { useOutsideAlerter  } from '../Helpers'
import { useUserState } from "contexts/UserAuthContext";
import strings from "../localization/localization";

function Ignored() {
  const { user }: any = useUserState();
  const [addClicked, setAddClicked] = useState(false);
  const [proposals, setProposals] = useState([]);
  const [filteredProposals, setFilteredProposals] = useState([]);
  const [loadProposals, setLoadProposals] = useState(false);
  const [clickedFilter, setClickedFilter] = useState();
  const [userData, setUserData]:any = useState();
  const [callSpinnerFlag, setCallSpinnerFlag] = useState(false);
  const [totalFunded , setTotalFunded] = useState(0)
  const [totalRepaid , setTotalRepaid] = useState(0)

  const handleAddProposal = () => {
      setAddClicked(true);
  }; 
  const getLoanInfo = async(userId)=>  {
    await API.get("auth", `/api/borrow/stats/?userId=${userId}`,{
    headers: { "Content-Type": "application/json" },

  }).then((response) => {

    if (response) {
      if (response.success) {
        setTotalFunded(response.data.funded.amount)
        setTotalRepaid(response.data.paid)
      }
    } else {
    }
  });
}
  useEffect(() => {
    (async () => {
      const language: any = localStorage.getItem("language");
      if (language) {
        strings.setLanguage(language);
      }
      getProposals();

    })();
  }, []);
  let _user:any={}
  const getProposals = async () => {
    setLoadProposals(true);
    let data = localStorage.getItem('userData');
    if(data){
      setUserData(JSON.parse(data));
      _user=JSON.parse(data);
    }
    getLoanInfo(_user.id)
    const proposals = await API.get("auth", "/api/borrow/userIgnoredProposals", {
      headers: { "Content-Type": "application/json" },
      queryStringParameters: {userId:_user.id},
    });

    setProposals(proposals.data);
    setFilteredProposals(proposals.data);
    setLoadProposals(false);
  };
  useEffect(() => {
    if(clickedFilter){
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
      setTimeout(function() {
        setFilteredProposals(data);
        setLoadProposals(false);
      });
      

  };
  const wrapperRef = useRef(null);
  useOutsideAlerter(wrapperRef);
  const handleCallSpinner=async()=>{
    await getProposals();
  setCallSpinnerFlag(!callSpinnerFlag);
  }
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
        <div ref={wrapperRef}>
          <Row className="justify-content-center app-inner-page app-inner-page-tab" >
            <Col xl={12} lg={12} md={12} sm={12} className="card app-card">
              <div className="app-card-title d-flex align-self-center mt-3 justify-content-center">
                <h3>{strings.loanInformation}</h3>
              </div>
              <Row>
                <Col className="align-self-center text-left">
                  <p className="my-2 app-label-with-icon">
                    <img src={bankIcon} alt="bank" />
                    <span className="pl-1 mb-2">{strings.totalFunded}</span>
                  </p>
                </Col>
                <Col className="align-self-center text-right col-auto">
                  <span className="app-text-blue font-weight-bolder mr-1">
                    {totalFunded} 
                  </span>
                  <span className="app-currency-label">$</span>
                </Col>
              </Row>
              <Row>
                <Col className="align-self-center text-left">
                  <p className="app-label-with-icon">
                    <img src={bankIcon} alt="bank" />
                    <span className="pl-1 mb-2">{strings.totalRepaid}</span>
                  </p>
                </Col>
                <Col className="align-self-center text-right col-auto">
                  <span className="app-text-blue font-weight-bolder mr-1">
                    {totalRepaid}
                  </span>
                  <span className="app-currency-label">$</span>
                </Col>
              </Row>
            </Col>
          </Row>
          <FilterationBar parentClickedFilter={clickedFilter} isAddShow={false} isDraftShow={true} handleAddButton={handleAddProposal} handleFilter={handleFilter} isShowRepaid={false}/>
          {filteredProposals &&
            filteredProposals.map((p: any, index) => (
              <Row key={index}>
                <Col>
                  <SingleProposal
                    data={p}
                    callSpinner={handleCallSpinner}
                    CallAddProposalCanceled={() => setAddClicked(false)}
                    isBorrow={true}
                    isIgnored={true}
                    isShowOnly={true}
                  />
                </Col>
              </Row>
            ))}
                   {filteredProposals&&filteredProposals.length<=0 &&
               
               <Row className='mt-5'>
                 <Col>
                 <h4>{strings.noDataToShow}</h4>
                 </Col>
               </Row>
             }
        </div>
      )}
    </Fragment>
  );
}
export default Ignored;
