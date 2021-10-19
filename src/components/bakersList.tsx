import React, { Fragment, useState, useEffect } from "react";
import { Modal,Row,Col,Spinner } from "react-bootstrap";
import SingleBaker from "./singleBaker";
import strings from "../localization/localization";
import { API } from "aws-amplify";
import classNames from "classnames";

function BakersList({data,BakersModalClosed,isBorrow=false}) {
  const [showBakersModal, setShowBakersModal]: any = useState(true);
  const [bakers, setBakers]: any = useState();
  const [loadBakers, setLoadBakers] = useState(false);
  const [isArabic, setIsArabic] = useState(false);

  const handleCloseModal=()=>{
    setShowBakersModal(false);
    BakersModalClosed();
  }
  useEffect(() => {
    (async () => {
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
          getBakers();
    })()
  }, []);

  const getBakers = async () => {
    setLoadBakers(true);
    
    const bakers = await API.get("auth", "/api/borrow/backersList", {
      headers: { "Content-Type": "application/json" },
      queryStringParameters: { proposalId : data.id},
    });
    if(data.status===6){
      setBakers(bakers.data.filter((baker)=>(baker.dateBacked!==null)));
    }
    else{
      setBakers(bakers.data);
    }
    setLoadBakers(false);
  };
  return (
   
    <Modal
      show={showBakersModal}
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
        {strings.backersListFor} {data.title} 
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
      {loadBakers ? (
      <Row>
        <Col>
          <div className="app-page-loader py-5 app-modal-spinner">
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
      {bakers &&
                bakers?.map((b: any, index) => (
                  <Row key={index}>
                    <Col>
                    <SingleBaker proposalData={data} data={b} closeModal={()=>handleCloseModal} isBorrow={isBorrow}/>

                    </Col>
                  </Row>
                ))}
                     {bakers&&bakers.length<=0 &&
               
                  <Row className='mt-4'>
                    <Col className="text-center">
                    <h5>{strings.noDataToShow}</h5>
                    </Col>
                  </Row>
                }
                </Fragment>
                 )}
      </Modal.Body>
    </Modal>
  );
}
export default BakersList;
