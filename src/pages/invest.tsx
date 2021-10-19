import React, { Fragment, useEffect, useState } from "react";

import { Row, Col, Spinner } from "react-bootstrap";
import SingleProposal from "../components/singleProposal";
import { API } from "aws-amplify";
import FilterationBar from "../components/filterationBar";
import { useUserState } from "contexts/UserAuthContext";
import strings from "../localization/localization";

function Invest() {
  const { user }: any = useUserState();

  const [proposals, setProposals] = useState([]);
  const [filteredProposals, setFilteredProposals] = useState([]);
  const [loadProposals, setLoadProposals] = useState(false);
  const [clickedFilter, setClickedFilter] = useState();
  const [callSpinnerFlag, setCallSpinnerFlag] = useState(false);
  

  const [userActiveBalance , setUserActiveBalance] = useState(0.0)
  const [userPassiveBalance , setUserPassiveBalance] = useState(0.0)
  let userData:any={};
  useEffect(() => {
    (async () => {
    
      getProposals();
      getUserBalanceStatus()
    })();
  }, []);

  const getUserBalanceStatus = async () => {
    let data = localStorage.getItem('userData');
    if(data){
     userData=JSON.parse(data);
    }
    setLoadProposals(true);
    const balance = await API.get("auth", "/api/borrow/userStats", {
      headers: { "Content-Type": "application/json" },
      queryStringParameters: {userId:userData.id},
    });
    if (balance.success){
      setUserActiveBalance(balance.data.active.amount)
      setUserPassiveBalance(balance.data.pasive.amount)
    }
  }
  const getProposals = async () => {
    let data = localStorage.getItem('userData');
    if(data){
     userData=JSON.parse(data);
    }
    setLoadProposals(true);
    const proposals = await API.get("auth", "/api/borrow/proposalsNotByUserAddress", {
      headers: { "Content-Type": "application/json" },
      queryStringParameters: { address: userData.id,userId:userData.id},
    });
    setProposals(proposals.data.filter((prop: any) => (prop.status !== 1 && prop.status!==6)));
    setFilteredProposals(proposals.data.filter((prop: any) => (prop.status !== 1 && prop.status!==6)));
    setLoadProposals(false);
  };
  const handleFilter = (filter) => {
    let data;
    setLoadProposals(true);
if (filter == "published") {
      data = proposals.filter((prop: any) => prop.status === 2);
    } else if (filter == "locked") {
      data = proposals.filter((prop: any) => prop.status === 3);
    } else if (filter == "baked") {
      data = proposals.filter((prop: any) => prop.status === 4);
    } else if (filter == "funded") {
      data = proposals.filter((prop: any) => prop.status === 5);
    } else if (filter == "repaid") {
      data = proposals.filter((prop: any) => prop.status === 6);
    }else {
      data = proposals;
    }
    setClickedFilter(filter);
    setTimeout(function() {
      setFilteredProposals(data);
      setLoadProposals(false);
    });
  };
  useEffect(() => {
   if(clickedFilter) {
     handleFilter(clickedFilter);
    }
}, [callSpinnerFlag]);
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
        <Fragment>
          <Row className="justify-content-center app-inner-page app-inner-page-tab">
            <Col xl={12} lg={12} md={12} sm={12} className="card app-card pb-5">
              <div className="app-card-title d-flex align-self-center  mt-3 justify-content-center">
                <h3>{strings.investmentIncome}</h3>
              </div>
              <Row className="mt-1">
                <Col>
                  <div className="app-boxed-data">
                    <div>{strings.activeROÍ}</div>
                    <div className="app-text-blue">${userActiveBalance}</div>
                  </div>
                </Col>
                <Col>
                  <div className="app-boxed-data">
                    <div>{strings.myInvestmentOÍ}</div>
                    <div className="app-text-blue">${userPassiveBalance}</div>
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
          {/* <Row className="justify-content-center mt-3">
                  <Col xl={12} lg={12} md={12} sm={12}>
                    <Row className="mt-3 px-3">
                      <Col className="pl-0">
                        <Link to="/App/Repay">
                          <button className="app-secondary-btn">Repay</button>
                        </Link>
                      </Col>
                      <Col className="pr-0">
                        <Link to="/App/Withdraw">
                          <button className="app-secondary-btn">
                            Withdraw
                          </button>
                        </Link>
                      </Col>
                    </Row>
                  </Col>
                </Row> */}

<FilterationBar  parentClickedFilter={clickedFilter} isAddShow={false} isDraftShow={false} handleAddButton="" handleFilter={handleFilter} isShowRepaid={true}/>

          {filteredProposals &&
            filteredProposals.map((p: any, index) => (
              <Row key={index}>
                <Col>
                  <SingleProposal
                    data={p}
                    callSpinner={handleCallSpinner}
                    CallAddProposalCanceled=""
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
        </Fragment>
      )}
    </Fragment>
  );
}
export default Invest;
