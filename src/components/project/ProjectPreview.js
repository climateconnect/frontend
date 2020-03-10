import React from "react";
import Router from "next/router";
import Truncate from "react-truncate";
import { Typography, Card, CardMedia, CardContent } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import ProjectMetaData from "./ProjectMetaData";

const useStyles = makeStyles(theme => {
  return {
    root: {
      "&:hover": {
        cursor: "pointer"
      },
      "-webkit-user-select": "none",
      "-moz-user-select": "none",
      "-ms-user-select": "none",
      userSelect: "none",
      backgroundColor: "inherit",
      borderRadius: 0
    },
    bold: {
      fontWeight: "bold"
    },
    button: {
      marginTop: theme.spacing(1),
      margin: "0 auto",
      display: "block"
    }
  };
});

export default function ProjectPreview({ project }) {
  const classes = useStyles();

  return (
    <Card
      className={classes.root}
      variant="outlined"
      onClick={() => {
        Router.push(`/projects/${project.id}`);
      }}
    >
      <CardMedia
        className={classes.media}
        component={"img"}
        title={project.name}
        image={project.image}
      />
      <CardContent>
        <Typography variant="subtitle1" component="h2" className={classes.bold}>
          <Truncate lines={1} ellipsis="...">
            {project.name}
          </Truncate>
        </Typography>
        <ProjectMetaData project={project} />
      </CardContent>
    </Card>
  );
}
