import React, { Fragment, useState, useEffect,useRef } from "react";
import { Row, Col, Spinner } from "react-bootstrap";
import bankIcon from "../Assets/Images/icons/bank.png";
import SingleProposal from "../components/singleProposal";
import { API } from "aws-amplify";
import  { useOutsideAlerter  } from '../Helpers'
import { useUserState } from "contexts/UserAuthContext";
import strings from "../localization/localization";

function Repaid() {
  const { user }: any = useUserState();
  const [proposals, setProposals] = useState([]);
  const [loadProposals, setLoadProposals] = useState(false);
  const [callSpinnerFlag, setCallSpinnerFlag] = useState(false);
  const [totalFunded , setTotalFunded] = useState(0)
  const [totalRepaid , setTotalRepaid] = useState(0)
 
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
      _user=JSON.parse(data);
    }
    getLoanInfo(_user.id)
    const proposals = await API.get("auth", "/api/borrow/proposalsByUserAddress", {
      headers: { "Content-Type": "application/json" },
      queryStringParameters: { address: _user.id,userId:_user.id},
    });

    setProposals(proposals.data.filter(item=>item.status===6));
    setLoadProposals(false);
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
     
          {proposals &&
            proposals.map((p: any, index) => (
              <Row key={index}>
                <Col>
                  <SingleProposal
                    data={p}
                    callSpinner={handleCallSpinner}
                    CallAddProposalCanceled=""
                    isBorrow={true}
                  />
                </Col>
              </Row>
            ))}
                   {proposals&&proposals.length<=0 &&
               
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
export default Repaid;
