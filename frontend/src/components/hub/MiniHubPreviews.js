import { Grid, makeStyles } from "@material-ui/core";
import React from "react";
import MiniHubPreview from "./MiniHubPreview";

const useStyles = makeStyles((theme) => ({
  reset: {
    margin: 0,
    padding: 0,
    listStyleType: "none",
    width: "100%",
  },
  root: {
    marginLeft: theme.spacing(-1),
  },
  firstItem: {
    marginLeft: theme.spacing(-1),
  },
  lastItem: {
    marginRight: theme.spacing(-1),
  },
}));

export default function MiniHubPreviews({
  hubs,
  allHubs,
  interestsInfo,
  allowCreate,
  editMode,
  allowDescription,
  onSelectNewHub,
  onClickRemoveHub,
  onInterestsInfoTextFieldChange,
}) {
  const classes = useStyles();
  return (
    <Grid container component="ul" spacing={2} className={`${classes.reset} ${classes.root}`}>
      {hubs
        .filter((hub) => hub.hub_type !== "location hub")
        .map((hub, index) => (
          <GridItem
            hub={hub}
            key={hub.url_slug}
            editMode={editMode}
            isFirstItem={index === 0}
            onClickRemoveHub={onClickRemoveHub}
            allowDescription={allowDescription}
            onInterestsInfoTextFieldChange={onInterestsInfoTextFieldChange}
            interestsInfo={interestsInfo}
          />
        ))}
      {allowCreate && (
        <GridItem
          createMode
          isFirstItem={hubs.length === 0}
          isLastItem
          hubsToSelectFrom={allHubs}
          onSelectNewHub={onSelectNewHub}
        />
      )}
    </Grid>
  );
}

function GridItem({
  hub,
  createMode,
  editMode,
  hubsToSelectFrom,
  onSelectNewHub,
  onClickRemoveHub,
  allowDescription,
  onInterestsInfoTextFieldChange,
  interestsInfo,
}) {
  return (
    <Grid
      key={hub ? hub.url_slug : "create"}
      item
      xs={12}
      sm={editMode ? 6 : 12}
      md={8}
      lg={!createMode && !editMode && allowDescription ? 4 : 6} // 3 elements in a row for when you view the user profile
      component="li"
    >
      <MiniHubPreview
        hub={hub}
        interestsInfo={interestsInfo}
        createMode={createMode}
        editMode={editMode}
        allowDescription={allowDescription}
        hubsToSelectFrom={hubsToSelectFrom}
        onSelect={onSelectNewHub}
        onClickRemoveHub={onClickRemoveHub}
        onInterestsInfoTextFieldChange={onInterestsInfoTextFieldChange}
      />
    </Grid>
  );
}
