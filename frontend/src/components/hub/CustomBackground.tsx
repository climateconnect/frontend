import { Theme, useMediaQuery } from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import React from "react";

const useStyles = makeStyles((theme) => ({
  background: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
    overflow: "hidden",
  },

  prioOneDefaultBackground: {
    backgroundColor: "#3134C7",
  },
  prioOneAccentBackground: {
    backgroundColor: "#7883FF",
  },
}));

type Props = { hubUrl: string | undefined };

/**
 * Adds a custom background to the hub, if one is defined. Currently only PrioOne has a custom background.
 * Mind that this component determines itself whether and which background to render based on the hubUrl
 * and the current pathname. This means that the background is not customizable by the user.
 * Some backgrounds are limited to certain pages (e.g. auth pages or browse pages).
 * Additionally, mobile versions are not supported yet and will result in no background being rendered.
 * @param hubUrl The URL of the hub.
 *
 */
export default function CustomBackground({ hubUrl }: Props) {
  const mobileScreenSize = useMediaQuery((theme: Theme) => theme.breakpoints.down("md"));

  if (!hubUrl || mobileScreenSize) {
    return null;
  }
  const pathname = window.location.pathname;
  console.log("pathname: ", pathname);

  switch (hubUrl.toLowerCase()) {
    case "prioone": {
      if (pathname == "/hubs/prioOne") {
        return <PrioOneBackgroundBrowse />;
      } else if (pathname.endsWith("/signup") || pathname.endsWith("/login")) {
        return <PrioOneBackgroundAuth />;
      }
    }
    default: {
      // all other hubs (and non hubs should not render a background)
      return null;
    }
  }
}

function PrioOneBackgroundBrowse() {
  const classes = useStyles();
  const height = 50;
  const width = 100;
  const triangleBottom = width * 0.5;
  const triangleLeft = width * 3;

  return (
    <div
      className={`${classes.background} ${classes.prioOneDefaultBackground}`}
      style={{ bottom: "auto", height: `${height}vh` }}
    >
      {/* Container within the background */}
      <div style={{ position: "relative" }}>
        {/* Upper triangle */}
        <div
          style={{
            width: 0,
            height: 0,
            borderBottom: `${triangleBottom}vh` + " solid transparent",
            borderLeft: `${triangleLeft}vh` + " solid #7883FF",
            position: "absolute",
            top: 0,
            left: 0,
            transform: "rotate(0deg)",
          }}
        />
      </div>
    </div>
  );
}

function PrioOneBackgroundAuth() {
  const classes = useStyles();

  return (
    <div className={`${classes.background} ${classes.prioOneDefaultBackground}`}>
      {/* Container within the background */}
      <div style={{ position: "relative" }}>
        {/* Upper triangle */}
        <div
          style={{
            width: 0,
            height: 0,
            borderBottom: "50vw solid transparent",
            borderLeft: "300vh solid #7883FF",
            position: "absolute",
            top: 0,
            left: 0,
            transform: "rotate(0deg)",
          }}
        />
      </div>
    </div>
  );
}