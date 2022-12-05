import {
  Avatar,
  Button,
  Chip,
  Container,
  Link,
  Tooltip,
  Typography,
  Divider,
  Box,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import PlaceIcon from "@material-ui/icons/Place";
import React, { useContext, useState, useEffect } from "react";
import Linkify from "react-linkify";
import Cookies from "universal-cookie";
import FeedbackContext from "../context/FeedbackContext";
import { getLocalePrefix } from "../../../public/lib/apiOperations";
import DetailledDescription from "./DetailledDescription";
import getTexts from "../../../public/texts/texts";
import MessageContent from "../communication/MessageContent";
import MiniHubPreviews from "../hub/MiniHubPreviews";
import MiniOrganizationPreview from "../organization/MiniOrganizationPreview";
import ProfileBadge from "../profile/ProfileBadge";
import SocialMediaShareButton from "../shareContent/SocialMediaShareButton";
import UserContext from "../context/UserContext";
import EditSharpIcon from "@material-ui/icons/EditSharp";
import IconButton from "@material-ui/core/IconButton";

import ConfirmDialog from "../dialogs/ConfirmDialog";
import FollowersDialog from "../dialogs/FollowersDialog";
import { apiRequest } from "../../../public/lib/apiOperations";
import { useLongPress } from "use-long-press";
import { getParams } from "../../../public/lib/generalOperations";
import FollowButton from "../general/FollowButton";
import { NOTIFICATION_TYPES } from "../communication/notifications/Notification";

import SelectWithText from "./SelectWithText";
import SubTitleWithContent from "../general/SubTitleWithContent";

const useStyles = makeStyles((theme) => ({
  avatarContainer: {
    display: "flex",
    marginTop: theme.spacing(-15),
    justifyContent: "center",
  },
  avatar: {
    height: theme.spacing(20),
    width: theme.spacing(20),
    fontSize: 50,
    border: "4px solid white",
    backgroundcolor: "white",
    "& img": {
      objectFit: "contain",
      backgroundColor: "white",
    },
  },

  name: {
    fontWeight: "bold",
    padding: theme.spacing(1),
    paddingLeft: 0,
    paddingRight: 0,
    wordBreak: "break-word",
  },
  subtitle: {
    color: `${theme.palette.secondary.main}`,
    fontWeight: "bold",
    wordBreak: "break-word",
  },
  content: {
    color: `${theme.palette.secondary.main}`,
    fontSize: 16,
    paddingBottom: theme.spacing(2),
    wordBreak: "break-word",
  },
  location: {
    marginBottom: theme.spacing(2),
  },
  noPadding: {
    padding: 0,
  },

  noprofile: {
    textAlign: "center",
    padding: theme.spacing(5),
  },
  marginTop: {
    marginTop: theme.spacing(1),
  },
  chip: (props) => ({
    marginBottom: props.isOrganization ? theme.spacing(0.5) : theme.spacing(1),
    minWidth: 200,
    borderRadius: 20,
  }),

  marginBottom: {
    marginBottom: theme.spacing(1),
  },
  marginRight: {
    marginRight: theme.spacing(0.5),
  },
  editButton: {
    position: "relative",
    cursor: "pointer",
    color: theme.palette.primary.main,
    width: "35px",
    height: "35px",
    marginRight: theme.spacing(0.5),
    backgroundColor: "white",
    "&:hover": {
      backgroundColor: "white",
    },
    borderRadius: "50%",
    padding: "5px",
    left: "0",
  },
  infoIcon: {
    marginBottom: -4,
  },
  innerIcon: {
    marginRight: theme.spacing(0.5),
    marginLeft: -theme.spacing(1),
  },
  detailledDescription: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
  },
  shareButtonContainer: {
    position: "relative",
    right: "0",
  },
  smallIconContainer: {
    position: "absolute",
    width: "auto",
    display: "flex",
    justifyContent: "space-between",
    marginRight: theme.spacing(2),
    marginBottom: theme.spacing(2),
    right: "0%",
    bottom: "0%",
  },
  subOrgContainer: {
    display: "flex",
    alignItems: "center",
  },
  isSubOrgText: {
    marginRight: theme.spacing(1),
  },
  miniOrgPreview: {
    display: "flex",
  },

  website: {
    marginTop: theme.spacing(1),
  },
  websiteLink: {
    marginTop: theme.spacing(-0.25),
    fontStyle: "italic",
    fontSize: 13,
    wordBreak: "break-word",
  },

  socialMediaLink: {
    height: 20,
    marginRight: theme.spacing(1),
    marginTop: theme.spacing(1),
    marginLeft: theme.spacing(1),
    color: theme.palette.primary.main,
  },
  mainContainer: {
    display: "flex",
    flexDirection: "column",
    [theme.breakpoints.up("md")]: {
      flexDirection: "row",
    },
  },
  leftInfoContainer: {
    display: "flex",
    flexDirection: "column",
    textAlign: "center",
    [theme.breakpoints.up("md")]: {
      marginLeft: theme.spacing(-3),
      width: "25%",
    },
  },
  middleInfoContainer: {
    display: "flex",
    flexDirection: "column",
    [theme.breakpoints.up("md")]: {
      width: "60%",
      marginTop: theme.spacing(1),
    },
  },
  buttonInfoContainer: {
    [theme.breakpoints.up("md")]: {
      marginRight: theme.spacing(-3),
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
  },
  followButton: {
    marginTop: theme.spacing(1),
    width: 225,
  },
  sideButton: {
    width: 225,
    marginTop: theme.spacing(5),
  },
  sizeContainer: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
  },
  getInvolvedContainer: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    marginRight: theme.spacing(1),
  },
  selectContainer: {
    display: "flex",
    flexDirection: "row",
  },
  followButtonContainer: {
    marginTop: theme.spacing(1),
  },
}));

