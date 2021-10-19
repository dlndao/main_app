import React, {  useState, useEffect } from "react";
import { Modal ,Row,Col} from "react-bootstrap";
import {  API } from "aws-amplify";
import { toast } from "react-toastify";
import validator from "validator";
import { useUserState } from "contexts/UserAuthContext";
import classNames from "classnames";
import strings from '../localization/localization'
function InvestModal({ data ,InvestModalClosed}) {
  const { user }: any = useUserState();
  const [showInvestModal, setShowInvestModal]: any = useState(true);
  const [amount, setAmount]: any = useState("");
  const [showErrors, setShowErrors] = useState(false);
  const [isArabic, setIsArabic] = useState(false);
  let userData:any;

  const handleInvest = async () => {
    setShowErrors(true);
    let currentuserdata = localStorage.getItem('userData');
    if(currentuserdata){
     userData=JSON.parse(currentuserdata);
    }
    if( amount!==""&& parseFloat(amount)>=1&&parseFloat(amount)<=(data.amount-data.currentBalance)){
    await API.post("auth", "/api/borrow/backProposal", {
      headers: { "Content-Type": "application/json" },
      body: {
        userId:userData.id, proposalId:data.id, amount:amount
      },
    }).then((response) => {
     }); 
      toast.success(strings.yourAmoutnBackedSucc);
      handleCloseModal();
    }
    
  };
  const handleChange = (e: any) => {
    const { value, name } = e.target;
    setAmount(value);
  };

  const handleCloseModal=()=>{
    setShowInvestModal(false);
    InvestModalClosed();
  }

  useEffect(() => {
    const language: any = localStorage.getItem("language");
   
        if (language) {
          if (language === "ar") {
            setIsArabic(true);
          }
          else {
            setIsArabic(false);
          }
          
        } else {
          setIsArabic(false);
        }
}, []);
  return (
    <Modal
      show={showInvestModal}
      onHide={() => {
        handleCloseModal()
      }}
      size="lg"
      backdrop="static"
      className={classNames("dln-centered-vertically-modal", isArabic && "app-arabic-lang")}
      scrollable={true} 

    >
      <Modal.Header closeButton>
        <Modal.Title className="app-text-blue">
        {strings.letsInvest} {data.title} 
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="row form-group  my-3 my-3 mx-lg-5 mx-md-3 mx-sm-0  justify-content-center">
          <div className="col-2 text-left d-flex align-self-center">{strings.amount}</div>
          <div className="col-8">
            <input
              type="number"
              className="form-control"
              name="backerEmail"
              value={amount}
              onChange={handleChange}
              min={1}
              max={data.amount-data.currentBalance}
            />
            {showErrors === true && validator.isEmpty(amount) && (
              <div className="app-error-msg">{strings.required}</div>
            )}
             {(showErrors === true && !(validator.isEmpty(amount)) &&parseFloat(amount)<=0 )&& (
              <div className="app-error-msg">{strings.valueMustBeGreeterThan1}</div>
            )}
               {(showErrors === true && !(validator.isEmpty(amount)) &&parseFloat(amount)>(data.amount-data.currentBalance) )&& (
              <div className="app-error-msg">{strings.valueMustBeLessThanRestProposalAmount} {data.amount-data.currentBalance} USD</div>
            )}
            
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
       <Row>
         <Col className="justify-content-end d-flex">
         <button
                type="button"
                onClick={(e) => handleInvest()}
                className="btn text-success app-link fz-20"
              >
                {strings.invest}
              </button>
         </Col>
       </Row>
        </Modal.Footer>
    </Modal>
  );
}
export default InvestModal;
