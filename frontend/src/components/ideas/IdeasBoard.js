import { makeStyles, useMediaQuery } from "@material-ui/core"
import React, { useState } from "react"
import EditIdea from './EditIdea'
import IdeaPreviews from "./IdeaPreviews"

const useStyles = makeStyles(theme => ({
  root: props => ({
    display: props.ideaOpen ? "flex" : "default"
  }),
  idea: {
    flexGrow: 2,
    width: "70%"
  }
}))
export default function IdeasBoard({
  hasMore,
  loadFunc,
  ideas,
  allHubs,
  userOrganizations
}) {  
  const [idea, setIdea] = useState(null)
  const classes = useStyles({ideaOpen: idea !== null})
  const isNarrowScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));

  const onClickIdea = async (idea) => {
    console.log(idea)
    //catch idea from api
    //then setIdea(idea)
    setIdea(idea);
  }
  return (
    <div className={classes.root}>
      <IdeaPreviews
        hasMore={hasMore}
        loadFunc={loadFunc}
        parentHandlesGridItems
        ideas={ideas}
        allHubs={allHubs}
        userOrganizations={userOrganizations}
        onClickIdea={onClickIdea}
        hasIdeaOpen={!!idea}
      />
      {
        idea && !isNarrowScreen && (
          <div className={classes.idea}>
            <EditIdea idea={idea}/>
          </div>
        )
      }
      {
        idea && isNarrowScreen && (
          /* display mobile idea */
          <EditIdea idea={idea}/>
        )
      }
    </div>
  )
}