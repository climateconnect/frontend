import Router from "next/router";
import React, { useContext, useEffect, useRef, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Cookies from "universal-cookie";
import { apiRequest } from "../public/lib/apiOperations";
import { getParams } from "../public/lib/generalOperations";
import {
  getLocationValue,
  indicateWrongLocation,
  isLocationValid,
  parseLocation,
} from "../public/lib/locationOperations";
import { redirectOnLogin, nullifyUndefinedValues } from "../public/lib/profileOperations";
import {
  getLastCompletedTutorialStep,
  getLastStepBeforeSkip,
} from "../public/lib/tutorialOperations";
import { getAllHubs } from "../public/lib/hubOperations.js";
import getTexts from "../public/texts/texts";
import UserContext from "../src/components/context/UserContext";
import Layout from "../src/components/layouts/layout";
import BasicInfo from "../src/components/signup/BasicInfo";
import AddInfo from "./../src/components/signup/AddInfo";
import AddInterests from "../src/components/signup/AddInterests";
import theme from "../src/themes/theme";

export async function getServerSideProps(ctx) {
  const [allHubs] = await Promise.all([getAllHubs(ctx.locale, true)]);
  return {
    props: nullifyUndefinedValues({
      allHubs: allHubs,
    }),
  };
}

const useStyles = makeStyles({
  box: {
    borderRadius: "10%",
    boxShadow: "2px 4px 10px 4px rgba(0,0,0,0.1)",
    maxWidth: 700,
    minWidth: 350,
  },
  image: {
    width: 450,
    alignSelf: "flex-end ",
  },
  interestsPageImage: {
    width: 450,
    alignSelf: "center",
  },
  root: {
    display: "flex",
    justifyContent: "space-between",
    flexWrap: "wrap",
    marginBottom: theme.spacing(5),
  },
});

export default function Signup({ allHubs }) {
  const { ReactGA } = useContext(UserContext);

  const [userInfo, setUserInfo] = React.useState({
    email: "",
    password: "",
    repeatpassword: "",
    first_name: "",
    last_name: "",
    location: {},
    newsletter: "",
  });
  const classes = useStyles();
  const cookies = new Cookies();
  const { user, locale } = useContext(UserContext);
  const texts = getTexts({ page: "profile", locale: locale });
  //Information about the completion state of the tutorial
  const tutorialCookie = cookies.get("finishedTutorialSteps");
  const isClimateActorCookie = cookies.get("tutorialVariables");
  const curTutorialStep = getLastCompletedTutorialStep(tutorialCookie);
  const lastCompletedTutorialStep =
    curTutorialStep === -1
      ? getLastStepBeforeSkip(cookies.get("lastStepBeforeSkipTutorial"))
      : curTutorialStep;
  const steps = ["basicinfo", "personalinfo", "interestsinfo"];
  const [curStep, setCurStep] = useState(steps[0]);
  const [errorMessage, setErrorMessage] = useState("");
  const locationInputRef = useRef(null);
  const [locationOptionsOpen, setLocationOptionsOpen] = useState(false);
  const handleSetLocationOptionsOpen = (bool) => {
    setLocationOptionsOpen(bool);
  };
  const [errorMessages, setErrorMessages] = useState(
    steps.reduce((obj, step) => {
      obj[step] = null;
      return obj;
    }, {})
  );
  const [isLoading, setIsLoading] = useState(false);

  useEffect(function () {
    if (user) {
      redirectOnLogin(user, "/", locale);
    }
  });

  const [interestsInfo, setInterestsInfo] = React.useState();
  const [selectedHubs, setSelectedHubs] = React.useState([]);

  const handleBasicInfoSubmit = (event, values) => {
    event.preventDefault();
    setUserInfo({
      ...userInfo,
      email: values.email,
      password: values.password,
      repeatpassword: values.password,
    });
    //TODO: add check if email is still available
    if (values.password !== values.repeatpassword)
      setErrorMessages({ ...errorMessages, [steps[0]]: texts.passwords_dont_match });
    else setCurStep(steps[1]);
  };

  const handleAddInfoSubmit = (event, values) => {
    event.preventDefault();
    if (!isLocationValid(values.location)) {
      indicateWrongLocation(locationInputRef, setLocationOptionsOpen, setErrorMessage, texts);
      return;
    }
    const location = getLocationValue(values, "location");
    setUserInfo({
      ...userInfo,
      first_name: values.first_name,
      last_name: values.last_name,
      location: location,
      sendNewsletter: values.sendNewsletter,
    });
    setCurStep(steps[2]);
  };

  const handleAddInterestsSubmit = (event, values, skipInterests) => {
    event.preventDefault();
    if (skipInterests) {
      setInterestsInfo([]);
    }
    sendPayload();
  };

  const sendPayload = () => {
    const params = getParams(window?.location?.href);
    const payload = {
      email: userInfo.email.trim().toLowerCase(),
      password: userInfo.password,
      first_name: userInfo.first_name.trim(),
      last_name: userInfo.last_name.trim(),
      location: parseLocation(userInfo.location),
      send_newsletter: userInfo.sendNewsletter,
      from_tutorial: params?.from_tutorial === "true",
      is_activist: isClimateActorCookie?.isActivist,
      last_completed_tutorial_step: lastCompletedTutorialStep,
      source_language: locale,
      interests: interestsInfo,
    };
    const headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
    };
    setIsLoading(true);
    apiRequest({
      method: "post",
      url: "/signup/",
      payload: payload,
      headers: headers,
      locale: locale,
    })
      .then(function () {
        ReactGA.event({
          category: "User",
          action: "Created an Account",
        });
        Router.push({
          pathname: "/accountcreated/",
        });
      })
      .catch(function (error) {
        console.log(error);
        setIsLoading(false);
        if (error.response.data.message)
          setErrorMessages({ ...errorMessages, [steps[2]]: error.response.data.message });
        else if (error.response.data.length > 0)
          setErrorMessages({ ...errorMessages, [steps[2]]: error.response.data[0] });
      });
  };

  const handleGoBackFromAddInfo = (event, values) => {
    event.preventDefault();
    setUserInfo({
      ...userInfo,
      first_name: values.first_name,
      last_name: values.last_name,
      location: getLocationValue(values, "location"),
    });
    setCurStep(steps[0]);
  };

  const handleGoBackFromInterestsInfo = (event) => {
    event.preventDefault();
    setCurStep(steps[1]);
  };

  const handleOnInterestsInfoTextFieldChange = (url_slug, description) => {
    const temp = { ...interestsInfo, [url_slug]: description.substring(0, 256) };
    setInterestsInfo(temp);
  };

  const onSelectNewHub = (event) => {
    event.preventDefault();
    const hub = allHubs.find((h) => h.name === event.target.value);
    if (selectedHubs?.filter((h) => h.url_slug === hub.url_slug)?.length === 0) {
      setSelectedHubs([...selectedHubs, hub]);
      setInterestsInfo({ ...interestsInfo, [hub.url_slug]: "" });
    }
  };

  const onClickRemoveHub = (hub) => {
    const hubsAfterRemoval = selectedHubs?.filter((h) => h.url_slug !== hub.url_slug);
    setSelectedHubs(hubsAfterRemoval);
    const interestsInfoAfterRemoval = interestsInfo;
    delete interestsInfoAfterRemoval[hub.url_slug];
    setInterestsInfo(interestsInfoAfterRemoval);
  };

  return (
    <Layout isLoading={isLoading} message={errorMessage} messageType={errorMessage && "error"}>
      <div className={classes.root}>
        {curStep === "basicinfo" && (
          <BasicInfo
            title={texts.sign_up}
            values={userInfo}
            handleSubmit={handleBasicInfoSubmit}
            errorMessage={errorMessages[steps[0]]}
          />
        )}
        {curStep === "personalinfo" && (
          <AddInfo
            values={userInfo}
            handleSubmit={handleAddInfoSubmit}
            errorMessage={errorMessages[steps[1]]}
            handleGoBack={handleGoBackFromAddInfo}
            locationInputRef={locationInputRef}
            locationOptionsOpen={locationOptionsOpen}
            handleSetLocationOptionsOpen={handleSetLocationOptionsOpen}
          />
        )}
        {curStep == "interestsinfo" && (
          <AddInterests
            selectedHubs={selectedHubs}
            allHubs={allHubs}
            interestsInfo={interestsInfo}
            handleSubmit={handleAddInterestsSubmit}
            handleGoBack={handleGoBackFromInterestsInfo}
            onSelectNewHub={onSelectNewHub}
            onClickRemoveHub={onClickRemoveHub}
            onInterestsInfoTextFieldChange={handleOnInterestsInfoTextFieldChange}
          />
        )}
        {curStep != "interestsinfo" ? (
          <img src="/images/signup-1.svg" className={classes.image} />
        ) : (
          <img src="/images/questions_pana.svg" className={classes.interestsPageImage} />
        )}
      </div>
    </Layout>
  );
}
