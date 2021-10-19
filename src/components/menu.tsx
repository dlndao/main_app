import React, { Fragment, useEffect, useState } from "react";
import { Navbar, Nav,Dropdown } from "react-bootstrap";
import RoiLogo from "../Assets/Images/RoiLogo.png";
import msgCenter from "../Assets/Images/icons/msgCenter.png";
import { Link ,useHistory} from "react-router-dom";
import { Avatar } from "@material-ui/core";
import bg from "../Assets/Images/bg.png";
import classNames from "classnames";
import helpDemoIcon from "../Assets/Images/icons/helpDemo.png";
import helpModeDisabledIcon from "../Assets/Images/icons/helpDemo-disable.png";
import { toast } from "react-toastify";
import { Tooltip as MaterialToolTip } from '@material-ui/core';
import SingleChat from "./singleChat";
import ConfirmationModal from "./confirmationModal";
import strings from "../localization/localization";
import { Storage } from "aws-amplify";
import { API,  Auth } from 'aws-amplify';

function Menu({ isStart = false }) {
  let history: any = useHistory();

  let storage: any = localStorage.getItem('mfiData')
  let mfiData: any = storage ? JSON.parse(storage) : null;
  let dlnWebSite: any = "https://dln.org/#/"
  const [logoSrc, setLogoSrc] = useState(RoiLogo);
  const [webSite, setWebSite] = useState(dlnWebSite);
  const [mfiName, setMfiName] = useState();
  const [showChatModal, setChatModal] = useState(false);
  const [openHelpModeText, setOpenHelpModeText] = useState("");
  const [profileImg, setProfileImg]: any = useState();
  const [messagesCount, setMessagesCount] = useState(0)
  const [showSignOutModal, setShowSignOutModal] = useState(false);
  const [userData, setUserData]: any = useState(null);

  useEffect(() => {
    (async () => {
    const language: any = localStorage.getItem("language");
    if (language) {
          strings.setLanguage(language);
    }
          setOpenHelpModeText(strings.openHelpMode)
    const DemoMode: any = localStorage.getItem("IsDemoMode");
    if (DemoMode === "true") {
      setIsDemoMode(DemoMode === "true" ? true : false);
    }
    if (mfiData) {
      setLogoSrc(mfiData.logo)
      setWebSite(mfiData.website)
      setMfiName(mfiData.name)
    }
    let data:any = localStorage.getItem('userData');
    if(data){
     const _userData=JSON.parse(data);
     setUserData(_userData)
    const imgURl=await Storage.get(_userData.profileImage)
    let currentUserInfo = await Auth.currentUserInfo();
    
    const messages = await API.get("auth", "/api/auth/", {
      headers: { "Content-Type": "application/json" },
      queryStringParameters: { username: currentUserInfo?.username },
    });
    setMessagesCount(messages.data.unreadMessagesCount)
    setProfileImg(imgURl)
    }
  })()}, [localStorage.getItem('mfiData')])
  const [isDemoMode, setIsDemoMode] = useState(false);

  const handleDemoMode = () => {
    let IsDemoMode = localStorage.getItem("IsDemoMode");
    localStorage.setItem(
      "IsDemoMode",
      JSON.stringify(
        IsDemoMode === "false" || IsDemoMode === null ? true : false
      )
    );
    IsDemoMode = localStorage.getItem("IsDemoMode");
    if (IsDemoMode === "true") {
      toast.success("Help Demo Mode Activated");
      let tooltip = document.getElementsByClassName("dln-poppver-tooltip");
      if (tooltip) {
        for (var ele of tooltip) {
          ele.classList.remove("d-none");
        }
      }
      setIsDemoMode(true);
    } else {
      toast.success("Help Demo Mode Deactivated");
      let tooltip = document.getElementsByClassName("dln-poppver-tooltip");
      if (tooltip) {
        for (var ele of tooltip) {
          ele.classList.add("d-none");
        }
      }
      setIsDemoMode(false);

    }
    window.location.reload();
  };
  const SignOut=async()=>{
    await Auth.signOut({ global: true });
    localStorage.removeItem('userData');
    if(mfiName){
    history.push(`/App/Login/${mfiName}`);
    }
    else{
    history.push(`/App/Login`);

    }
  }

  return (
    <Navbar
      className={classNames("app-menu d-flex justify-content-between", isStart && "app-menu-start")}
      expand="lg"
      style={{ backgroundImage: `url(${bg})` }}
    >
      {!isStart &&userData && userData.id !== "" && (
        <Fragment>
            <Dropdown className="app-profile-dd">
          <Dropdown.Toggle  className="app-user-img"  id="dropdown-basic">
     
          <Avatar src={profileImg} alt="user image" className="app-user-avatar" />
        </Dropdown.Toggle>
          <Dropdown.Menu>
          <Dropdown.Item >  <Link
          to={{
            pathname: "/App/Profile",
          }}
        >
         {strings.profile}
        </Link></Dropdown.Item>
          <Dropdown.Item onClick={()=>setShowSignOutModal(true)} >{strings.signOut}</Dropdown.Item>
        </Dropdown.Menu>
        </Dropdown>
        {showSignOutModal && (
                      <ConfirmationModal
                        message={strings.confirmationSignOut}
                        ConfirmationModalConfirm={() =>
                          SignOut()
                        }
                        ConfirmationModalCancel={() =>
                          setShowSignOutModal(false)
                        }
                      />
                    )}
        </Fragment>
        )}


      <a href={webSite ? webSite : dlnWebSite} className={`app-logo navbar-brand ${userData && userData.id !== ""?"loggedUserMode":""}`} target="_blank" rel="noopener noreferrer">
        <div style={{ backgroundImage: `url(${logoSrc})` }} className="app-logo-img "></div>
      </a>



      {!isStart && userData && userData.id !== ""&&(
        <Nav >
          <MaterialToolTip
            PopperProps={{ disablePortal: true }}
            classes={{
              tooltip: isDemoMode ? 'd-none' : 'dln-tooltip',
              arrow: 'dln-tooltip-arrow',
            }}
            arrow
            placement='top'
            title={openHelpModeText}
          >
            <div className="app-mobile-menu mt-2  app-help-mode cursor-pointer">
              <img
                onClick={() => handleDemoMode()}
                src={isDemoMode ? helpDemoIcon : helpModeDisabledIcon}
                alt="dln logo"
                className="mr-1 cursor-pointer"
              /></div></MaterialToolTip>
          <Nav.Link className="app-mobile-menu" >
            <div>
              {messagesCount > 0 ?
                <div className="app-msg-popup">
                  {messagesCount}
                </div> : null
              }
              <img src={msgCenter} alt="menu" onClick={() => setChatModal(true)} />
            </div>


          </Nav.Link>
          {showChatModal && (
            <SingleChat
              isAll={true}
              proposalId={null}
              proposalTitle={''}
              InviteModalClosed={() => {
                setChatModal(false);
              }}
            />
          )}
        </Nav>

      )}
    </Navbar>
  );
}
export default Menu;
