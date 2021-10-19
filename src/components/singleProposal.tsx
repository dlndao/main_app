import React, { Fragment, useState, useEffect, useRef } from "react";
import { Storage, API } from "aws-amplify";
import { Row, Col, Form, Overlay, Tooltip, Spinner } from "react-bootstrap";
import { TwitterIcon, TwitterShareButton } from "react-share";
import { Tooltip as MaterialToolTip } from "@material-ui/core";
import { v4 as uuid } from "uuid";
import { Avatar } from "@material-ui/core";
import { toast } from "react-toastify";
import validator from "validator";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import InviteUsers from "./inviteUsers";
import InvestModal from "./investModal";
import classNames from "classnames";
import SingleChat from "./singleChat";
import PhotoAlbum from "./imagesAlbum";
import ProposalImagesLog from "./proposalImagesLog";
import BakersList from "./bakersList";
import ConfirmationModal from "./confirmationModal";
import strings from "../localization/localization";
import RepayModal from "./repayModal";
import { ERC20Client } from "../services/erc20-client";
import { Link } from "react-router-dom";
import AssignProposalToCampaign from './assignProposalToCampaign'


import {
  viewBlue,
  editIcon,
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
  repaidBlueCircle,
  publishCSIcon,
  publishIcon,
  deleteIcon,
  draftCSIcon,
  draftIcon,
  lockCSIcon,
  approveIcon,
  ignoreIcon,
  investIcon,
  unignoreIcon,
  plusLight,
  assign,
  assigned
} from "../Assets/Images";

Storage.configure({
  bucket: "dlnresources182402-dev",
  level: "public",
});

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
    proposalCampaigns: []
  },
  isUpdateMode: false,
});