//Generic component to display personal profiles or organization profiles
export default function AccountPage({
  account,
  default_background,
  editHref,
  /*
  object with properties that can be changed and their types (e.g. "summary" is a "text" type)
    E.g. for organizations this is generated by the function in public/data/organization_info_metadata.js
  */
  infoMetadata,
  children,
  isOwnAccount,
  isOrganization,
  editText,
  isTinyScreen,
  isSmallScreen,
  numberOfFollowers,
  handleFollow,
  followingChangePending,
  isUserFollowing,
}) {
  const classes = useStyles({ isOwnAccount: isOwnAccount, isOrganization: isOrganization });
  const { locale, user } = useContext(UserContext);
  const token = new Cookies().get("auth_token");
  const texts = getTexts({ page: "profile", locale: locale });
  const organizationTexts = isOrganization
    ? getTexts({ page: "organization", organization: account, locale: locale })
    : "Not an organization";
  const componentDecorator = (href, text, key) => (
    <Link
      color="primary"
      underline="always"
      href={href}
      key={key}
      target="_blank"
      rel="noopener noreferrer"
    >
      {text}
    </Link>
  );

  // Following codeblock handles follow button for organizations
  const [confirmDialogOpen, setConfirmDialogOpen] = useState({
    follow: false,
  });

  const onFollowDialogClose = (confirmed) => {
    if (confirmed) toggleFollowOrganization();
    setConfirmDialogOpen({ ...confirmDialogOpen, follow: false });
  };

  const { showFeedbackMessage } = useContext(FeedbackContext);

  const handleToggleFollowOrganization = () => {
    if (!token)
      showFeedbackMessage({
        message: <span>{organizationTexts.please_log_in_to_follow_an_organization}</span>,
        error: true,
        promptLogIn: true,
      });
    else if (isUserFollowing) setConfirmDialogOpen({ ...confirmDialogOpen, follow: true });
    else toggleFollowOrganization();
  };

  const toggleFollowOrganization = () => {
    handleFollow(isUserFollowing, false, true);
    apiRequest({
      method: "post",
      url: "/api/organizations/" + account.url_slug + "/set_follow/",
      payload: { following: !isUserFollowing },
      token: token,
      locale: locale,
    })
      .then(function (response) {
        handleFollow(response.data.following, true, false);
        updateFollowers();
        showFeedbackMessage({
          message: response.data.message,
        });
      })
      .catch(function (error) {
        console.log(error);
        if (error && error.reponse) console.log(error.response);
      });
  };

  const handleReadNotifications = async (notificationType) => {
    const notification_to_set_read = notifications.filter(
      (n) =>
        n.notification_type === notificationType && n.organization.url_slug === account.url_slug
    );
    await setNotificationsRead(token, notification_to_set_read, locale);
    await refreshNotifications();
  };

  const { notifications, setNotificationsRead, refreshNotifications } = useContext(UserContext);

  const [initiallyCaughtFollowers, setInitiallyCaughtFollowers] = useState(false);
  const [followers, setFollowers] = useState([]);
  const [showFollowers, setShowFollowers] = useState(false);

  const toggleShowFollowers = async () => {
    setShowFollowers(!showFollowers);
    if (!initiallyCaughtFollowers) {
      await updateFollowers();
      handleReadNotifications(NOTIFICATION_TYPES.indexOf("organization_follower"));
      setInitiallyCaughtFollowers(true);
    }
  };
  const updateFollowers = async () => {
    const retrievedFollowers = await getFollowers(account, token, locale);
    setFollowers(retrievedFollowers);
  };

  const [gotParams, setGotParams] = useState(false);
  useEffect(() => {
    if (!gotParams) {
      const params = getParams(window.location.href);
      if (params.show_followers && !showFollowers) toggleShowFollowers();
      setGotParams(true);
    }
  });

  const bindFollow = useLongPress(() => {
    toggleShowFollowers();
  }); // end of follow organizations codeblock

  const displayAccountInfo = (info) =>
    Object.keys(info)
      .sort((a, b) => {
        a = getFullInfoElement(infoMetadata, a, info[a]);
        b = getFullInfoElement(infoMetadata, b, info[b]);
        return b?.weight - a?.weight;
      })
      .map((key, index) => {
        if (info[key]) {
          const i = getFullInfoElement(infoMetadata, key, info[key]);
          const value = Array.isArray(i.value) ? i.value.join(", ") : i.value;
          const additionalText = i.additionalText ? i.additionalText : "";
          if (key === "parent_organization") {
            if (value.name)
              return (
                <div key={index} className={`${classes.subtitle} ${classes.subOrgContainer}`}>
                  <Typography className={classes.isSubOrgText}>
                    {account.name} {texts.is_a_suborganization_of}{" "}
                  </Typography>
                  <MiniOrganizationPreview
                    className={classes.miniOrgPreview}
                    organization={value}
                    size="small"
                  />
                </div>
              );
          } else if (i.type === "selectwithtext" && value) {
            return <SelectWithText types={account.types} info={i} key={index} />;
          } else if (i.type === "array" && i?.value?.length > 0) {
            return (
              <div key={index} className={classes.infoElement}>
                <div className={classes.subtitle}>{i.name}:</div>
                <div className={classes.marginBottom}>
                  {i && i.value && i.value.length > 0
                    ? i.value.map((entry) => (
                        <Chip size="medium" label={entry} key={entry} className={classes.chip} />
                      ))
                    : i.missingMessage && <div className={classes.content}>{i.missingMessage}</div>}
                </div>
              </div>
            );
          } else if (i.linkify && value && !isOrganization) {
            return (
              <>
                <div className={classes.subtitle}>{i.name}:</div>
                <Linkify componentDecorator={componentDecorator} key={index}>
                  <div className={classes.content}>{value}</div>
                </Linkify>
              </>
            );
          } else if (i.type === "bio" && value) {
            return (
              <div key={index} className={classes.content}>
                <MessageContent content={value ? value + additionalText : i.missingMessage} />
              </div>
            );
          } else if (i.type === "hubs") {
            return (
              <>
                {i.value.length > 0 && <div className={classes.subtitle}>{i.name}:</div>}

                <MiniHubPreviews hubs={i.value} />
              </>
            );
          } else if (i.type === "select" && value) {
            const textValue = i.options ? i.options.find((o) => o?.key === value).name : value;
            return (
              <div key={index}>
                <SubTitleWithContent
                  subtitle={i.name + ":"}
                  content={textValue ? textValue + additionalText : i.missingMessage}
                />
              </div>
            );
          } else if (
            value &&
            !["detailled_description", "location", "checkbox"].includes(i.type) &&
            !isOrganization
          ) {
            return (
              <div key={index}>
                <SubTitleWithContent
                  subtitle={i.name + ":"}
                  content={value ? value + additionalText : i.missingMessage}
                />
              </div>
            );
          }
        }
      });
  const getDetailledDescription = () => {
    const detailled_description_obj = Object.keys(account.info).filter((i) => {
      const el = getFullInfoElement(infoMetadata, i, account.info[i]);
      return el.type === "detailled_description";
    });
    if (detailled_description_obj.length > 0) {
      const key = detailled_description_obj[0];
      return getFullInfoElement(infoMetadata, key, account.info[key]);
    } else return null;
  };
  const detailledDescription = getDetailledDescription();
  const locationKeys = Object.keys(account.info).filter((key) => {
    const infoElement = getFullInfoElement(infoMetadata, key, account.info[key]);
    return infoElement.type === "location";
  });
  const location = locationKeys.length > 0 ? account.info[locationKeys[0]] : null;
  const locationAdditionalText = location?.additionalText ? location.additionalText : "";

  const avatarProps = {
    alt: account.name,
    component: "div",
    size: "large",
    src: account.image,
    className: classes.avatar,
  };

  return (
    <Container maxWidth="lg" className={classes.noPadding}>
      <div
        style={{
          background: `url(${
            account.background_image ? account.background_image : default_background
          })`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          width: "100%",
          height: 305,
          position: "relative",
        }}
      >
        <div className={classes.smallIconContainer}>
          {isOwnAccount && isSmallScreen && (
            <IconButton href={editHref} className={classes.editButton}>
              <EditSharpIcon />
            </IconButton>
          )}
          {isOrganization && (
            <SocialMediaShareButton
              containerClassName={classes.shareButtonContainer}
              contentLinkPath={`${getLocalePrefix(locale)}/organizations/${account.url_slug}`}
              apiEndpoint={`/api/organizations/${account.url_slug}/set_shared_organization/`}
              locale={locale}
              token={token}
              messageTitle={`${organizationTexts.climate_protection_organization}${account.name}`}
              tinyScreen={isTinyScreen}
              smallScreen={isSmallScreen}
              mailBody={organizationTexts.share_organization_email_body}
              texts={texts}
              dialogTitle={organizationTexts.tell_others_about_this_organization}
              switchColors={true}
            />
          )}
        </div>
      </div>

      <Container className={classes.mainContainer}>
        <Container className={classes.leftInfoContainer}>
          <div className={classes.avatarContainer}>
            {account.badges?.length > 0 ? (
              <ProfileBadge badge={account.badges[0]}>
                <Avatar {...avatarProps} />
              </ProfileBadge>
            ) : (
              <Avatar {...avatarProps} />
            )}
          </div>
          <Typography variant="h5" className={classes.name}>
            {account.name}
          </Typography>
          {location && (
            <div>
              <div className={classes.location}>
                <Tooltip title="Location">
                  <PlaceIcon color="primary" className={classes.infoIcon} />
                </Tooltip>
                {location ? location + locationAdditionalText : location.missingMessage}
              </div>
            </div>
          )}
          {account.types && (
            <Container className={classes.noPadding}>
              {account.types.map((type) => (
                <Chip label={type.name} key={type.key} className={classes.chip} />
              ))}
            </Container>
          )}
          {isOrganization && (
            <div className={classes.website}>
              <Typography variant="caption"> {organizationTexts.find_us_here} </Typography>
              <Linkify componentDecorator={componentDecorator}>
                {" "}
                <Typography className={classes.websiteLink}> {account.info.website}</Typography>
              </Linkify>
            </div>
          )}
          {isOrganization && (
            <div className={classes.followButtonContainer}>
              <FollowButton
                isUserFollowing={isUserFollowing}
                handleToggleFollow={handleToggleFollowOrganization}
                toggleShowFollowers={toggleShowFollowers}
                bindFollow={bindFollow}
                numberOfFollowers={numberOfFollowers}
                texts={organizationTexts}
                shouldBeFullWidth={true}
                followingChangePending={followingChangePending}
                isLoggedIn={user}
                showLinkUnderButton
                toolTipText={organizationTexts.follow_for_updates}
                toolTipPlacement="bottom"
              />

              <Typography className={classes.followInfo}>
                {organizationTexts.follow_this_organization_for_updates}
              </Typography>
            </div>
          )}
        </Container>
        <Container className={classes.middleInfoContainer}>
          {displayAccountInfo(account.info)}
        </Container>

        {user && (
          <div className={classes.buttonInfoContainer}>
            {!isSmallScreen && isOwnAccount && (
              <>
                <Button
                  className={classes.sideButton}
                  variant="contained"
                  color="primary"
                  href={editHref}
                >
                  <EditSharpIcon className={classes.innerIcon} />
                  {editText ? editText : texts.edit_profile}
                </Button>
              </>
            )}
          </div>
        )}
      </Container>
      <FollowersDialog
        open={showFollowers}
        loading={!initiallyCaughtFollowers}
        followers={followers}
        object={account}
        onClose={toggleShowFollowers}
        user={user}
        url={"organization/" + account.url_slug + "?show_followers=true"}
        titleText={organizationTexts.followers_of}
        pleaseLogInText={organizationTexts.please_log_in}
        toSeeFollowerText={organizationTexts.to_see_this_organizations_followers}
        logInText={organizationTexts.log_in}
        noFollowersText={organizationTexts.this_organzation_does_not_have_any_followers_yet}
        followingSinceText={organizationTexts.following_since}
      />
      <ConfirmDialog
        open={confirmDialogOpen.follow}
        onClose={onFollowDialogClose}
        title={organizationTexts.do_you_really_want_to_unfollow}
        text={
          <span>{organizationTexts.are_you_sure_that_you_want_to_unfollow_this_organization}</span>
        }
        confirmText={organizationTexts.yes}
        cancelText={organizationTexts.no}
      />
      <Divider className={classes.marginTop} />
      {detailledDescription?.value && (
        <Container>
          <DetailledDescription
            title={detailledDescription.name}
            value={detailledDescription.value}
            className={classes.detailledDescription}
          />
        </Container>
      )}
      {children}
    </Container>
  );
}

const getFollowers = async (organization, token, locale) => {
  try {
    const resp = await apiRequest({
      method: "get",
      url: "/api/organizations/" + organization.url_slug + "/followers/",
      token: token,
      locale: locale,
    });
    return resp.data.results;
  } catch (err) {
    console.log(err);
    if (err.response && err.response.data) console.log("Error: " + err.response.data.detail);
  }
};

const getFullInfoElement = (infoMetadata, key, value) => {
  return { ...infoMetadata[key], value: value };
};
