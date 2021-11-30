import { IconButton, makeStyles, useMediaQuery } from "@material-ui/core";
import ShareIcon from "@material-ui/icons/Share";
import React from "react";
import { apiRequest } from "../../../public/lib/apiOperations";
import SocialMediaShareDialog from "./SocialMediaShareDialog";

const useStyles = makeStyles((theme) => ({
  button: {
    color: "white",
    width: 35,
    height: 35,
    backgroundColor: theme.palette.primary.main,
    "&:hover": {
      backgroundColor: theme.palette.primary.main,
    },
  },
}));

export default function SocialMediaShareButton({
  containerClassName,
  content,
  contentAdmin,
  contentLinkPath,
  apiEndpoint,
  locale,
  token,
  title,
  tinyScreen,
  mailBody,
  texts,
}) {
  const classes = useStyles();

  const [showSocials, setShowSocials] = React.useState(false);
  const toggleShowSocials = (value) => {
    setShowSocials(value);
  };

  const [linkShared, setLinkShared] = React.useState(false);
  const createShareRecord = (sharedVia) => {
    if (sharedVia === 8 && linkShared) return; //only create a share-record for the link once per session
    apiRequest({
      method: "post",
      url: apiEndpoint,
      payload: { shared_via: sharedVia },
      token: token,
      locale: locale,
    })
      .then(() => {
        if (sharedVia === 8) {
          setLinkShared(true);
        }
      })
      .catch(function (error) {
        console.log(error);
        if (error && error.reponse) console.log(error.response);
      }); 
  }  

  //Assignment of the numbers has to match with ContentShares.SHARE_OPTIONS in the backend
  const SHARE_OPTIONS = {
    facebook: 0,
    fb_messenger: 1,
    twitter: 2,
    whatsapp: 3,
    linkedin: 4,
    reddit: 5,
    telegram: 6,
    e_mail: 7,
    link: 8,
    native_share_dialog_of_device: 9,
  };

  const BASE_URL = process.env.BASE_URL ? process.env.BASE_URL : "https://climateconnect.earth";
  const contentLink = BASE_URL + contentLinkPath;

  const handleClick = () => {
    //navigator.share (Web Share API) is only available with https
    if (navigator.share) {
      navigator
        .share({
          title: title,
          url: contentLink,
        })
        .then(() => {
          createShareRecord(SHARE_OPTIONS.native_share_dialog_of_device);
        })
        .catch(console.error);
    } else {
      toggleShowSocials(true);
    }
  };

  return (
    <>
      <div className={containerClassName}>
        <IconButton className={classes.button} onClick={handleClick}>
          {/*adjusted viewBox to center the icon*/}
          <ShareIcon viewBox="2 0 24 24" />
        </IconButton>
      </div>
      <SocialMediaShareDialog
        open={showSocials}
        onClose={toggleShowSocials}
        project={content}
        createShareRecord={createShareRecord}
        tinyScreen={tinyScreen}
        SHARE_OPTIONS={SHARE_OPTIONS}
        projectLink={contentLink}
        projectAdmin={contentAdmin}
        title={title}
        mailBody={mailBody}
        texts={texts}
      />
    </>
  );
}