function SingleProposal({
  data,
  isAdd = false,
  callSpinner,
  CallAddProposalCanceled,
  isShowOnly = false, //true if user will show proposal only link invist or mfi proposals
  isApprove = false,
  isBorrow = false,
  isMfi = false,
  isIgnored = false,
  isShowAction=true,
  isCampaign=false,
  campaignName="",
  campaignId= null,
}) {
  const eRC20Client = new ERC20Client();
  const fileInput: any = React.useRef<HTMLInputElement>();
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
  const unignoreAction = useRef(null);
  const investAction = useRef(null);
  const titleInputRef = useRef(null);
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

  const [state, setState] = useState(IntialInputs());
  const [passCampaignId , setPassCampaignId]:any = useState()
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
  const [showUnIgnoreModal, setShowUnIgnoreModal] = useState(false);

  const [isDemoMode, setIsDemoMode] = useState(false);
  const [showBakersModal, setShowBakersModal] = useState(false);
  const [isMsgbuttonClicked, setIsMsgbuttonClicked] = useState(false);
  const [isbakedbuttonClicked, setIsbakedbuttonClicked] = useState(false);
  const [isinvitebuttonClicked, setIsinivtebuttonClicked] = useState(false);
  const [isEditbuttonClicked, setIsEditbuttonClicked] = useState(false);
  const [isdraftbuttonClicked, setIsdraftbuttonClicked] = useState(false);
  const [isrepaybuttonClicked, setIsrepaybuttonClicked] = useState(false);
  const [ispublishbuttonClicked, setIspublishbuttonClicked] = useState(false);
  const [isunpublishbuttonClicked, setIsunpublishbuttonClicked] = useState(
    false
  );

  const [isBakersListbuttonClicked, setIsBakersLisbuttonClicked] = useState(
    false
  );
  const [isWithdrawbuttonClicked, setIsWithdrawbuttonClicked] = useState(false);
  const [isDeletebuttonClicked, setIsDeletebuttonClicked] = useState(false);
  const [isApprovebuttonClicked, setIsApprovebuttonClicked] = useState(false);
  const [isIgnorebuttonClicked, setIsIgnorebuttonClicked] = useState(false);
  const [isUnIgnorebuttonClicked, setIsUnIgnorebuttonClicked] = useState(false);
  const [isInvestbuttonClicked, setIsInvestbuttonClicked] = useState(false);
  const [unReadMessage, setUnreadMessage] = useState(0);
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
  const [showRepayModal, setShowRepayModal] = useState(false);
  const [userIsSelectedImage, setUserIsSelectedImage] = useState(false);
  const [showAssignProposalToCampaignModal , setShowAssignProposalToCampaign] = useState(false)
  const [approveRemoveProposalFromCampaign , setApproveRemoveProposalFromCampaign ] = useState(false)

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
    setIsdraftbuttonClicked(false);
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
    setIsUnIgnorebuttonClicked(false);
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

  useEffect(() => {
    // getProposal();
    const language: any = localStorage.getItem("language");
    if (language) {
      strings.setLanguage(language);
    }
    let currentdata = localStorage.getItem("userData");
    if (currentdata) {
      setUserData(JSON.parse(currentdata));
    }
    if (mfiData) {
      setMFIID(mfiData.id);
      setMFIName(mfiData.name);
    }
    const DemoMode: any = localStorage.getItem("IsDemoMode");
    if (DemoMode === "true") {
      setIsDemoMode(DemoMode === "true" ? true : false);
      setIsShowTweet(false);
    } else {
      setIsShowTweet(true);
    }

    if (!isAdd && data && data !== "") {
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
          userName: !isBorrow && data.user
            ? data.user.firstName + " " + data.user.lastName
            : "",
          proposalCampaigns : data.proposalCampaigns ?  data.proposalCampaigns: []
        },
      });
      setUnreadMessage(data.unreadMessagesCount);
      setProfileImg(isCampaign?data.imageUrl:data.image);
      setProfileOldImg(isCampaign?data.imageUrl:data.image);
    } else {
      setState({ ...state, isUpdateMode: true });
    }
   // console.log(console.log(data))
    if(isCampaign){
      setPassCampaignId(campaignId)
    }else if (data.proposalCampaigns){
      if (data.proposalCampaigns.length > 0){
        setPassCampaignId(data.proposalCampaigns[0].id)
      }
    }
  }, []);

  const getProposal = async () =>
    await eRC20Client.getProposal(
      "erc20_social_staking_contract_contract_hash",
      "229"
    );

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
      } else {
        key = data.image;
      }
      const {
        loanValue,
        desc,
        proposalDate,
        proposalName,
        monthsToRepay,
      } = state.inputs;

      const toBeSavedProposal = {
        currentBalance: "0",
        address: "",
        amount: loanValue.toString(),
        status: isPublish ? "2" : "1",
        startDate: proposalDate?.toString(),
        description: desc?.toString(),
        title: proposalName?.toString(),
        monthsToRepay: monthsToRepay?.toString(),
        image: key?.toString(),
        mfiId: mfiId ? mfiId?.toString() : "3",
        userId: userData.id.toString(),
      };

      await API.post("auth", "/api/borrow", {
        headers: { "Content-Type": "application/json" },
        body: toBeSavedProposal,
      }).then(async (response) => {
        await saveProposalToCasper(response.data.id, toBeSavedProposal);
        setState({
          ...state,
          isUpdateMode: false,
        });
        toast.success(strings.proposalSavedSucc);
        if (isAdd) {
          CallAddProposalCanceled();
        }
        callSpinner();
        setUploadImage(false);
        setSaveClicked(false);
        setSavePublishClicked(false);
      });
    }
  };

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
        toast.success(strings.proposalUpdatedSucc);
        if (isAdd) {
          CallAddProposalCanceled();
        }
        callSpinner();
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
    CallAddProposalCanceled();
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
      }).then(async (response) => {
        if (isPublish) {
          const {
            loanValue,
            desc,
            proposalDate,
            proposalName,
            monthsToRepay,
          } = state.inputs;

          const toBeSavedProposal = {
            currentBalance: "0",
            address: "",
            amount: loanValue.toString(),
            status: "2",
            startDate: proposalDate?.toString(),
            description: desc.toString(),
            title: proposalName.toString(),
            monthsToRepay: monthsToRepay.toString(),
            image: data.image ? data.image?.toString() : "",
            mfiId: mfiId ? mfiId?.toString() : "3",
            userId: userData.id.toString(),
          };
          await saveProposalToCasper(id, toBeSavedProposal);
          toast.success(strings.proposalPublishedSucc);
        } else {
          toast.success(strings.proposalUnPublishedSucc);
        }
        callSpinner();
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
      setShowRepayModal(true);
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
      toast.success(strings.proposalDeletedSucc);
      callSpinner();
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
        toast.warning(strings.proposalAlreadyApproved);
        setShowApproveModal(false);
      } else {
        toast.success(strings.proposalApprovedSucc);
        callSpinner();
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

  const handleOpenModalUnIgnore = async () => {
    const DemoMode: any = localStorage.getItem("IsDemoMode");
    if (DemoMode === "true") {
      setIsDemoMode(DemoMode === "true" ? true : false);

      setIsUnIgnorebuttonClicked(!isUnIgnorebuttonClicked);
    } else {
      removeClass("dln-poppver-tooltip");
      removeClickIcons();
      setShowUnIgnoreModal(true);
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
      toast.success(strings.proposalIgnoredSucc);

      callSpinner();
    });
  };

  const handleUnIgnore = async (e, id) => {
    await API.post("auth", `/api/borrow/unignoreProposal`, {
      headers: { "Content-Type": "application/json" },
      queryStringParameters: {
        proposalId: id,
        userId: userData.id,
      },
    }).then((response) => {
      toast.success(strings.proposalUnIgnoredSucc);

      callSpinner();
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
        if (profileImg != "" && !userIsSelectedImage) {
          setShowPhotoAlbum(true);
        }
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

  const saveProposalToCasper = async (proposalId, proposal) => {
    const addProposal = await eRC20Client.addProposal(
      "erc20_social_staking_farm_contract_contract_hash",
      proposal,
      proposalId.toString()
    );
    return addProposal;
  };
  const removeProposalFromCacpaigns = async (proposalID)=>{
      await API.del("auth", `/api/campaign/`, {
        headers: { "Content-Type": "application/json" },
        body: { id: passCampaignId , proposalIds: [proposalID.id] }
      }).then(async (response) => {
        if (response.success == true) {
          setApproveRemoveProposalFromCampaign(false)
          toast.success("proposal removed from campaigns Successfully..");
          
          callSpinner()
        } else {
          toast.error("error..");
        }            
      });
  }

  return (
    <Fragment>
      <Row className='justify-content-center app-inner-page app-inner-page-tab mt-3'>
        <Col
          xl={12}
          lg={12}
          md={12}
          sm={12}
          className={classNames(
            "card app-card app-single-prop",
            data.isBackedByUser ? "app-bg-success" : ""
          )}
        >
          {isApprove && data.isMFIApproved && (
            <div className='app-approved-label'>
              <span>{strings.approved}</span>
            </div>
          )}

          <Form className='app-form py-4'>
            <Row>
              <Col className='col-auto app-user-profile-img-main text-left'>
                <div className=' position-relative'>
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
                      placement='top'
                      title={strings.proposalPic}
                    >
                      <Avatar
                        alt=''
                        src={profileImg}
                        className='app-user-profile-img app-proposal-img'
                        ref={picinputref}
                        onClick={() => handleInputClick("profileImg")}
                      />
                    </MaterialToolTip>

                    <Overlay
                      target={picinputref}
                      show={isDemoMode === true && isPicInputClicked === true}
                      placement='top'
                    >
                      {(props) => (
                        <Tooltip
                          id='overlay-pic'
                          className='dln-poppver-tooltip'
                          {...props}
                        >
                          {strings.proposalPic}
                        </Tooltip>
                      )}
                    </Overlay>
                    <Overlay
                      target={uploadImagesref}
                      show={
                        isDemoMode === true && isUploadImagesClicked === true
                      }
                      placement='top'
                    >
                      {(props) => (
                        <Tooltip
                          id='overlay-pic'
                          className='dln-poppver-tooltip'
                          {...props}
                        >
                          {strings.uploadImage}
                          <p>{strings.UserCanUploadImages}</p>
                        </Tooltip>
                      )}
                    </Overlay>
                    {data.status === 4 && (
                      <div className='app-badge-container'>
                        <img
                          src={bakedCSIcon}
                          alt='icon'
                          className='app-proposal-badge'
                          ref={backedIconRef}
                          onClick={() =>
                            setStatusIconClicked(!isStatusIconClick)
                          }
                        />
                        <Overlay
                          target={backedIconRef}
                          show={
                            isDemoMode === true && isStatusIconClick === true
                          }
                          placement='top'
                        >
                          {(props) => (
                            <Tooltip
                              id='status-icon'
                              className='dln-poppver-tooltip'
                              {...props}
                            >
                              {strings.backedProposal}
                            </Tooltip>
                          )}
                        </Overlay>
                      </div>
                    )}
                    {data.status === 5 && (
                      <div className='app-badge-container'>
                        <img
                          src={fundedCSIcon}
                          alt='icon'
                          className='app-proposal-badge'
                          ref={fundedIconRef}
                          onClick={() => handleStatusIconClick()}
                        />
                        <Overlay
                          target={publishedIconRef}
                          show={
                            isDemoMode === true && isStatusIconClick === true
                          }
                          placement='top'
                        >
                          {(props) => (
                            <Tooltip
                              id='status-icon'
                              className='dln-poppver-tooltip'
                              {...props}
                            >
                              {strings.fundedProposal}
                            </Tooltip>
                          )}
                        </Overlay>
                      </div>
                    )}
                    {data.status === 3 && (
                      <div className='app-badge-container'>
                        <img
                          src={lockCSIcon}
                          alt='icon'
                          className='app-proposal-badge'
                          ref={lockedIconRef}
                          onClick={() =>
                            setStatusIconClicked(!isStatusIconClick)
                          }
                        />
                        <Overlay
                          target={lockedIconRef}
                          show={
                            isDemoMode === true && isStatusIconClick === true
                          }
                          placement='top'
                        >
                          {(props) => (
                            <Tooltip
                              id='status-icon'
                              className='dln-poppver-tooltip'
                              {...props}
                            >
                              {strings.lockedProposal}
                            </Tooltip>
                          )}
                        </Overlay>
                      </div>
                    )}
                    {data.status === 1 && (
                      <div className='app-badge-container'>
                        <img
                          src={draftCSIcon}
                          alt='icon'
                          className='app-proposal-badge'
                          ref={draftIconRef}
                          onClick={() => handleStatusIconClick()}
                        />
                        <Overlay
                          target={draftIconRef}
                          show={
                            isDemoMode === true && isStatusIconClick === true
                          }
                          placement='top'
                        >
                          {(props) => (
                            <Tooltip
                              id='status-icon'
                              className='dln-poppver-tooltip'
                              {...props}
                            >
                              {strings.draftedProposal}
                            </Tooltip>
                          )}
                        </Overlay>
                      </div>
                    )}
                    {data.status === 2 && (
                      <div className='app-badge-container'>
                        <img
                          src={publishCSIcon}
                          alt='icon'
                          className='app-proposal-badge'
                          ref={publishedIconRef}
                          onClick={() => handleStatusIconClick()}
                        />
                        <Overlay
                          target={publishedIconRef}
                          show={
                            isDemoMode === true && isStatusIconClick === true
                          }
                          placement='top'
                        >
                          {(props) => (
                            <Tooltip
                              id='status-icon'
                              className='dln-poppver-tooltip'
                              {...props}
                            >
                              {strings.puplishedProposal}
                            </Tooltip>
                          )}
                        </Overlay>
                      </div>
                    )}
                    {data.status === 6 && (
                      <div className='app-badge-container'>
                        <img
                          src={repaidBlueCircle}
                          alt='icon'
                          className='app-proposal-badge'
                          ref={repaidIconRef}
                          onClick={() => handleStatusIconClick()}
                        />
                        <Overlay
                          target={repaidIconRef}
                          show={
                            isDemoMode === true && isStatusIconClick === true
                          }
                          placement='top'
                        >
                          {(props) => (
                            <Tooltip
                              id='status-icon'
                              className='dln-poppver-tooltip'
                              {...props}
                            >
                              {strings.repaidProposal}
                            </Tooltip>
                          )}
                        </Overlay>
                      </div>
                    )}
                    <input
                      accept='*/*'
                      className='d-none'
                      type='file'
                      ref={fileInput}
                      onChange={(e) => {
                        upload(e);
                        setUserIsSelectedImage(true);
                      }}
                      disabled={!state.isUpdateMode}
                    />
                  </label>

                  {!isAdd && (
                    <MaterialToolTip
                      PopperProps={{ disablePortal: true }}
                      classes={{
                        tooltip: isDemoMode ? "d-none" : "dln-tooltip",
                        arrow: "dln-tooltip-arrow",
                      }}
                      arrow
                      placement='top'
                      title={strings.postUpdate}
                    >
                      <div className='app-image-album-container'>
                        <img
                          src={isBorrow ? plusLight : viewBlue}
                          alt='icon'
                          className='app-proposal-badge'
                          onClick={(e) => handleUploadImagesClick(e)}
                          ref={uploadImagesref}
                        />
                      </div>
                    </MaterialToolTip>
                  )}
                  {isImagesLogShow && (
                    <ProposalImagesLog
                      photoLogClosed={() => {
                        setImagesLogShow(false);
                      }}
                      proposalTitle={state.inputs.proposalName}
                      proposalId={state.inputs.id}
                      isBorrow={isBorrow}
                    />
                  )}
                </div>
                {isMfi && data.status !== 6 &&(
                  <div>
                  <MaterialToolTip
                  PopperProps={{ disablePortal: true }}
                  classes={{
                    tooltip: isDemoMode ? "d-none" : "dln-tooltip",
                    arrow: "dln-tooltip-arrow",
                  }}
                  arrow
                  placement='top'
                  title={strings.assignProposalToCampaign}
                >
                  <div className='app-action-icon'>
                  <img
                    src={data.proposalCampaigns?.length != 0 || isCampaign?  assigned : assign}
                    alt='icon'
                    className='app-campaign-actions'
                    ref={repaidIconRef}
                    onClick={() => data.proposalCampaigns && data.proposalCampaigns.length != 0 || isCampaign?  setApproveRemoveProposalFromCampaign(true) : setShowAssignProposalToCampaign(true)}
                  />
                    </div>
                    </MaterialToolTip>
                    {showAssignProposalToCampaignModal && (
                      <AssignProposalToCampaign
                        userId = {userData.id}
                        data={data}
                        mfiId={mfiId}
                        assignModalClosed={() => {
                          setShowAssignProposalToCampaign(false);
                        }}
                        //isBorrow={isBorrow}
                        callSpinner = {()=>callSpinner()}
                      />
                    )}
                   </div>
                )}
                {approveRemoveProposalFromCampaign && (
                    <ConfirmationModal
                    message= {`${strings.confirmDeleteProposal} ${campaignName}?`}
                    ConfirmationModalConfirm={(e) =>
                      removeProposalFromCacpaigns(data)
                    }
                    ConfirmationModalCancel={() =>
                      setApproveRemoveProposalFromCampaign(false)
                    }
                />
                )}
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
              <Col className='app-proposal-right-side'>
                <Row>
                  <MaterialToolTip
                    PopperProps={{ disablePortal: true }}
                    classes={{
                      tooltip: isDemoMode ? "d-none" : "dln-tooltip",
                      arrow: "dln-tooltip-arrow",
                    }}
                    arrow
                    placement='top'
                    title={strings.proposalName}
                  >
                    <Col className='text-left'>
                      <Form.Group>
                        <label
                          ref={titleInputRef}
                          className='w-100'
                          onClick={() => handleInputClick("proposalName")}
                        >
                          <Form.Control
                            type='text'
                            placeholder={strings.proposalName}
                            name='proposalName'
                            onChange={(e) => {
                              handleChange(e);
                            }}
                            value={state.inputs.proposalName}
                            disabled={!state.isUpdateMode}
                          />
                        </label>
                        {showErrors === true &&
                          validator.isEmpty(state.inputs.proposalName) && (
                            <div className='app-error-msg'>
                              {strings.required}
                            </div>
                          )}
                        <Overlay
                          target={titleInputRef}
                          show={
                            isDemoMode === true && istitleInputClicked === true
                          }
                          placement='top'
                        >
                          {(props) => (
                            <Tooltip
                              id='overlay-edit'
                              className='dln-poppver-tooltip'
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
                    placement='top'
                    title={strings.proposalAmount}
                  >
                    <Col className='text-left pr-0'>
                      <Form.Group>
                        <label
                          className='w-100'
                          ref={amountInputRef}
                          onClick={() => handleInputClick("loanValue")}
                        >
                          <Form.Control
                            type='number'
                            placeholder={strings.loanValue}
                            name='loanValue'
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
                            <div className='app-error-msg'>
                              {strings.required}
                            </div>
                          )}
                        {showErrors === true &&
                          !validator.isEmpty(
                            state.inputs.loanValue.toString()
                          ) &&
                          parseFloat(state.inputs.loanValue.toString()) <=
                            0 && (
                            <div className='app-error-msg'>
                              {strings.valueMustBeGreeterThan1}
                            </div>
                          )}
                      </Form.Group>
                    </Col>
                  </MaterialToolTip>
                  <Overlay
                    target={amountInputRef}
                    show={isDemoMode === true && isamountinputClicked === true}
                    placement='top'
                  >
                    {(props) => (
                      <Tooltip
                        id='overlay-edit'
                        className='dln-poppver-tooltip'
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
                    placement='top'
                    title={strings.monthsToPayment}
                  >
                    <Col className='text-left'>
                      <Form.Group>
                        <label
                          className='w-100'
                          ref={monthsInputRef}
                          onClick={() => handleInputClick("monthsToRepay")}
                        >
                          <Form.Control
                            type='number'
                            placeholder={strings.monthsToPayment}
                            name='monthsToRepay'
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
                            <div className='app-error-msg'>
                              {strings.required}
                            </div>
                          )}
                      </Form.Group>
                    </Col>
                  </MaterialToolTip>
                  <Overlay
                    target={monthsInputRef}
                    show={isDemoMode === true && ismonthInputClicked === true}
                    placement='top'
                  >
                    {(props) => (
                      <Tooltip
                        id='overlay-edit'
                        className='dln-poppver-tooltip'
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
                    placement='top'
                    title={strings.proposalsDate}
                  >
                    <Col className='text-left'>
                      <Form.Group>
                        <label
                          className='dln-datepicker'
                          ref={dateinputref}
                          onClick={() => handleInputClick("proposalDate")}
                        >
                          <DatePicker
                            name='proposalDate'
                            className='form-control'
                            selected={state.inputs.proposalDate}
                            onChange={(date, name) =>
                              handleDateChange(date, "proposalDate")
                            }
                            popperPlacement='top'
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
                          <div className='app-error-msg'>
                            {strings.required}
                          </div>
                        )}
                    </Col>
                  </MaterialToolTip>
                  <Overlay
                    target={dateinputref}
                    show={isDemoMode === true && isdateInputClicked === true}
                    placement='top'
                  >
                    {(props) => (
                      <Tooltip
                        id='overlay-edit'
                        className='dln-poppver-tooltip'
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
                placement='top'
                title={strings.proposalDesc}
              >
                <Col className='text-left'>
                  <Form.Group>
                    <label
                      className='w-100'
                      ref={descinputref}
                      onClick={() => handleInputClick("desc")}
                    >
                      <Form.Control
                        type='text'
                        as='textarea'
                        placeholder={strings.proposalDesc}
                        name='desc'
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
                      <div className='app-error-msg'>{strings.required}</div>
                    )}
                </Col>
              </MaterialToolTip>
              <Overlay
                target={descinputref}
                show={isDemoMode === true && isdescInputClicked === true}
                placement='top'
              >
                {(props) => (
                  <Tooltip
                    id='overlay-edit'
                    className='dln-poppver-tooltip'
                    {...props}
                  >
                    {strings.describeYourProposalAndYourNeeds}
                  </Tooltip>
                )}
              </Overlay>
            </Row>
            <Row></Row>
          {isShowAction?  (
           <Row className='justify-content-around app-action-bar'>
           
              {!state.isUpdateMode && !isIgnored && (
                <Fragment>
                  {isShowOnly && (
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
                            placement='top'
                            title={strings.investProposal}
                          >
                            <img
                              className='app-action-icon'
                              src={investIcon}
                              alt='icon'
                              onClick={(e) => handleInvest(e)}
                              ref={investAction}
                            />
                          </MaterialToolTip>
                          {showInvestModal && (
                            <InvestModal
                              data={data}
                              InvestModalClosed={() => {
                                setShowInvestModal(false);
                                callSpinner();
                              }}
                            />
                          )}
                          <Overlay
                            target={investAction}
                            show={
                              isDemoMode === true &&
                              isInvestbuttonClicked === true
                            }
                            placement='top'
                          >
                            {(props) => (
                              <Tooltip
                                id='overlay-invest'
                                className='dln-poppver-tooltip'
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
                      {data.status != 6 && isApprove && (
                        <Col>
                          <MaterialToolTip
                            PopperProps={{ disablePortal: true }}
                            classes={{
                              tooltip: isDemoMode ? "d-none" : "dln-tooltip",
                              arrow: "dln-tooltip-arrow",
                            }}
                            arrow
                            placement='top'
                            title={strings.approveProposal}
                          >
                            <img
                              className='app-action-icon'
                              src={approveIcon}
                              alt='icon'
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
                            placement='top'
                          >
                            {(props) => (
                              <Tooltip
                                id='overlay-edit'
                                className='dln-poppver-tooltip'
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
                          <Col>
                            <MaterialToolTip
                              PopperProps={{ disablePortal: true }}
                              classes={{
                                tooltip: isDemoMode ? "d-none" : "dln-tooltip",
                                arrow: "dln-tooltip-arrow",
                              }}
                              arrow
                              placement='top'
                              title={strings.ignoreProposal}
                            >
                              <img
                                className='app-action-icon'
                                src={ignoreIcon}
                                alt='icon'
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
                              placement='top'
                            >
                              {(props) => (
                                <Tooltip
                                  id='overlay-edit'
                                  className='dln-poppver-tooltip'
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
                    (data.status === 2 && !isShowOnly)) && (
                    <Col>
                      <MaterialToolTip
                        PopperProps={{ disablePortal: true }}
                        classes={{
                          tooltip: isDemoMode ? "d-none" : "dln-tooltip",
                          arrow: "dln-tooltip-arrow",
                        }}
                        arrow
                        placement='top'
                        title={strings.editYourProposal}
                      >
                        <img
                          className='app-action-icon'
                          src={editIcon}
                          alt='icon'
                          onClick={(e) => handleEdit(state.inputs.id)}
                          ref={editAction}
                        />
                      </MaterialToolTip>
                      <Overlay
                        target={editAction}
                        show={
                          isDemoMode === true && isEditbuttonClicked === true
                        }
                        placement='top'
                      >
                        {(props) => (
                          <Tooltip
                            id='overlay-edit'
                            className='dln-poppver-tooltip'
                            {...props}
                          >
                            {strings.editYourProposal}
                            <p>{strings.userCanEditHis}</p>
                          </Tooltip>
                        )}
                      </Overlay>
                    </Col>
                  )}
                  {!isAdd && data.status === 1 && !isShowOnly && (
                    <Col>
                      <MaterialToolTip
                        PopperProps={{ disablePortal: true }}
                        classes={{
                          tooltip: isDemoMode ? "d-none" : "dln-tooltip",
                          arrow: "dln-tooltip-arrow",
                        }}
                        arrow
                        placement='top'
                        title={strings.publishYourProposal}
                      >
                        <img
                          className='app-action-icon'
                          src={publishIcon}
                          alt='icon'
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
                        placement='top'
                      >
                        {(props) => (
                          <Tooltip
                            id='overlay-publish'
                            className='dln-poppver-tooltip'
                            {...props}
                          >
                            {strings.publishYourProposal}
                            <p>{strings.userCanPublishHisDraftProposal}</p>
                          </Tooltip>
                        )}
                      </Overlay>
                    </Col>
                  )}

                  {data.status === 2 && !isShowOnly && (
                    <Col>
                      <MaterialToolTip
                        PopperProps={{ disablePortal: true }}
                        classes={{
                          tooltip: isDemoMode ? "d-none" : "dln-tooltip",
                          arrow: "dln-tooltip-arrow",
                        }}
                        arrow
                        placement='top'
                        title={strings.unpublishProposal}
                      >
                        <img
                          className='app-action-icon'
                          src={unpublishIcon}
                          alt='icon'
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
                        placement='top'
                      >
                        {(props) => (
                          <Tooltip
                            id='overlay-unpublish'
                            className='dln-poppver-tooltip'
                            {...props}
                          >
                            {strings.UnpublishYourPublishedProposal}
                            <p>{strings.unPublishYourProposalsDesc}</p>
                          </Tooltip>
                        )}
                      </Overlay>
                    </Col>
                  )}
                  {data.status !== 1 && (
                    <Col>
                      <MaterialToolTip
                        PopperProps={{ disablePortal: true }}
                        classes={{
                          tooltip: isDemoMode ? "d-none" : "dln-tooltip",
                          arrow: "dln-tooltip-arrow",
                        }}
                        arrow
                        placement='top'
                        title={strings.seeBackers}
                      >
                        <img
                          className='app-action-icon'
                          src={bakersIcon}
                          alt='icon'
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
                          isBorrow={isBorrow}
                        />
                      )}
                      <Overlay
                        target={bakersListAction}
                        show={
                          isDemoMode === true &&
                          isBakersListbuttonClicked === true
                        }
                        placement='top'
                      >
                        {(props) => (
                          <Tooltip
                            id='overlay-edit'
                            className='dln-poppver-tooltip'
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
                        placement='top'
                        title={strings.collectedAmount}
                      >
                        <div>
                          <img
                            className='app-action-icon app-action__money'
                            src={bakedAmountIcon}
                            alt='icon'
                            ref={bakedAction}
                            onClick={(e) => {
                              handlebaked(e);
                            }}
                          />
                          <span className='ml-1 app-text-blue app-action-icon'>
                            {data.currentBalance}
                          </span>
                        </div>
                      </MaterialToolTip>
                      <Overlay
                        target={bakedAction}
                        show={
                          isDemoMode === true && isbakedbuttonClicked === true
                        }
                        placement='top'
                      >
                        {(props) => (
                          <Tooltip
                            id='overlay-edit'
                            className='dln-poppver-tooltip'
                            {...props}
                          >
                            {strings.checkYourBackedAmount}
                            <p>{strings.checkYourBackedAmountDesc}</p>
                          </Tooltip>
                        )}
                      </Overlay>
                    </Col>
                  )}
                  {data.status === 5 && !isShowOnly && (
                    <Fragment>
                      <Col>
                        <MaterialToolTip
                          PopperProps={{ disablePortal: true }}
                          classes={{
                            tooltip: isDemoMode ? "d-none" : "dln-tooltip",
                            arrow: "dln-tooltip-arrow",
                          }}
                          arrow
                          placement='top'
                          title={strings.withDrawYourMoney}
                        >
                          <img
                            className='app-action-icon'
                            src={cashIcon}
                            alt='icon'
                            ref={withdrawAction}
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
                          placement='top'
                        >
                          {(props) => (
                            <Tooltip
                              id='overlay-edit'
                              className='dln-poppver-tooltip'
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
                  {(data.status === 5 && !isShowOnly) ||
                  (isMfi && data.status === 5 && !isIgnored) ? (
                    <Col>
                      <MaterialToolTip
                        PopperProps={{ disablePortal: true }}
                        classes={{
                          tooltip: isDemoMode ? "d-none" : "dln-tooltip",
                          arrow: "dln-tooltip-arrow",
                        }}
                        arrow
                        placement='top'
                        title={strings.repayYourLoan}
                      >
                        <img
                          className='app-action-icon'
                          src={repayIcon}
                          alt='icon'
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
                        placement='top'
                      >
                        {(props) => (
                          <Tooltip
                            id='overlay-edit'
                            className='dln-poppver-tooltip'
                            {...props}
                          >
                            {strings.repayYourLoan}
                            <p>{strings.userCanRepayDesc}</p>
                          </Tooltip>
                        )}
                      </Overlay>
                    </Col>
                  ) : null}

                  {data.status !== 1 && data.status !== 6 && (
                    <Col className='justify-content-center d-flex'>
                      <MaterialToolTip
                        PopperProps={{ disablePortal: true }}
                        classes={{
                          tooltip: isDemoMode ? "d-none" : "dln-tooltip",
                          arrow: "dln-tooltip-arrow",
                        }}
                        arrow
                        placement='top'
                        title={strings.messageTheInvestors}
                      >
                        <div
                          style={{ backgroundImage: `url(${chatIcon})` }}
                          ref={msgAction}
                          onClick={(e) => {
                            handleChat(e);
                          }}
                          className='app-action-icon app-action-chat-icon'
                        >
                          {unReadMessage && unReadMessage != 0 ? (
                            <div className='app-msg-popup-proposal-card'>
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
                        placement='top'
                      >
                        {(props) => (
                          <Tooltip
                            id='overlay-edit'
                            className='dln-poppver-tooltip'
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
                        placement='top'
                        title={strings.inviteAnInvestor}
                      >
                        <img
                          className='app-action-icon'
                          src={inviteIcon}
                          alt='icon'
                          onClick={(e) => handleInvite(e)}
                          ref={inviteAction}
                        />
                      </MaterialToolTip>
                      <Overlay
                        target={inviteAction}
                        show={
                          isDemoMode === true && isinvitebuttonClicked === true
                        }
                        placement='top'
                      >
                        {(props) => (
                          <Tooltip
                            id='overlay-edit'
                            className='dln-poppver-tooltip'
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
                !isShowOnly &&
                !isIgnored && (
                  <Col>
                    <MaterialToolTip
                      PopperProps={{ disablePortal: true }}
                      classes={{
                        tooltip: isDemoMode ? "d-none" : "dln-tooltip",
                        arrow: "dln-tooltip-arrow",
                      }}
                      arrow
                      placement='top'
                      title={strings.deleteYourProposal}
                    >
                      <img
                        className='app-action-icon'
                        src={deleteIcon}
                        alt='icon'
                        onClick={(e) => handleOpenModalDelete()}
                        ref={deleteAction}
                      />
                    </MaterialToolTip>
                    <Overlay
                      target={deleteAction}
                      show={
                        isDemoMode === true && isDeletebuttonClicked === true
                      }
                      placement='top'
                    >
                      {(props) => (
                        <Tooltip
                          id='overlay-edit'
                          className='dln-poppver-tooltip'
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
              {state.isUpdateMode && !isIgnored && !isAdd && (
                <Fragment>
                  <Col>
                    <img
                      className='app-action-icon'
                      src={saveIcon}
                      alt='icon'
                      onClick={(e) => handleUpdate(e, state.inputs.id)}
                    />
                  </Col>
                  <Col>
                    <img
                      className='app-action-icon'
                      src={cancelIcon}
                      alt='icon'
                      onClick={(e) => handleCancel()}
                    />
                  </Col>
                </Fragment>
              )}
              {state.isUpdateMode && !isIgnored && isAdd && (
                <Fragment>
                  <Col>
                    <MaterialToolTip
                      PopperProps={{ disablePortal: true }}
                      classes={{
                        tooltip: isDemoMode ? "d-none" : "dln-tooltip",
                        arrow: "dln-tooltip-arrow",
                      }}
                      arrow
                      placement='top'
                      title={strings.saveProposalAsDraft}
                    >
                      {saveClicked ? (
                        <Spinner
                          className='mr-1 dln-button-loader'
                          as='span'
                          animation='border'
                          role='status'
                          aria-hidden='true'
                        />
                      ) : (
                        <img
                          className='app-action-icon'
                          src={draftIcon}
                          alt='icon'
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
                      placement='top'
                    >
                      {(props) => (
                        <Tooltip
                          id='overlay-publish'
                          className='dln-poppver-tooltip'
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
                      placement='top'
                      title={strings.publishYourProposal}
                    >
                      {savePublishClicked ? (
                        <Spinner
                          className='mr-1 dln-button-loader'
                          as='span'
                          animation='border'
                          role='status'
                          aria-hidden='true'
                        />
                      ) : (
                        <img
                          className='app-action-icon'
                          src={publishIcon}
                          alt='icon'
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
                      placement='top'
                    >
                      {(props) => (
                        <Tooltip
                          id='overlay-publish'
                          className='dln-poppver-tooltip'
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
                      className='app-action-icon'
                      src={cancelIcon}
                      alt='icon'
                      onClick={(e) => handleCancel()}
                    />
                  </Col>
                </Fragment>
              )}
              {!state.isUpdateMode &&
                !isIgnored &&
                (data.status === 2 ||
                  data.status === 3 ||
                  data.status === 6) && (
                  <Col>
                    <MaterialToolTip
                      PopperProps={{ disablePortal: true }}
                      classes={{
                        tooltip: isDemoMode ? "d-none" : "dln-tooltip",
                        arrow: "dln-tooltip-arrow",
                      }}
                      arrow
                      placement='top'
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
                      placement='top'
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
                            isBorrow && data.status === 6
                              ? `I have just fully repaid my ${state.inputs.proposalName} proposal on @dlndao, check it out at `
                              : isBorrow && data.status !== 6
                              ? `Please support my ${state.inputs.proposalName} proposal on @delndao`+` ${isCampaign? `.... Please support the ${campaignName} campaign on DLN`:"."}`
                              : data.isBackedByUser
                              ? `I have just backed ${state.inputs.userName}’s ${state.inputs.proposalName} proposal on @delndao, please join me.`+` ${isCampaign? `.... Please support the ${campaignName} campaign on DLN`:"."}`
                              : `Please support ${state.inputs.userName}’s ${state.inputs.proposalName} proposal on @delndao`+` ${isCampaign? `.... Please support the ${campaignName} campaign on DLN`:"."}`
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
                      show={
                        isDemoMode === true && isTweetbuttonClicked === true
                      }
                      placement='top'
                    >
                      {(props) => (
                        <Tooltip
                          id='overlay-tweet'
                          className='dln-poppver-tooltip'
                          {...props}
                        >
                          {strings.shareViaTwitter}
                          <p>{strings.usersCansShareViaTwitter}</p>
                        </Tooltip>
                      )}
                    </Overlay>
                  </Col>
                )}
              {isIgnored && (
                <Col>
                  <MaterialToolTip
                    PopperProps={{ disablePortal: true }}
                    classes={{
                      tooltip: isDemoMode ? "d-none" : "dln-tooltip",
                      arrow: "dln-tooltip-arrow",
                    }}
                    arrow
                    placement='top'
                    title={strings.unignoreProposal}
                  >
                    <img
                      className='app-action-icon'
                      src={unignoreIcon}
                      alt='icon'
                      onClick={(e) => handleOpenModalUnIgnore()}
                      ref={unignoreAction}
                    />
                  </MaterialToolTip>
                  {showUnIgnoreModal && (
                    <ConfirmationModal
                      message={strings.confirmationUnIgnore}
                      ConfirmationModalConfirm={(e) =>
                        handleUnIgnore(e, state.inputs.id)
                      }
                      ConfirmationModalCancel={() =>
                        setShowUnIgnoreModal(false)
                      }
                    />
                  )}
                  <Overlay
                    target={unignoreAction}
                    show={
                      isDemoMode === true && isUnIgnorebuttonClicked === true
                    }
                    placement='top'
                  >
                    {(props) => (
                      <Tooltip
                        id='overlay-edit'
                        className='dln-poppver-tooltip'
                        {...props}
                      >
                        {strings.unignoreProposal}
                        <p>{strings.unignoreProposalDesc}</p>
                      </Tooltip>
                    )}
                  </Overlay>
                </Col>
              )}
            </Row>
          ):( <Link to="/App/start" className="app-primary-btn">
          {strings.getStart}
        </Link>)}
         </Form>
        </Col>
      </Row>
    </Fragment>
  );
}

export default SingleProposal;
