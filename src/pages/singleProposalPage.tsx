import React, { Fragment, useState, useEffect, useRef } from "react";
import { Row, Col, Form, Overlay, Tooltip, Spinner } from "react-bootstrap";
import { Avatar } from "@material-ui/core";
import { toast } from "react-toastify";
import validator from "validator";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useUserState } from "contexts/UserAuthContext";

import {
  editIcon,
  repayCSIcon,
  chatIcon,
  unpublishIcon,
  inviteIcon,
  saveIcon,
  cancelIcon,
  bakersIcon,
  bakedCSIcon,
  fundedCSIcon,
  bakedAmountIcon,
  cashIcon,
  repayIcon,
  publishCSIcon,
  publishIcon,
  deleteIcon,
  draftCSIcon,
  lockCSIcon,
  approveIcon,
  ignoreIcon,
  investIcon,
  plusLight
} from "../Assets/Images/index";
import InviteUsers from "../components/inviteUsers";
import InvestModal from "../components/investModal";
import classNames from "classnames";
import SingleChat from "../components/singleChat";
import { Tooltip as MaterialToolTip } from "@material-ui/core";
import PhotoAlbum from "../components/imagesAlbum";
import ProposalImagesLog from "../components/proposalImagesLog";
import { Storage, API } from "aws-amplify";
import BakersList from "../components/bakersList";
import ConfirmationModal from "../components/confirmationModal";
import strings from "../localization/localization";
import { TwitterIcon, TwitterShareButton } from "react-share";
import { v4 as uuid } from 'uuid';
import RepayModal from '../components/repayModal'
import { useLocation } from "react-router-dom";
import Menu from "../components/menu";
import Footer from "../components/footer";
import { Link } from "react-router-dom";
Storage.configure({
  bucket: "dlnresources182402-dev",
  level: "public",
});
function SingleProposalPage() {
  const fileInput: any = React.useRef<HTMLInputElement>();
  const { user }: any = useUserState();
  const search = useLocation().search;
  const id = new URLSearchParams(search).get('id');
  const mfi = new URLSearchParams(search).get('mfi');
  const titleInputRef = useRef(null);


  const [isDemoMode, setIsDemoMode] = useState(false);
  const [showBakersModal, setShowBakersModal] = useState(false);

  const [isEditbuttonClicked, setIsEditbuttonClicked] = useState(false);
  const [isrepaybuttonClicked, setIsrepaybuttonClicked] = useState(false);
  const [ispublishbuttonClicked, setIspublishbuttonClicked] = useState(false);
  const [isunpublishbuttonClicked, setIsunpublishbuttonClicked] = useState(
    false
  );
  const [isMsgbuttonClicked, setIsMsgbuttonClicked] = useState(false);
  const [isbakedbuttonClicked, setIsbakedbuttonClicked] = useState(false);
  const [isinvitebuttonClicked, setIsinivtebuttonClicked] = useState(false);
  const [isBakersListbuttonClicked, setIsBakersLisbuttonClicked] = useState(
    false
  );
  const [isWithdrawbuttonClicked, setIsWithdrawbuttonClicked] = useState(false);
  const [isDeletebuttonClicked, setIsDeletebuttonClicked] = useState(false);
  const [isApprovebuttonClicked, setIsApprovebuttonClicked] = useState(false);
  const [isIgnorebuttonClicked, setIsIgnorebuttonClicked] = useState(false);
  const [isInvestbuttonClicked, setIsInvestbuttonClicked] = useState(false);

  const [isPicInputClicked, setisPicInputClicked] = useState(false);
  const [istitleInputClicked, setistitleInputClicked] = useState(false);
  const [isamountinputClicked, setisamountinputClicked] = useState(false);
  const [ismonthInputClicked, setismonthInputClicked] = useState(false);
  const [isdateInputClicked, setisdateInputClicked] = useState(false);
  const [isdescInputClicked, setisdescInputClicked] = useState(false);
  const [isStatusIconClick, setStatusIconClicked] = useState(false);
  const [isUploadImagesClicked, setIsUploadImagesClicked] = useState(false);

  const [isTweetbuttonClicked, setIsTweetbuttonClicked] = useState(false);
  const [isShowTweet, setIsShowTweet] = useState(false);
  const [isImagesLogShow, setImagesLogShow] = useState(false);

  const [userData, setUserData]: any = useState();
  const [mfiId, setMFIID] = useState(false);
  const [mfiName, setMFIName] = useState();
  const [showRepayModal, setShowRepayModal] = useState(false)
  const [data, setData]: any = useState()
  const [enterAPI, setEnterAPI] = useState(false);
  const [loadProposal, setLoadProposal] = useState(true);

  let storage: any = localStorage.getItem("mfiData");
  let mfiData: any = storage ? JSON.parse(storage) : null;
  const removeClass = (className) => {
    let tooltip = document.getElementsByClassName(className);
    if (tooltip) {
      for (var ele of tooltip) {
        ele.classList.add("d-none");
        ele.classList.remove("show");
      }
    }
  };

  const removeClickIcons = () => {
    setIsEditbuttonClicked(false);
    setIsrepaybuttonClicked(false);
    setIspublishbuttonClicked(false);
    setIsunpublishbuttonClicked(false);
    setIsMsgbuttonClicked(false);
    setIsbakedbuttonClicked(false);
    setIsinivtebuttonClicked(false);
    setIsBakersLisbuttonClicked(false);
    setIsWithdrawbuttonClicked(false);
    setIsDeletebuttonClicked(false);
    setIsIgnorebuttonClicked(false);
    setIsApprovebuttonClicked(false);
    setIsInvestbuttonClicked(false);
    setismonthInputClicked(false);
    setistitleInputClicked(false);
    setisdateInputClicked(false);
    setisamountinputClicked(false);
    setisdescInputClicked(false);
    setisPicInputClicked(false);
    setStatusIconClicked(false);
    setIsTweetbuttonClicked(false);
    setIsUploadImagesClicked(false);
  };
  const [unReadMessage, setUnreadMessage] = useState(0);
  useEffect(() => {
    (async () => {
      getMFIData(mfi);
      const language: any = localStorage.getItem("language");
      if (language) {
        strings.setLanguage(language);
      }


      const DemoMode: any = localStorage.getItem("IsDemoMode");
      if (DemoMode === "true") {
        setIsDemoMode(DemoMode === "true" ? true : false);
        setIsShowTweet(false);
      } else {
        setIsShowTweet(true);
      }
      const bakers = await API.get("auth", "/api/borrow/findOne", {
        headers: { "Content-Type": "application/json" },
        queryStringParameters: { id: id },
      }).then((response) => {
        if (response.data && response.data !== "") {
          setData(response.data)
          let data = response.data;
          setState({
            ...state,
            inputs: {
              loanValue: data.amount,
              desc: data.description,
              proposalDate: new Date(data.startDate),
              id: data.id,
              proposalName: data.title,
              loanTerm: "",
              monthsToRepay: data.monthsToRepay ? data.monthsToRepay : "",
              oldloanValue: data.amount,
              olddesc: data.description,
              oldproposalDate: new Date(data.startDate),
              oldproposalName: data.title,
              oldmonthsToRepay: data.monthsToRepay ? data.monthsToRepay : "",
              mfiId: data.mfiId,
              userName: ""

            },
          });
          let currentData = localStorage.getItem("userData");


          if (currentData) {
            const _userData = JSON.parse(currentData)
            setUserData(_userData);

            if (_userData.id === data.userId) {
              setIsBorrow(true)
            } else {

            }
            if (_userData.userMfis.length > 0) {
              setIsMfi(true)
            }
          }

          if (mfiData) {
            setMFIID(mfiData.id);
            setMFIName(mfiData.name);
          }
          setUnreadMessage(data.unreadMessagesCount);
          setProfileImg(data.image);
          setProfileOldImg(data.image);
          setLoadProposal(false);
        } else {
          setState({ ...state, isUpdateMode: true });
        }
      });
    })()

  }, []);
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
  const handleSave = async (e, isPublish) => {
    setShowErrors(true);
    e.preventDefault();
    if (
      state.inputs.loanValue !== "" &&
      state.inputs.monthsToRepay !== "" &&
      state.inputs.proposalName !== "" &&
      parseFloat(state.inputs.loanValue) >= 1 &&
      state.inputs.desc !== "" &&
      state.inputs.proposalDate !== null &&
      state.inputs.proposalDate !== undefined &&
      !validator.isEmpty(state.inputs.proposalDate.toDateString())
    ) {
      if (isPublish) {
        setSavePublishClicked(true);
      } else {
        setSaveClicked(true);
      }
      let key: any;
      if (uploadImage) {
        key = await saveImage(fileName, fileData, fileType);
      }//  else {
      //   key = data.image;
      // }
      const {
        loanValue,
        desc,
        proposalDate,
        proposalName,
        monthsToRepay,
      } = state.inputs;
      await API.post("auth", "/api/borrow", {
        headers: { "Content-Type": "application/json" },
        body: {
          currentBalance: 0,
          address: "",
          amount: loanValue,
          status: isPublish ? 2 : 1,
          startDate: proposalDate,
          description: desc,
          title: proposalName,
          monthsToRepay: monthsToRepay,
          image: key,
          mfiId: mfiId ? mfiId : 3,
          userId: userData.id,
        },
      }).then((response) => {

        setState({
          ...state,
          isUpdateMode: false,
        });
        toast.success("Proposal Saved Successfully");

        setUploadImage(false);
        setSaveClicked(false);
        setSavePublishClicked(false);
      });
    }
  };
  const getMFIData = async (mfi) => {
    const mfiData = await API.get("auth", "/api/mfi", {
      headers: { "Content-Type": "application/json" },
      queryStringParameters: { name: mfi ? mfi : "roi" },
    }).then((response) => {
      localStorage.removeItem("mfiData");
      if (response) {
        localStorage.setItem("mfiData", JSON.stringify(response));
        setEnterAPI(true);
      } else {
        setEnterAPI(true);
      }
    });
  };
  // const handleUpdate = async (e, id) => {
  //   let key: any;
  //   if (uploadImage) {
  //     key = await saveImage(fileName, fileData, fileType);
  //   } else {
  //     key = data.key;
  //   }
  //   setShowErrors(true);

  //   const selectedId = id;
  //   e.preventDefault();
  //   if (
  //     state.inputs.loanValue !== "" &&
  //     state.inputs.monthsToRepay !== "" &&
  //     state.inputs.proposalName !== "" &&
  //     parseFloat(state.inputs.loanValue) >= 1 &&
  //     state.inputs.desc !== "" &&
  //     state.inputs.proposalDate !== null &&
  //     state.inputs.proposalDate !== undefined &&
  //     !validator.isEmpty(state.inputs.proposalDate.toDateString())
  //   ) {
  //     const {
  //       loanValue,
  //       desc,
  //       proposalDate,
  //       proposalName,
  //       monthsToRepay,
  //     } = state.inputs;

  //     await API.patch("auth", `/api/borrow/update`, {
  //       headers: { "Content-Type": "application/json" },
  //       queryStringParameters: { id: selectedId },
  //       body: {
  //         amount: loanValue,
  //         startDate: proposalDate,
  //         description: desc,
  //         title: proposalName,
  //         monthsToRepay: monthsToRepay,
  //         image: key,
  //       },
  //     }).then((response) => {
  //       setState({
  //         ...state,
  //         isUpdateMode: false,
  //       });
  //       toast.success("Proposal updated Successfully");
  //       if (isAdd) {
  //         CallAddProposalCanceled();
  //       }
  //       callSpinner();
  //       setUploadImage(false);
  //     });
  //   }
  // };
  const IntialInputs = () => ({
    inputs: {
      proposalName: "",
      loanValue: "",
      loanTerm: "",
      proposalDate: new Date(),
      monthsToRepay: "",
      desc: "",
      id: "",
      mfiId: "",
      userName: "",
      oldloanValue: "",
      olddesc: "",
      oldproposalDate: new Date(),
      oldproposalName: "",
      oldmonthsToRepay: "",
    },
    isUpdateMode: false,
  });
  const [state, setState] = useState(IntialInputs());
  const [profileImg, setProfileImg] = useState("");
  const [profileOldImg, setProfileOldImg] = useState("");
  const [saveClicked, setSaveClicked] = useState(false);
  const [savePublishClicked, setSavePublishClicked] = useState(false);
  const [showErrors, setShowErrors] = useState(false);
  const [fileName, setFileName] = useState("");
  const [fileData, setFileData] = useState();
  const [fileType, setFileType] = useState();
  const [uploadImage, setUploadImage] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showChatModal, setChatModal] = useState(false);
  const [showPhotoAlbum, setShowPhotoAlbum] = useState(false);
  const [showInvestModal, setShowInvestModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [showUnPublishModal, setShowUnPublishModal] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showIgnoreModal, setShowIgnoreModal] = useState(false);
  // missing vars 

  const [isMfi, setIsMfi] = useState(false)
  const [isBorrow, setIsBorrow] = useState(false)
  // ========
  const editAction = useRef(null);
  const draftAction = useRef(null);
  const repayAction = useRef(null);
  const publishAction = useRef(null);
  const unpublishAction = useRef(null);
  const msgAction = useRef(null);
  const bakedAction = useRef(null);
  const inviteAction = useRef(null);
  const bakersListAction = useRef(null);
  const withdrawAction = useRef(null);
  const deleteAction = useRef(null);
  const approveAction = useRef(null);
  const ignoreAction = useRef(null);
  const investAction = useRef(null);

  const monthsInputRef = useRef(null);
  const amountInputRef = useRef(null);
  const dateinputref = useRef(null);
  const picinputref = useRef(null);
  const descinputref = useRef(null);
  const draftIconRef = useRef(null);
  const lockedIconRef = useRef(null);
  const fundedIconRef = useRef(null);
  const publishedIconRef = useRef(null);
  const repaidIconRef = useRef(null);
  const backedIconRef = useRef(null);
  const tweetAction = useRef(null);
  const uploadImagesref = useRef(null);


  const handleUpdate = async (e, id) => {
    let key: any;
    if (uploadImage) {
      key = await saveImage(fileName, fileData, fileType);
    } else {
      key = data.key;
    }
    setShowErrors(true);

    const selectedId = id;
    e.preventDefault();
    if (
      state.inputs.loanValue !== "" &&
      state.inputs.monthsToRepay !== "" &&
      state.inputs.proposalName !== "" &&
      parseFloat(state.inputs.loanValue) >= 1 &&
      state.inputs.desc !== "" &&
      state.inputs.proposalDate !== null &&
      state.inputs.proposalDate !== undefined &&
      !validator.isEmpty(state.inputs.proposalDate.toDateString())
    ) {
      const {
        loanValue,
        desc,
        proposalDate,
        proposalName,
        monthsToRepay,
      } = state.inputs;

      await API.patch("auth", `/api/borrow/update`, {
        headers: { "Content-Type": "application/json" },
        queryStringParameters: { id: selectedId },
        body: {
          amount: loanValue,
          startDate: proposalDate,
          description: desc,
          title: proposalName,
          monthsToRepay: monthsToRepay,
          image: key,
        },
      }).then((response) => {
        setState({
          ...state,
          isUpdateMode: false,
        });
        toast.success("Proposal updated Successfully");
        // if (isAdd) {
        //   CallAddProposalCanceled();
        // }
        //callSpinner();
        setUploadImage(false);
      });
    }
  };

  const handleChange = (e) => {
    const { value, name } = e.target;
    const { inputs } = state;

    inputs[name] = value;
    setState({
      ...state,
      inputs,
    });
  };

  const upload = async (e) => {
    const genericId = uuid();
    setUploadImage(true);
    setProfileImg(URL.createObjectURL(e.target.files[0]));
    let file = fileInput.current.files[0];
    let reader = new FileReader();
    reader.readAsArrayBuffer(file);
    setFileType(e.target.files[0].type);
    setFileName(
      state.inputs.id !== ""
        ? state.inputs.id + "_" + e.target.files[0].name
        : genericId + "_" + e.target.files[0].name
    );
    reader.onload = async (event: any) => {
      setFileData(event.target.result);
    };
  };
  const handleDateChange = (date, name) => {
    const { inputs }: any = state;
    inputs[name] = date;

    setState({
      ...state,
      inputs,
    });
  };
  const handleEdit = (id) => {
    const DemoMode: any = localStorage.getItem("IsDemoMode");
    if (DemoMode === "true") {
      removeClickIcons();
      setIsDemoMode(DemoMode === "true" ? true : false);
      setIsEditbuttonClicked(!isEditbuttonClicked);
    } else {
      removeClass("dln-poppver-tooltip");
      removeClickIcons();
      setState({ ...state, isUpdateMode: true });
    }
  };
  const handleCancel = () => {
    setState({
      ...state,
      isUpdateMode: false,
      inputs: {
        ...state.inputs,
        loanValue: state.inputs.oldloanValue,
        desc: state.inputs.olddesc,
        proposalDate: new Date(state.inputs.oldproposalDate),
        proposalName: state.inputs.oldproposalName,
        monthsToRepay: state.inputs.oldmonthsToRepay,
      },
    });
    setProfileImg(profileOldImg);
  };
  const handleOpenModalPublish = async (e, isPublish) => {
    const DemoMode: any = localStorage.getItem("IsDemoMode");
    if (DemoMode === "true") {
      removeClickIcons();
      setIsDemoMode(DemoMode === "true" ? true : false);
      if (isPublish) {
        setIspublishbuttonClicked(!ispublishbuttonClicked);
      } else {
        setIsunpublishbuttonClicked(!isunpublishbuttonClicked);
      }
    } else {
      removeClass("dln-poppver-tooltip");
      removeClickIcons();
      if (isPublish) {
        setShowPublishModal(true);
      } else {
        setShowUnPublishModal(true);
      }
    }
  };
  const handlePublishProposal = async (e, id, isPublish) => {
    const DemoMode: any = localStorage.getItem("IsDemoMode");
    if (DemoMode === "true") {
      removeClickIcons();
      setIsDemoMode(DemoMode === "true" ? true : false);
      if (isPublish) {
        setIspublishbuttonClicked(!ispublishbuttonClicked);
      } else {
        setIsunpublishbuttonClicked(!isunpublishbuttonClicked);
      }
    } else {
      removeClass("dln-poppver-tooltip");
      removeClickIcons();
      await API.patch("auth", `/api/borrow/update`, {
        headers: { "Content-Type": "application/json" },
        queryStringParameters: { id: id },
        body: {
          id: id,
          status: isPublish ? 2 : 1,
        },
      }).then((response) => {
        if (isPublish) {
          toast.success(`Proposal Published Successfully`);
        } else {
          toast.success(`Proposal unPublished Successfully`);
        }
      });
    }
  };
  const handleInvite = (e) => {
    const DemoMode: any = localStorage.getItem("IsDemoMode");
    if (DemoMode === "true") {
      removeClickIcons();
      setIsDemoMode(DemoMode === "true" ? true : false);
      setIsinivtebuttonClicked(!isinvitebuttonClicked);
    } else {
      removeClass("dln-poppver-tooltip");
      removeClickIcons();
      setShowInviteModal(true);
    }
  };
  const handleInvest = (e) => {
    const DemoMode: any = localStorage.getItem("IsDemoMode");
    if (DemoMode === "true") {
      removeClickIcons();
      setIsDemoMode(DemoMode === "true" ? true : false);
      setIsInvestbuttonClicked(!isInvestbuttonClicked);
    } else {
      removeClass("dln-poppver-tooltip");
      removeClickIcons();
      setShowInvestModal(true);
    }
  };
  const handleOpenBackers = (e) => {
    const DemoMode: any = localStorage.getItem("IsDemoMode");
    if (DemoMode === "true") {
      removeClickIcons();
      setIsDemoMode(DemoMode === "true" ? true : false);
      setIsBakersLisbuttonClicked(!isBakersListbuttonClicked);
    } else {
      setShowBakersModal(true);
      removeClass("dln-poppver-tooltip");
      removeClickIcons();
    }
  };
  const handlebaked = (e) => {
    const DemoMode: any = localStorage.getItem("IsDemoMode");
    if (DemoMode === "true") {
      removeClickIcons();
      setIsDemoMode(DemoMode === "true" ? true : false);
      setIsbakedbuttonClicked(!isbakedbuttonClicked);
    } else {
      removeClass("dln-poppver-tooltip");
      removeClickIcons();
    }
  };
  const handlewithdraw = (e) => {
    const DemoMode: any = localStorage.getItem("IsDemoMode");
    if (DemoMode === "true") {
      removeClickIcons();
      setIsDemoMode(DemoMode === "true" ? true : false);
      setIsWithdrawbuttonClicked(!isWithdrawbuttonClicked);
    } else {
      removeClass("dln-poppver-tooltip");
      removeClickIcons();
    }
  };
  const handlerepay = (e) => {
    const DemoMode: any = localStorage.getItem("IsDemoMode");
    if (DemoMode === "true") {
      removeClickIcons();
      setIsDemoMode(DemoMode === "true" ? true : false);
      setIsrepaybuttonClicked(!isrepaybuttonClicked);
    } else {
      removeClass("dln-poppver-tooltip");
      removeClickIcons();
    }
  };
  const handleChat = (e) => {
    const DemoMode: any = localStorage.getItem("IsDemoMode");
    if (DemoMode === "true") {
      removeClickIcons();
      setIsDemoMode(DemoMode === "true" ? true : false);
      setIsMsgbuttonClicked(!isMsgbuttonClicked);
    } else {
      removeClass("dln-poppver-tooltip");
      removeClickIcons();
      setChatModal(true);
    }
  };
  const handleOpenModalDelete = async () => {
    const DemoMode: any = localStorage.getItem("IsDemoMode");
    if (DemoMode === "true") {
      removeClickIcons();
      setIsDemoMode(DemoMode === "true" ? true : false);
      setIsDeletebuttonClicked(!isDeletebuttonClicked);
    } else {
      setShowDeleteModal(true);
      removeClass("dln-poppver-tooltip");
      removeClickIcons();
    }
  };
  const handleDelete = async (id) => {
    await API.del("auth", `/api/borrow`, {
      headers: { "Content-Type": "application/json" },
      queryStringParameters: { id: id },
    }).then((response) => {
      toast.success("Proposal deleted Successfully");
    });
  };

  const handleOpenModalApprove = async () => {
    const DemoMode: any = localStorage.getItem("IsDemoMode");
    if (DemoMode === "true") {
      setIsDemoMode(DemoMode === "true" ? true : false);
      setIsApprovebuttonClicked(!isApprovebuttonClicked);
    } else {
      setShowApproveModal(true);
      removeClass("dln-poppver-tooltip");
      removeClickIcons();
    }
  };

  const handleApprove = async (e, id) => {
    await API.post("auth", `/api/mfi/approveProposal`, {
      headers: { "Content-Type": "application/json" },
      queryStringParameters: { mfiId: mfiId, proposalId: id },
    }).then((response) => {
      if (response.error?.toLowerCase() === "already approved") {
        setShowApproveModal(false);
        toast.warning(strings.proposalAlreadyApproved);
      } else {
        toast.success(`Proposal Approved Successfully`);
      }
    });
  };

  const handleOpenModalIgnore = async () => {
    const DemoMode: any = localStorage.getItem("IsDemoMode");
    if (DemoMode === "true") {
      setIsDemoMode(DemoMode === "true" ? true : false);

      setIsIgnorebuttonClicked(!isIgnorebuttonClicked);
    } else {
      removeClass("dln-poppver-tooltip");
      removeClickIcons();
      setShowIgnoreModal(true);
    }
  };

  const handleIgnore = async (e, id) => {
    await API.post("auth", `/api/borrow/ignoreProposal`, {
      headers: { "Content-Type": "application/json" },
      queryStringParameters: {
        userAddress: null,
        proposalId: id,
        userId: userData.id,
      },
    }).then((response) => {

      toast.success(`Proposal Ignored Successfully`);

    });
  };
  const handleInputClick = (input) => {
    const DemoMode: any = localStorage.getItem("IsDemoMode");
    if (DemoMode === "true") {
      setIsDemoMode(DemoMode === "true" ? true : false);
      removeClickIcons();
      if (input === "loanValue") {
        setisamountinputClicked(!isamountinputClicked);
      } else if (input === "desc") {
        setisdescInputClicked(!isdescInputClicked);
      } else if (input === "proposalDate") {
        setisdateInputClicked(!isdateInputClicked);
      } else if (input === "proposalName") {
        setistitleInputClicked(!istitleInputClicked);
      } else if (input === "profileImg") {
        setisPicInputClicked(!isPicInputClicked);
      } else {
        setismonthInputClicked(!ismonthInputClicked);
        // setStatusIconClicked(!isStatusIconClick);
      }
    } else {
      if (input == "profileImg") {
        setShowPhotoAlbum(true);
      }
      removeClass("dln-poppver-tooltip");
      removeClickIcons();
    }
  };

  const handleStatusIconClick = () => {
    const DemoMode: any = localStorage.getItem("IsDemoMode");
    if (DemoMode === "true") {
      setIsDemoMode(DemoMode === "true" ? true : false);
      removeClickIcons();
      setStatusIconClicked(!isStatusIconClick);
    }
  };
  const handleTweetProposal = async () => {
    return new Promise(() => {
      const DemoMode: any = localStorage.getItem("IsDemoMode");

      if (DemoMode === "true") {
        setIsDemoMode(DemoMode === "true" ? true : false);
        removeClickIcons();
        setIsTweetbuttonClicked(!isTweetbuttonClicked);
        setIsShowTweet(false);
      } else {
        setIsShowTweet(true);
        setIsDemoMode(false);
        removeClass("dln-poppver-tooltip");
        removeClickIcons();
      }
    });
  };
  const handleUploadImagesClick = (e) => {
    const DemoMode: any = localStorage.getItem("IsDemoMode");
    if (DemoMode === "true") {
      setIsDemoMode(DemoMode === "true" ? true : false);
      removeClickIcons();
      setIsUploadImagesClicked(!isUploadImagesClicked);
    } else {
      // setShowPhotoAlbum(true);
      e.stopPropagation();
      setImagesLogShow(true);
      setIsDemoMode(false);
      removeClass("dln-poppver-tooltip");
      removeClickIcons();
    }
  };
  return (
    <Fragment>
      {loadProposal ? (
        <Row>
          <Col>
            <div className="app-page-loader app-all-page-loader py-5">
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
          <Menu isStart={true} />
          <Row className="justify-content-center app-inner-page ">
            <Col
              xl={7} lg={7} md={7} sm={12}
              className={classNames(
                "app-single-prop",
              )}
            >


              <Form className="app-form py-5">
                <Row>
                  <Col className="col-auto app-user-profile-img-main text-left dln-proposal-page-avatar ">
                    <div className=" position-relative">
                      <label
                        // htmlFor={`contained-button-file-${state.inputs.id}`}
                        className={classNames(
                          "app-user-profile-img-container",
                          state.isUpdateMode ? "cursor-pointer" : ""
                        )}
                      >
                        <MaterialToolTip
                          PopperProps={{ disablePortal: true }}
                          classes={{
                            tooltip: isDemoMode ? "d-none" : "dln-tooltip",
                            arrow: "dln-tooltip-arrow",
                          }}
                          arrow
                          placement="top"
                          title={strings.proposalPic}
                        >
                          <Avatar
                            alt=""
                            src={profileImg}
                            className="app-user-profile-img app-proposal-img"
                            ref={picinputref}
                            onClick={() => handleInputClick("profileImg")}
                          />
                        </MaterialToolTip>

                        <Overlay
                          target={picinputref}
                          show={isDemoMode === true && isPicInputClicked === true}
                          placement="top"
                        >
                          {(props) => (
                            <Tooltip
                              id="overlay-pic"
                              className="dln-poppver-tooltip"
                              {...props}
                            >
                              {strings.proposalPic}
                            </Tooltip>
                          )}
                        </Overlay>
                        <Overlay
                          target={uploadImagesref}
                          show={isDemoMode === true && isUploadImagesClicked === true}
                          placement="top"
                        >
                          {(props) => (
                            <Tooltip
                              id="overlay-pic"
                              className="dln-poppver-tooltip"
                              {...props}
                            >
                              {strings.uploadImage}
                              <p>{strings.UserCanUploadImages}</p>
                            </Tooltip>
                          )}
                        </Overlay>
                        {data?.status === 4 && (
                          <div className="app-badge-container">
                            <img
                              src={bakedCSIcon}
                              alt="icon"
                              className="app-proposal-badge"
                              ref={backedIconRef}
                              onClick={() => setStatusIconClicked(!isStatusIconClick)}
                            />
                            <Overlay
                              target={backedIconRef}
                              show={isDemoMode === true && isStatusIconClick === true}
                              placement="top"
                            >
                              {(props) => (
                                <Tooltip
                                  id="status-icon"
                                  className="dln-poppver-tooltip"
                                  {...props}
                                >
                                  {strings.backedProposal}
                                </Tooltip>
                              )}
                            </Overlay>
                          </div>
                        )}
                        {data?.status === 5 && (
                          <div className="app-badge-container">
                            <img
                              src={fundedCSIcon}
                              alt="icon"
                              className="app-proposal-badge"
                              ref={fundedIconRef}
                              onClick={() => handleStatusIconClick()}
                            />
                            <Overlay
                              target={publishedIconRef}
                              show={isDemoMode === true && isStatusIconClick === true}
                              placement="top"
                            >
                              {(props) => (
                                <Tooltip
                                  id="status-icon"
                                  className="dln-poppver-tooltip"
                                  {...props}
                                >
                                  {strings.fundedProposal}
                                </Tooltip>
                              )}
                            </Overlay>
                          </div>
                        )}
                        {data?.status === 3 && (
                          <div className="app-badge-container">
                            <img
                              src={lockCSIcon}
                              alt="icon"
                              className="app-proposal-badge"
                              ref={lockedIconRef}
                              onClick={() => setStatusIconClicked(!isStatusIconClick)}
                            />
                            <Overlay
                              target={lockedIconRef}
                              show={isDemoMode === true && isStatusIconClick === true}
                              placement="top"
                            >
                              {(props) => (
                                <Tooltip
                                  id="status-icon"
                                  className="dln-poppver-tooltip"
                                  {...props}
                                >
                                  {strings.lockedProposal}
                                </Tooltip>
                              )}
                            </Overlay>
                          </div>
                        )}
                        {data?.status === 1 && (
                          <div className="app-badge-container">
                            <img
                              src={draftCSIcon}
                              alt="icon"
                              className="app-proposal-badge"
                              ref={draftIconRef}
                              onClick={() => handleStatusIconClick()}
                            />
                            <Overlay
                              target={draftIconRef}
                              show={isDemoMode === true && isStatusIconClick === true}
                              placement="top"
                            >
                              {(props) => (
                                <Tooltip
                                  id="status-icon"
                                  className="dln-poppver-tooltip"
                                  {...props}
                                >
                                  {strings.draftedProposal}
                                </Tooltip>
                              )}
                            </Overlay>
                          </div>
                        )}
                        {data?.status === 2 && (
                          <div className="app-badge-container">
                            <img
                              src={publishCSIcon}
                              alt="icon"
                              className="app-proposal-badge"
                              ref={publishedIconRef}
                              onClick={() => handleStatusIconClick()}
                            />
                            <Overlay
                              target={publishedIconRef}
                              show={isDemoMode === true && isStatusIconClick === true}
                              placement="top"
                            >
                              {(props) => (
                                <Tooltip
                                  id="status-icon"
                                  className="dln-poppver-tooltip"
                                  {...props}
                                >
                                  {strings.puplishedProposal}
                                </Tooltip>
                              )}
                            </Overlay>
                          </div>
                        )}
                        {data?.status === 6 && (
                          <div className="app-badge-container">
                            <img
                              src={repayCSIcon}
                              alt="icon"
                              className="app-proposal-badge"
                              ref={repaidIconRef}
                              onClick={() => handleStatusIconClick()}
                            />
                            <Overlay
                              target={repaidIconRef}
                              show={isDemoMode === true && isStatusIconClick === true}
                              placement="top"
                            >
                              {(props) => (
                                <Tooltip
                                  id="status-icon"
                                  className="dln-poppver-tooltip"
                                  {...props}
                                >
                                  {strings.repaidProposal}
                                </Tooltip>
                              )}
                            </Overlay>
                          </div>
                        )}
                        <input
                          accept="*/*"
                          className="d-none"
                          type="file"
                          ref={fileInput}
                          onChange={(e) => upload(e)}
                          disabled={(!state.isUpdateMode)}
                        />
                      </label>


                      <MaterialToolTip
                        PopperProps={{ disablePortal: true }}
                        classes={{
                          tooltip: isDemoMode ? "d-none" : "dln-tooltip",
                          arrow: "dln-tooltip-arrow",
                        }}
                        arrow
                        placement="top"
                        title={strings.postUpdate}
                      >
                        <div className="app-image-album-container">
                          <img
                            src={plusLight}
                            alt="icon"
                            className="app-proposal-badge"
                            onClick={(e) => handleUploadImagesClick(e)}
                            ref={uploadImagesref}
                          />
                        </div>
                      </MaterialToolTip>

                      {isImagesLogShow && (
                        <ProposalImagesLog
                          photoLogClosed={() => {
                            setImagesLogShow(false);
                          }}
                          proposalTitle={state.inputs.proposalName}
                          proposalId={state.inputs.id}
                          isBorrow={false}
                        />
                      )}
                    </div>
                    {showPhotoAlbum && (
                      <PhotoAlbum
                        proposalId={data.id}
                        photoAlbumClosed={() => {
                          setShowPhotoAlbum(false);
                        }}
                        imagesArr={[profileImg]}
                      />
                    )}
                  </Col>
                  <Col className="app-proposal-right-side">
                    <Row>
                      <MaterialToolTip
                        PopperProps={{ disablePortal: true }}
                        classes={{
                          tooltip: isDemoMode ? "d-none" : "dln-tooltip",
                          arrow: "dln-tooltip-arrow",
                        }}
                        arrow
                        placement="top"
                        title={strings.proposalName}
                      >
                        <Col className="text-left">
                          <Form.Group>
                            <label
                              ref={titleInputRef}
                              className="w-100"
                              onClick={() => handleInputClick("proposalName")}
                            >
                              <Form.Control
                                type="text"
                                placeholder={strings.proposalName}
                                name="proposalName"
                                onChange={(e) => {
                                  handleChange(e);
                                }}
                                value={state.inputs.proposalName}
                                disabled={!state.isUpdateMode}
                              />
                            </label>
                            {showErrors === true &&
                              validator.isEmpty(state.inputs.proposalName) && (
                                <div className="app-error-msg">
                                  {strings.required}
                                </div>
                              )}
                            <Overlay
                              target={titleInputRef}
                              show={
                                isDemoMode === true && istitleInputClicked === true
                              }
                              placement="top"
                            >
                              {(props) => (
                                <Tooltip
                                  id="overlay-edit"
                                  className="dln-poppver-tooltip"
                                  {...props}
                                >
                                  {strings.proposalName}
                                </Tooltip>
                              )}
                            </Overlay>
                          </Form.Group>
                        </Col>
                      </MaterialToolTip>
                    </Row>
                    <Row>
                      <MaterialToolTip
                        PopperProps={{ disablePortal: true }}
                        classes={{
                          tooltip: isDemoMode ? "d-none" : "dln-tooltip",
                          arrow: "dln-tooltip-arrow",
                        }}
                        arrow
                        placement="top"
                        title={strings.proposalAmount}
                      >
                        <Col className="text-left pr-0">
                          <Form.Group>
                            <label
                              className="w-100"
                              ref={amountInputRef}
                              onClick={() => handleInputClick("loanValue")}
                            >
                              <Form.Control
                                type="number"
                                placeholder={strings.loanValue}
                                name="loanValue"
                                onChange={(e) => {
                                  handleChange(e);
                                }}
                                value={state.inputs.loanValue}
                                disabled={!state.isUpdateMode}
                                min={1}
                              />
                            </label>
                            {showErrors === true &&
                              validator.isEmpty(
                                state.inputs.loanValue.toString()
                              ) && (
                                <div className="app-error-msg">
                                  {strings.required}
                                </div>
                              )}
                            {showErrors === true &&
                              !validator.isEmpty(
                                state.inputs.loanValue.toString()
                              ) &&
                              parseFloat(state.inputs.loanValue.toString()) <=
                              0 && (
                                <div className="app-error-msg">
                                  {strings.valueMustBeGreeterThan1}
                                </div>
                              )}
                          </Form.Group>
                        </Col>
                      </MaterialToolTip>
                      <Overlay
                        target={amountInputRef}
                        show={isDemoMode === true && isamountinputClicked === true}
                        placement="top"
                      >
                        {(props) => (
                          <Tooltip
                            id="overlay-edit"
                            className="dln-poppver-tooltip"
                            {...props}
                          >
                            {strings.enterAmountOfMoney}
                          </Tooltip>
                        )}
                      </Overlay>
                      <MaterialToolTip
                        PopperProps={{ disablePortal: true }}
                        classes={{
                          tooltip: isDemoMode ? "d-none" : "dln-tooltip",
                          arrow: "dln-tooltip-arrow",
                        }}
                        arrow
                        placement="top"
                        title={strings.monthsToPayment}
                      >
                        <Col className="text-left">
                          <Form.Group>
                            <label
                              className="w-100"
                              ref={monthsInputRef}
                              onClick={() => handleInputClick("monthsToRepay")}
                            >
                              <Form.Control
                                type="number"
                                placeholder={strings.monthsToPayment}
                                name="monthsToRepay"
                                onChange={(e) => {
                                  handleChange(e);
                                }}
                                value={state.inputs.monthsToRepay}
                                disabled={!state.isUpdateMode}
                              />
                            </label>
                            {showErrors === true &&
                              validator.isEmpty(
                                state.inputs.monthsToRepay.toString()
                              ) && (
                                <div className="app-error-msg">
                                  {strings.required}
                                </div>
                              )}
                          </Form.Group>
                        </Col>
                      </MaterialToolTip>
                      <Overlay
                        target={monthsInputRef}
                        show={isDemoMode === true && ismonthInputClicked === true}
                        placement="top"
                      >
                        {(props) => (
                          <Tooltip
                            id="overlay-edit"
                            className="dln-poppver-tooltip"
                            {...props}
                          >
                            {strings.enterMonthsToRepy}
                          </Tooltip>
                        )}
                      </Overlay>
                    </Row>
                    {/* <Row>
            <Col className="text-left">
              <Form.Group>
                <Form.Control
                  type="text"
                  placeholder="Loan Term"
                  name="loanTerm"
                  onChange={(e) => {
                    handleChange(e);
                  }}
                  value={state.inputs.loanTerm}
                />
                {showErrors === true &&
                  validator.isEmpty(state.inputs.loanTerm) && (
                    <div className="app-error-msg">Required</div>
                  )}
              </Form.Group>
            </Col>
          </Row> */}
                    <Row>
                      <MaterialToolTip
                        PopperProps={{ disablePortal: true }}
                        classes={{
                          tooltip: isDemoMode ? "d-none" : "dln-tooltip",
                          arrow: "dln-tooltip-arrow",
                        }}
                        arrow
                        placement="top"
                        title={strings.proposalsDate}
                      >
                        <Col className="text-left">
                          <Form.Group>
                            <label
                              className="dln-datepicker"
                              ref={dateinputref}
                              onClick={() => handleInputClick("proposalDate")}
                            >
                              <DatePicker
                                name="proposalDate"
                                className="form-control"
                                selected={state.inputs.proposalDate}
                                onChange={(date, name) =>
                                  handleDateChange(date, "proposalDate")
                                }
                                popperPlacement="top"
                                disabled={!state.isUpdateMode}
                              />
                            </label>
                          </Form.Group>
                          {showErrors === true &&
                            (state.inputs.proposalDate === null ||
                              state.inputs.proposalDate === undefined ||
                              validator.isEmpty(
                                state.inputs.proposalDate.toDateString()
                              )) && (
                              <div className="app-error-msg">
                                {strings.required}
                              </div>
                            )}
                        </Col>
                      </MaterialToolTip>
                      <Overlay
                        target={dateinputref}
                        show={isDemoMode === true && isdateInputClicked === true}
                        placement="top"
                      >
                        {(props) => (
                          <Tooltip
                            id="overlay-edit"
                            className="dln-poppver-tooltip"
                            {...props}
                          >
                            {strings.proposalsDate}
                            <p>{strings.whenYouNeedToGetYourMoney}</p>
                          </Tooltip>
                        )}
                      </Overlay>
                    </Row>
                  </Col>
                </Row>
                <Row>
                  <MaterialToolTip
                    PopperProps={{ disablePortal: true }}
                    classes={{
                      tooltip: isDemoMode ? "d-none" : "dln-tooltip",
                      arrow: "dln-tooltip-arrow",
                    }}
                    arrow
                    placement="top"
                    title={strings.proposalDesc}
                  >
                    <Col className="text-left">
                      <Form.Group>
                        <label
                          className="w-100"
                          ref={descinputref}
                          onClick={() => handleInputClick("desc")}
                        >
                          <Form.Control
                            type="text"
                            as="textarea"
                            placeholder={strings.proposalDesc}
                            name="desc"
                            maxLength={256}
                            onChange={(e) => {
                              handleChange(e);
                            }}
                            value={state.inputs.desc}
                            disabled={!state.isUpdateMode}
                          />
                        </label>
                      </Form.Group>
                      {showErrors === true &&
                        validator.isEmpty(state.inputs.desc) && (
                          <div className="app-error-msg">{strings.required}</div>
                        )}
                    </Col>
                  </MaterialToolTip>
                  <Overlay
                    target={descinputref}
                    show={isDemoMode === true && isdescInputClicked === true}
                    placement="top"
                  >
                    {(props) => (
                      <Tooltip
                        id="overlay-edit"
                        className="dln-poppver-tooltip"
                        {...props}
                      >
                        {strings.describeYourProposalAndYourNeeds}
                      </Tooltip>
                    )}
                  </Overlay>
                </Row>

              </Form>
            </Col>
          </Row>
          <Row className="justify-content-center">
            {userData && userData.id !== '' ?
              <Row className="justify-content-around app-action-bar col-xl-7 col-lg-7 col-md-7 col-sm-12">
                {!state.isUpdateMode && (
                  <Fragment>
                    {!isBorrow && (
                      <Fragment>
                        {(data.status === 2 || data.status === 3) && (
                          <Col>
                            <MaterialToolTip
                              PopperProps={{ disablePortal: true }}
                              classes={{
                                tooltip: isDemoMode ? "d-none" : "dln-tooltip",
                                arrow: "dln-tooltip-arrow",
                              }}
                              arrow
                              placement="top"
                              title={strings.investProposal}
                            >
                              <img
                                className="app-action-icon"
                                src={investIcon}
                                alt="icon"
                                onClick={(e) => handleInvest(e)}
                                ref={investAction}
                              />
                            </MaterialToolTip>
                            {showInvestModal && (
                              <InvestModal
                                data={data}
                                InvestModalClosed={() => {
                                  setShowInvestModal(false);
                                  //  callSpinner();
                                }}
                              />
                            )}
                            <Overlay
                              target={investAction}
                              show={
                                isDemoMode === true &&
                                isInvestbuttonClicked === true
                              }
                              placement="top"
                            >
                              {(props) => (
                                <Tooltip
                                  id="overlay-invest"
                                  className="dln-poppver-tooltip"
                                  {...props}
                                >
                                  {strings.invest}
                                  <p>
                                    {strings.investDesc}
                                    {strings.approveProposal}
                                  </p>
                                </Tooltip>
                              )}
                            </Overlay>
                          </Col>
                        )}
                        {(data.status != 6 && isMfi) && (
                          <Col>
                            <MaterialToolTip
                              PopperProps={{ disablePortal: true }}
                              classes={{
                                tooltip: isDemoMode ? "d-none" : "dln-tooltip",
                                arrow: "dln-tooltip-arrow",
                              }}
                              arrow
                              placement="top"
                              title={strings.approveProposal}
                            >
                              <img
                                className="app-action-icon"
                                src={approveIcon}
                                alt="icon"
                                onClick={() => handleOpenModalApprove()}
                                ref={approveAction}
                              />
                            </MaterialToolTip>
                            {showApproveModal && (
                              <ConfirmationModal
                                message={strings.confirmationApprove}
                                ConfirmationModalConfirm={(e) =>
                                  handleApprove(e, state.inputs.id)
                                }
                                ConfirmationModalCancel={() =>
                                  setShowApproveModal(false)
                                }
                              />
                            )}
                            <Overlay
                              target={approveAction}
                              show={
                                isDemoMode === true &&
                                isApprovebuttonClicked === true
                              }
                              placement="top"
                            >
                              {(props) => (
                                <Tooltip
                                  id="overlay-edit"
                                  className="dln-poppver-tooltip"
                                  {...props}
                                >
                                  {strings.approveProposal}
                                  <p>{strings.userCanApproveProposal}</p>
                                </Tooltip>
                              )}
                            </Overlay>
                          </Col>
                        )}
                        {(data.status === 2 || data.status === 3) && (
                          <Fragment>
                            {" "}
                            <Col>
                              <MaterialToolTip
                                PopperProps={{ disablePortal: true }}
                                classes={{
                                  tooltip: isDemoMode ? "d-none" : "dln-tooltip",
                                  arrow: "dln-tooltip-arrow",
                                }}
                                arrow
                                placement="top"
                                title={strings.ignoreProposal}
                              >
                                <img
                                  className="app-action-icon"
                                  src={ignoreIcon}
                                  alt="icon"
                                  onClick={(e) => handleOpenModalIgnore()}
                                  ref={ignoreAction}
                                />
                              </MaterialToolTip>
                              {showIgnoreModal && (
                                <ConfirmationModal
                                  message={strings.confirmationIgnore}
                                  ConfirmationModalConfirm={(e) =>
                                    handleIgnore(e, state.inputs.id)
                                  }
                                  ConfirmationModalCancel={() =>
                                    setShowIgnoreModal(false)
                                  }
                                />
                              )}
                              <Overlay
                                target={ignoreAction}
                                show={
                                  isDemoMode === true &&
                                  isIgnorebuttonClicked === true
                                }
                                placement="top"
                              >
                                {(props) => (
                                  <Tooltip
                                    id="overlay-edit"
                                    className="dln-poppver-tooltip"
                                    {...props}
                                  >
                                    {strings.ignoreProposal}
                                    <p>{strings.ignoreProposalDesc}</p>
                                  </Tooltip>
                                )}
                              </Overlay>
                            </Col>
                          </Fragment>
                        )}
                      </Fragment>
                    )}
                    {(data.status === 1 ||
                      (data.status === 2 && isBorrow)) && (
                        <Col>
                          <MaterialToolTip
                            PopperProps={{ disablePortal: true }}
                            classes={{
                              tooltip: isDemoMode ? "d-none" : "dln-tooltip",
                              arrow: "dln-tooltip-arrow",
                            }}
                            arrow
                            placement="top"
                            title={strings.editYourProposal}
                          >
                            <img
                              className="app-action-icon"
                              src={editIcon}
                              alt="icon"
                              onClick={(e) => handleEdit(state.inputs.id)}
                              ref={editAction}
                            />
                          </MaterialToolTip>
                          <Overlay
                            target={editAction}
                            show={
                              isDemoMode === true && isEditbuttonClicked === true
                            }
                            placement="top"
                          >
                            {(props) => (
                              <Tooltip
                                id="overlay-edit"
                                className="dln-poppver-tooltip"
                                {...props}
                              >
                                {strings.editYourProposal}
                                <p>{strings.userCanEditHis}</p>
                              </Tooltip>
                            )}
                          </Overlay>
                        </Col>
                      )}
                    {data.status === 1 && isBorrow && (
                      <Col>
                        <MaterialToolTip
                          PopperProps={{ disablePortal: true }}
                          classes={{
                            tooltip: isDemoMode ? "d-none" : "dln-tooltip",
                            arrow: "dln-tooltip-arrow",
                          }}
                          arrow
                          placement="top"
                          title={strings.publishYourProposal}
                        >
                          <img
                            className="app-action-icon"
                            src={publishIcon}
                            alt="icon"
                            onClick={(e) => handleOpenModalPublish(e, true)}
                            ref={publishAction}
                          />
                        </MaterialToolTip>
                        {showPublishModal && (
                          <ConfirmationModal
                            message={strings.confirmationPublish}
                            ConfirmationModalConfirm={(e) =>
                              handlePublishProposal(e, state.inputs.id, true)
                            }
                            ConfirmationModalCancel={() =>
                              setShowPublishModal(false)
                            }
                          />
                        )}
                        <Overlay
                          target={publishAction}
                          show={
                            isDemoMode === true && ispublishbuttonClicked === true
                          }
                          placement="top"
                        >
                          {(props) => (
                            <Tooltip
                              id="overlay-publish"
                              className="dln-poppver-tooltip"
                              {...props}
                            >
                              {strings.publishYourProposal}
                              <p>{strings.userCanPublishHisDraftProposal}</p>
                            </Tooltip>
                          )}
                        </Overlay>
                      </Col>
                    )}

                    {data.status === 2 && isBorrow && (
                      <Col>
                        <MaterialToolTip
                          PopperProps={{ disablePortal: true }}
                          classes={{
                            tooltip: isDemoMode ? "d-none" : "dln-tooltip",
                            arrow: "dln-tooltip-arrow",
                          }}
                          arrow
                          placement="top"
                          title={strings.unpublishProposal}
                        >
                          <img
                            className="app-action-icon"
                            src={unpublishIcon}
                            alt="icon"
                            onClick={(e) => handleOpenModalPublish(e, false)}
                            ref={unpublishAction}
                          />
                        </MaterialToolTip>
                        {showUnPublishModal && (
                          <ConfirmationModal
                            message={strings.confirmationUnPublish}
                            ConfirmationModalConfirm={(e) =>
                              handlePublishProposal(e, state.inputs.id, false)
                            }
                            ConfirmationModalCancel={() =>
                              setShowUnPublishModal(false)
                            }
                          />
                        )}
                        <Overlay
                          target={unpublishAction}
                          show={
                            isDemoMode === true &&
                            isunpublishbuttonClicked === true
                          }
                          placement="top"
                        >
                          {(props) => (
                            <Tooltip
                              id="overlay-unpublish"
                              className="dln-poppver-tooltip"
                              {...props}
                            >
                              {strings.UnpublishYourPublishedProposal}
                              <p>{strings.unPublishYourProposalsDesc}</p>
                            </Tooltip>
                          )}
                        </Overlay>
                      </Col>
                    )}
                    {(data.status !== 1) && (
                      <Col>
                        <MaterialToolTip
                          PopperProps={{ disablePortal: true }}
                          classes={{
                            tooltip: isDemoMode ? "d-none" : "dln-tooltip",
                            arrow: "dln-tooltip-arrow",
                          }}
                          arrow
                          placement="top"
                          title={strings.seeBackers}
                        >
                          <img
                            className="app-action-icon"
                            src={bakersIcon}
                            alt="icon"
                            ref={bakersListAction}
                            onClick={(e) => {
                              handleOpenBackers(e);
                            }}
                          />
                        </MaterialToolTip>
                        {showBakersModal && (
                          <BakersList
                            data={data}
                            BakersModalClosed={() => {
                              setShowBakersModal(false);
                            }}
                          //  isBorrow={isBorrow}
                          />
                        )}
                        <Overlay
                          target={bakersListAction}
                          show={
                            isDemoMode === true &&
                            isBakersListbuttonClicked === true
                          }
                          placement="top"
                        >
                          {(props) => (
                            <Tooltip
                              id="overlay-edit"
                              className="dln-poppver-tooltip"
                              {...props}
                            >
                              {strings.seeBackers}
                              <p>{strings.userCanSeeHisBackersDesc}</p>
                            </Tooltip>
                          )}
                        </Overlay>
                      </Col>
                    )}
                    {(data.status === 3 || data.status === 4) && (
                      <Col>
                        <MaterialToolTip
                          PopperProps={{ disablePortal: true }}
                          classes={{
                            tooltip: isDemoMode ? "d-none" : "dln-tooltip",
                            arrow: "dln-tooltip-arrow",
                          }}
                          arrow
                          placement="top"
                          title={strings.collectedAmount}
                        >
                          <div>
                            <img
                              className="app-action-icon app-action__money"
                              src={bakedAmountIcon}
                              alt="icon"
                              ref={bakedAction}
                              onClick={(e) => {
                                handlebaked(e);
                              }}
                            />
                            <span className="ml-1 app-text-blue app-action-icon">
                              {data.currentBalance}
                            </span>
                          </div>
                        </MaterialToolTip>
                        <Overlay
                          target={bakedAction}
                          show={
                            isDemoMode === true && isbakedbuttonClicked === true
                          }
                          placement="top"
                        >
                          {(props) => (
                            <Tooltip
                              id="overlay-edit"
                              className="dln-poppver-tooltip"
                              {...props}
                            >
                              {strings.checkYourBackedAmount}
                              <p>{strings.checkYourBackedAmountDesc}</p>
                            </Tooltip>
                          )}
                        </Overlay>
                      </Col>
                    )}
                    {data.status === 5 && isBorrow && (
                      <Fragment>
                        <Col>
                          <MaterialToolTip
                            PopperProps={{ disablePortal: true }}
                            classes={{
                              tooltip: isDemoMode ? "d-none" : "dln-tooltip",
                              arrow: "dln-tooltip-arrow",
                            }}
                            arrow
                            placement="top"
                            title={strings.withDrawYourMoney}
                          >
                            <img
                              className="app-action-icon"
                              src={cashIcon}
                              alt="icon"
                              //  ref={withdrawAction}
                              onClick={(e) => {
                                handlewithdraw(e);
                              }}
                            />
                          </MaterialToolTip>
                          <Overlay
                            target={withdrawAction}
                            show={
                              isDemoMode === true &&
                              isWithdrawbuttonClicked === true
                            }
                            placement="top"
                          >
                            {(props) => (
                              <Tooltip
                                id="overlay-edit"
                                className="dln-poppver-tooltip"
                                {...props}
                              >
                                {strings.withDrawYourMoney}
                                <p>{strings.withDrawHisMoneyDesc}</p>
                              </Tooltip>
                            )}
                          </Overlay>
                        </Col>
                      </Fragment>
                    )}
                    {(data.status === 5 && isBorrow) || (isMfi && data.status === 5) ? (

                      <Col>
                        <MaterialToolTip
                          PopperProps={{ disablePortal: true }}
                          classes={{
                            tooltip: isDemoMode ? "d-none" : "dln-tooltip",
                            arrow: "dln-tooltip-arrow",
                          }}
                          arrow
                          placement="top"
                          title={strings.repayYourLoan}
                        >
                          <img
                            className="app-action-icon"
                            src={repayIcon}
                            alt="icon"
                            ref={repayAction}
                            onClick={(e) => {
                              handlerepay(e);
                            }}
                          />
                        </MaterialToolTip>
                        {showRepayModal && (
                          <RepayModal
                            data={data}
                            ismfi={isMfi}
                            RepayModalClosed={() => {
                              setShowRepayModal(false);
                            }}
                            isBorrow={isBorrow}
                          />
                        )}
                        <Overlay
                          target={repayAction}
                          show={
                            isDemoMode === true && isrepaybuttonClicked === true
                          }
                          placement="top"
                        >
                          {(props) => (
                            <Tooltip
                              id="overlay-edit"
                              className="dln-poppver-tooltip"
                              {...props}
                            >
                              {strings.repayYourLoan}
                              <p>{strings.userCanRepayDesc}</p>
                            </Tooltip>
                          )}
                        </Overlay>
                      </Col>
                    ) : null}

                    {(data.status !== 1 && data.status !== 6) && (
                      <Col className="justify-content-center d-flex">
                        <MaterialToolTip
                          PopperProps={{ disablePortal: true }}
                          classes={{
                            tooltip: isDemoMode ? "d-none" : "dln-tooltip",
                            arrow: "dln-tooltip-arrow",
                          }}
                          arrow
                          placement="top"
                          title={strings.messageTheInvestors}
                        >
                          <div
                            style={{ backgroundImage: `url(${chatIcon})` }}
                            ref={msgAction}
                            onClick={(e) => {
                              handleChat(e);
                            }}
                            className="app-action-icon app-action-chat-icon"
                          >
                            {unReadMessage && unReadMessage != 0 ? (
                              <div className="app-msg-popup-proposal-card">
                                {unReadMessage}
                              </div>
                            ) : null}
                          </div>
                        </MaterialToolTip>
                        <Overlay
                          target={msgAction}
                          show={
                            isDemoMode === true && isMsgbuttonClicked === true
                          }
                          placement="top"
                        >
                          {(props) => (
                            <Tooltip
                              id="overlay-edit"
                              className="dln-poppver-tooltip"
                              {...props}
                            >
                              {strings.messageInvestor}
                              <p>{strings.userCanSelectAnyInvestor}</p>
                            </Tooltip>
                          )}
                        </Overlay>
                        {showChatModal && (
                          <SingleChat
                            isAll={false}
                            proposalTitle={state.inputs.proposalName}
                            proposalId={data.id}
                            InviteModalClosed={() => {
                              setChatModal(false);
                            }}
                          />
                        )}
                      </Col>
                    )}
                    {(data.status === 2 || data.status === 3) && (
                      <Col>
                        <MaterialToolTip
                          PopperProps={{ disablePortal: true }}
                          classes={{
                            tooltip: isDemoMode ? "d-none" : "dln-tooltip",
                            arrow: "dln-tooltip-arrow",
                          }}
                          arrow
                          placement="top"
                          title={strings.inviteAnInvestor}
                        >
                          <img
                            className="app-action-icon"
                            src={inviteIcon}
                            alt="icon"
                            onClick={(e) => handleInvite(e)}
                            ref={inviteAction}
                          />
                        </MaterialToolTip>
                        <Overlay
                          target={inviteAction}
                          show={
                            isDemoMode === true && isinvitebuttonClicked === true
                          }
                          placement="top"
                        >
                          {(props) => (
                            <Tooltip
                              id="overlay-edit"
                              className="dln-poppver-tooltip"
                              {...props}
                            >
                              {strings.inviteAnInvestor}
                              <p>{strings.userCanInviteAnInvestorToBack}</p>
                            </Tooltip>
                          )}
                        </Overlay>
                        {showInviteModal && (
                          <InviteUsers
                            data={data}
                            InviteModalClosed={() => {
                              setShowInviteModal(false);
                            }}
                            isBorrow={isBorrow}
                          />
                        )}
                      </Col>
                    )}
                  </Fragment>
                )}
                {(data.status === 1 || data.status === 2) &&
                  !state.isUpdateMode &&
                  isBorrow && (
                    <Col>
                      <MaterialToolTip
                        PopperProps={{ disablePortal: true }}
                        classes={{
                          tooltip: isDemoMode ? "d-none" : "dln-tooltip",
                          arrow: "dln-tooltip-arrow",
                        }}
                        arrow
                        placement="top"
                        title={strings.deleteYourProposal}
                      >
                        <img
                          className="app-action-icon"
                          src={deleteIcon}
                          alt="icon"
                          onClick={(e) => handleOpenModalDelete()}
                          ref={deleteAction}
                        />
                      </MaterialToolTip>
                      <Overlay
                        target={deleteAction}
                        show={
                          isDemoMode === true && isDeletebuttonClicked === true
                        }
                        placement="top"
                      >
                        {(props) => (
                          <Tooltip
                            id="overlay-edit"
                            className="dln-poppver-tooltip"
                            {...props}
                          >
                            {strings.deleteYourProposal}
                            <p>{strings.userCanDelete}</p>
                          </Tooltip>
                        )}
                      </Overlay>
                      {showDeleteModal && (
                        <ConfirmationModal
                          message={strings.confirmationDeleteProposal}
                          ConfirmationModalConfirm={() =>
                            handleDelete(state.inputs.id)
                          }
                          ConfirmationModalCancel={() =>
                            setShowDeleteModal(false)
                          }
                        />
                      )}
                    </Col>
                  )}
                {state.isUpdateMode && (
                  <Fragment>
                    <Col>
                      <img
                        className="app-action-icon"
                        src={saveIcon}
                        alt="icon"
                        onClick={(e) => handleUpdate(e, state.inputs.id)}
                      />
                    </Col>
                    <Col>
                      <img
                        className="app-action-icon"
                        src={cancelIcon}
                        alt="icon"
                        onClick={(e) => handleCancel()}
                      />
                    </Col>
                  </Fragment>
                )}
                {/* {state.isUpdateMode && isAdd && (
        <Fragment>
          <Col>
            <MaterialToolTip
              PopperProps={{ disablePortal: true }}
              classes={{
                tooltip: isDemoMode ? "d-none" : "dln-tooltip",
                arrow: "dln-tooltip-arrow",
              }}
              arrow
              placement="top"
              title={strings.saveProposalAsDraft}
            >
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
                  className="app-action-icon"
                  src={draftIcon}
                  alt="icon"
                  onClick={(e) => handleSave(e, false)}
                  ref={draftAction}
                />
              )}
            </MaterialToolTip>
            <Overlay
              target={draftAction}
              show={
                isDemoMode === true && isdraftbuttonClicked === true
              }
              placement="top"
            >
              {(props) => (
                <Tooltip
                  id="overlay-publish"
                  className="dln-poppver-tooltip"
                  {...props}
                >
                  {strings.saveProposalAsDraft}
                  <p>{strings.saveProposalDesc}</p>
                </Tooltip>
              )}
            </Overlay>
          </Col>
          <Col>
            <MaterialToolTip
              PopperProps={{ disablePortal: true }}
              classes={{
                tooltip: isDemoMode ? "d-none" : "dln-tooltip",
                arrow: "dln-tooltip-arrow",
              }}
              arrow
              placement="top"
              title={strings.publishYourProposal}
            >
              {savePublishClicked ? (
                <Spinner
                  className="mr-1 dln-button-loader"
                  as="span"
                  animation="border"
                  role="status"
                  aria-hidden="true"
                />
              ) : (
                <img
                  className="app-action-icon"
                  src={publishIcon}
                  alt="icon"
                  onClick={(e) => handleSave(e, true)}
                  ref={publishAction}
                />
              )}
            </MaterialToolTip>
            <Overlay
              target={publishAction}
              show={
                isDemoMode === true && ispublishbuttonClicked === true
              }
              placement="top"
            >
              {(props) => (
                <Tooltip
                  id="overlay-publish"
                  className="dln-poppver-tooltip"
                  {...props}
                >
                  {strings.publishYourProposal}
                  <p>{strings.userCanPublishHisDraftProposal}</p>
                </Tooltip>
              )}
            </Overlay>
          </Col>
          <Col>
            <img
              className="app-action-icon"
              src={cancelIcon}
              alt="icon"
              onClick={(e) => handleCancel()}
            />
          </Col>
        </Fragment>
      )} */}
                {!state.isUpdateMode && (data.status === 2 || data.status === 3 || data.status === 6) && (
                  <Col>
                    <MaterialToolTip
                      PopperProps={{ disablePortal: true }}
                      classes={{
                        tooltip: isDemoMode ? "d-none" : "dln-tooltip",
                        arrow: "dln-tooltip-arrow",
                      }}
                      arrow
                      placement="top"
                      title={strings.shareViaTwitter}
                    >
                      <div
                        ref={tweetAction}
                        onClick={() => handleTweetProposal()}
                        className={isShowTweet ? "d-none" : "d-inline"}
                      >
                        {" "}
                        <TwitterIcon size={30} round />
                      </div>
                    </MaterialToolTip>
                    <MaterialToolTip
                      PopperProps={{ disablePortal: true }}
                      classes={{
                        tooltip: isDemoMode ? "d-none" : "dln-tooltip",
                        arrow: "dln-tooltip-arrow",
                      }}
                      arrow
                      placement="top"
                      title={strings.shareViaTwitter}
                    >
                      <div>
                        <TwitterShareButton
                          beforeOnClick={() => {
                            handleTweetProposal();
                          }}
                          url={
                            mfiName
                              ? `https://start.dlndao.org/#/App/proposal?mfi=${mfiName}&id=${state.inputs.id}`
                              : `https://start.dlndao.org/#/App/proposal?mfi=ROI&id=${state.inputs.id}`
                          }
                          title={
                            isBorrow && data.status === 6 ? `I have just fully repaid my ${state.inputs.proposalName} proposal on @dlndao, check it out at `
                              : isBorrow && data.status !== 6
                                ? `Please support my ${state.inputs.proposalName} proposal on @delndao`
                                : data.isBackedByUser
                                  ? `I have just backed ${state.inputs.userName}’s ${state.inputs.proposalName} proposal on @delndao, please join me.`
                                  : `Please support ${state.inputs.userName}’s ${state.inputs.proposalName} proposal on @delndao`
                          }
                          openShareDialogOnClick={isShowTweet}
                          className={isShowTweet ? "d-inline" : "d-none"}
                        >
                          <TwitterIcon size={32} round />
                        </TwitterShareButton>
                      </div>
                    </MaterialToolTip>
                    <Overlay
                      target={tweetAction}
                      show={isDemoMode === true && isTweetbuttonClicked === true}
                      placement="top"
                    >
                      {(props) => (
                        <Tooltip
                          id="overlay-tweet"
                          className="dln-poppver-tooltip"
                          {...props}
                        >
                          {strings.shareViaTwitter}
                          <p>{strings.usersCansShareViaTwitter}</p>
                        </Tooltip>
                      )}
                    </Overlay>
                  </Col>
                )}
              </Row> :
              <div className="my-4">
                <Link to="/App/start" className="app-primary-btn">
                  {strings.getStart}
                </Link>
              </div>

            }
          </Row>
          <Row className='justify-content-center'>
            <Col xl={7} lg={7} md={7} sm={12}><Footer /></Col></Row>
        </div>)}

    </Fragment>
  )
}
export default SingleProposalPage;
