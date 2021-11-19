import { Container, makeStyles } from "@material-ui/core";
import Router from "next/router";
import React, { useContext, useEffect, useState } from "react";
import Cookies from "universal-cookie";
import { apiRequest } from "../../../public/lib/apiOperations";
import getTexts from "../../../public/texts/texts";
import FeedbackContext from "../context/FeedbackContext";
import UserContext from "../context/UserContext";
import LoadingSpinner from "../general/LoadingSpinner";
import ClimateMatchQuestion from "./ClimateMatchQuestion";
import WelcomeToClimateMatch from "./WelcomeToClimateMatch";

const useStyles = makeStyles((theme) => ({
  root: {
    background: theme.palette.primary.main,
    marginTop: theme.spacing(-2),
    color: "white",
    borderRadius: theme.spacing(4),
    fontFamily: "flood-std, sans-serif",
    fontStyle: "normal",
    paddingLeft: 0,
    paddingRight: 0,
    position: "relative",
    ["@media (max-width: 760px"]: {
      maxHeight: "calc(100vh - 98px)",
    },
  },
  loadingOverlay: {
    background: theme.palette.primary.main,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: theme.spacing(4),
    zIndex: 10,
    display: "flex",
    alignItems: "center",
  },
}));

const getInitialUserAnswerArray = (questions) => {
  //initialize answers to choice questions with "" and answers to ranking questions
  //with an empty array
  return questions
    .sort((a, b) => a.step - b.step)
    .map((q) => (q.answer_type === "answer" ? "" : []));
};

export default function ClimateMatchRoot() {
  const { locale, user } = useContext(UserContext);
  const texts = getTexts({ page: "climatematch", locale: locale });
  const [step, setStep] = useState(0);
  const classes = useStyles({ step: step });
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [location, setLocation] = useState(null);
  const [userAnswers, setUserAnswers] = useState([]);
  const cookies = new Cookies();
  const token = cookies.get("token");
  const { showFeedbackMessage } = useContext(FeedbackContext);

  //get initial props after the page loaded
  useEffect(async function () {
    //getHubClimateMatchInfo if ?location="..." is set in the url
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());
    if (params.location) setLocation(params.location);
    const retrievedQuestionsData = await getQuestions(token, locale, params.location);
    setQuestions(retrievedQuestionsData.results);
    setTotalQuestions(retrievedQuestionsData.total_questions);
    setUserAnswers(getInitialUserAnswerArray(retrievedQuestionsData.results));
    setIsLoading(false);
  }, []);

  const goToNextStep = () => {
    setStep(step + 1);
  };

  const submitUserQuestionAnswerForClimateMatch = (userAnswers, token, locale) => {
    apiRequest({
      method: "post",
      url: `/api/members/${user.url_slug}/question_answers/`,
      payload: parseUserQuestionAnswers(userAnswers, questions),
      token: token,
      locale: locale,
    })
      .then(function (response) {
        console.log(response.data);
        Router.push("/climatematchresults");
      })
      .catch(function (error) {
        console.log(error);
        console.log(error?.response?.data?.message);
        if (error?.response?.data?.message) {
          showFeedbackMessage({
            message: error.response.data.message,
            error: true,
          });
        }
      });
  };

  const handleForwardClick = (answer) => {
    const newUserAnswers = answer
      ? [...userAnswers.slice(0, step - 1), answer, ...userAnswers.slice(step)]
      : userAnswers;
    if (answer) {
      setUserAnswers(newUserAnswers);
    }
    if (step < totalQuestions) {
      setStep(step + 1);
    } else {
      const answersToSubmit = answer ? newUserAnswers : userAnswers;
      submitUserQuestionAnswerForClimateMatch(answersToSubmit, token, locale);
    }
  };

  const handleBackClick = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const handleChangeAnswers = (step, newAnswer) =>
    setUserAnswers([...userAnswers.slice(0, step - 1), newAnswer, ...userAnswers.slice(step)]);
  return (
    <Container className={classes.root}>
      {isLoading && (
        <div className={classes.loadingOverlay}>
          <LoadingSpinner
            isLoading
            color="#fff"
            noMarginTop
            message={texts.loading_the_climatematch}
          />
        </div>
      )}
      {step === 0 ? (
        //In the beginning we don't know the hub name and background picture of welcomeToClimateMatch yet
        //We still load the component in loading state because we need to know the height of the container
        <WelcomeToClimateMatch
          isLoading={isLoading}
          goToNextStep={goToNextStep}
          location={location}
        />
      ) : (
        <ClimateMatchQuestion
          questions={questions}
          step={step}
          userAnswers={userAnswers}
          onChangeAnswer={handleChangeAnswers}
          handleForwardClick={handleForwardClick}
          onBackClick={handleBackClick}
        />
      )}
    </Container>
  );
}

const parseUserQuestionAnswers = (userAnswers, questions) => {
  const userQuestionAnswers = questions.map((q, i) => ({
    question_id: q.id,
    answers: userAnswers[i],
  }));
  return {
    user_question_answers: userQuestionAnswers,
  };
};

const getQuestions = async (token, locale, location) => {
  // TODO (Dip): Check about location logic here
  // "location" determines what images to show and could lead to different questions
  try {
    const resp = await apiRequest({
      method: "get",
      url: "/api/questions/",
      locale: locale,
      token: token,
      location: location,
    });
    return resp.data;
  } catch (e) {
    console.log(e);
  }
};