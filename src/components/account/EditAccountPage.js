import React from "react";
import { Container, Avatar, Chip, Button, TextField } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import AddAPhotoIcon from "@material-ui/icons/AddAPhoto";
import ControlPointIcon from "@material-ui/icons/ControlPoint";
import UploadImageDialog from "./../dialogs/UploadImageDialog";
import EnterTextDialog from "./../dialogs/EnterTextDialog";
import ConfirmDialog from "./../dialogs/ConfirmDialog";
import SelectField from "./../general/SelectField";
import SelectDialog from "./../dialogs/SelectDialog";
import profile_info_metadata from "./../../../public/data/profile_info_metadata.json";
import organization_info_metadata from "./../../../public/data/organization_info_metadata.json";
import organization_types from "./../../../public/data/organization_types.json";
import profile_types from "./../../../public/data/profile_types.json";

//TODO: use getInitialProps for this page

const useStyles = makeStyles(theme => ({
  backgroundContainer: {
    width: "100%",
    height: 305,
    position: "relative",
    cursor: "pointer"
  },
  backgroundImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover"
  },
  photoIcon: {
    position: "absolute",
    left: "-50%",
    top: "-50%",
    cursor: "pointer"
  },
  backgroundPhotoIcon: {
    fontSize: 80
  },
  avatarPhotoIcon: {
    fontSize: 40
  },
  backgroundPhotoIconContainer: {
    position: "absolute",
    left: "calc(50% - 40px)",
    top: "calc(50% - 40px)"
  },
  avatarPhotoIconContainer: {
    position: "absolute",
    left: "calc(50% - 20px)",
    top: "calc(50% - 20px)"
  },
  avatarWithInfo: {
    textAlign: "center",
    width: theme.spacing(40),
    margin: "0 auto",
    [theme.breakpoints.up("sm")]: {
      margin: 0,
      display: "inline-block",
      width: "auto"
    }
  },
  avatarContainer: {
    height: theme.spacing(20),
    width: theme.spacing(20),
    margin: "0 auto",
    marginTop: theme.spacing(-11),
    position: "relative",
    borderRadius: 100,
    cursor: "pointer"
  },
  avatar: {
    height: "100%",
    width: "100%",
    fontSize: 50,
    backgroundColor: "white",
    "& img": {
      objectFit: "contain",
      opacity: 0.5,
      cursor: "pointer"
    },
    border: `1px solid ${theme.palette.grey[300]}`
  },
  accountInfo: {
    padding: 0,
    marginTop: theme.spacing(1),
    [theme.breakpoints.up("sm")]: {
      paddingRight: theme.spacing(17)
    }
  },
  infoElement: {
    marginBottom: theme.spacing(1)
  },
  name: {
    fontWeight: "bold",
    padding: theme.spacing(1),
    paddingLeft: 0,
    paddingRight: 0
  },
  subtitle: {
    color: `${theme.palette.secondary.main}`
  },
  content: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    color: `${theme.palette.secondary.main}`,
    fontWeight: "bold"
  },
  noPadding: {
    padding: 0
  },
  infoContainer: {
    [theme.breakpoints.up("sm")]: {
      display: "flex"
    },
    position: "relative"
  },
  noprofile: {
    textAlign: "center",
    padding: theme.spacing(5)
  },
  marginTop: {
    marginTop: theme.spacing(1)
  },
  chip: {
    margin: theme.spacing(0.5)
  },
  actionButton: {
    position: "absolute",
    right: theme.spacing(1),
    width: theme.spacing(18),
    [theme.breakpoints.down("xs")]: {
      width: theme.spacing(14),
      fontSize: 10,
      textAlign: "center"
    }
  },
  saveButton: {
    top: theme.spacing(11.5),
    [theme.breakpoints.up("sm")]: {
      top: theme.spacing(1)
    }
  },
  cancelButton: {
    top: theme.spacing(16.5),
    [theme.breakpoints.up("sm")]: {
      top: theme.spacing(6.5)
    }
  },
  chipArray: {
    display: "flex",
    flexWrap: "wrap",
    padding: theme.spacing(0.5)
  },
  selectOption: {
    width: 250
  }
}));

//TODO: These should later be replaced by db calls
const getOrganizationTypes = () => {
  return organization_types.organization_types.map(type => {
    return {
      ...type,
      additionalInfo: type.additionalInfo.map(info => {
        return { ...getOrganizationInfoMetadata()[info], key: info };
      })
    };
  });
};
//TODO: possible store this function at a place where both AccountPage.js and EditAccountPage.js can access it
const getProfileTypes = () => {
  return profile_types.profile_types.map(type => {
    return {
      ...type,
      additionalInfo: type.additionalInfo.map(info => {
        return { ...getProfileInfoMetadata()[info], key: info };
      })
    };
  });
};
const getMaxProfileTypes = () => {
  console.log(profile_types.max_types);
  return profile_types.max_types;
};

const getMaxOrganizationTypes = () => {
  return organization_types.max_types;
};
const getOrganizationInfoMetadata = () => organization_info_metadata;
const getProfileInfoMetadata = () => profile_info_metadata;

const getAccountTypes = (type, types) => {
  if (type === "organization") {
    return getOrganizationTypes().filter(type => types.includes(type.key));
  }
  if (type === "profile") {
    return getProfileTypes().filter(type => types.includes(type.key));
  }
  return;
};

const getMaxAccountTypes = type => {
  if (type === "organization") {
    return getMaxOrganizationTypes();
  }
  if (type === "profile") {
    return getMaxProfileTypes();
  }
};

const getFullInfoElement = (key, value, type) => {
  if (type === "profile") return { ...getProfileInfoMetadata()[key], value: value };
  if (type === "organization") return { ...getOrganizationInfoMetadata()[key], value: value };
};

export default function EditAccountPage({ account, children, type }) {
  const classes = useStyles();
  const [editedAccount, setEditedAccount] = React.useState(account);
  //used for previwing images in UploadImageDialog
  const [tempImages, setTempImages] = React.useState({
    image: editedAccount.image,
    background_image: editedAccount.background_image
  });
  const [backgroundDialogOpen, setBackgroundDialogOpen] = React.useState(false);
  const [avatarDialogOpen, setAvatarDialogOpen] = React.useState(false);
  const [addTypeDialogOpen, setAddTypeDialogOpen] = React.useState(false);
  const [confirmExitOpen, setConfirmExitOpen] = React.useState(false);

  const getTypes = () => {
    if (type === "organization") return getOrganizationTypes();
    if (type === "profile") return getProfileTypes();
  };

  const handleBackgroundClickOpen = () => {
    setBackgroundDialogOpen(true);
  };

  const handleAvatarClickOpen = () => {
    setAvatarDialogOpen(true);
  };

  const handleConfirmExitOpen = () => {
    setConfirmExitOpen(true);
  };

  const handleAddTypeClickOpen = () => {
    setAddTypeDialogOpen(true);
  };
  const handleBackgroundClose = image => {
    setBackgroundDialogOpen(false);
    if (image && image instanceof HTMLCanvasElement)
      setEditedAccount({ ...editedAccount, background_image: image.toDataURL() });
  };

  const handleAvatarClose = image => {
    setAvatarDialogOpen(false);
    if (image && image instanceof HTMLCanvasElement) {
      setEditedAccount({ ...editedAccount, image: image.toDataURL() });
    }
  };

  const handleAddTypeClose = (type, additionalInfo) => {
    setAddTypeDialogOpen(false);
    const tempAccount = editedAccount;
    console.log(tempAccount);
    if (additionalInfo) {
      for (const info of additionalInfo) {
        console.log(info);
        tempAccount.info[info.key] = info.value;
      }
    }
    tempAccount.types = [...tempAccount.types, type];
    setEditedAccount(tempAccount);
  };

  const handleConfirmExitClose = exit => {
    setConfirmExitOpen(false);
    if (exit) console.log("exit page!");
  };

  const deleteFromInfoArray = (key, entry) => {
    setEditedAccount({
      ...editedAccount,
      info: {
        ...editedAccount.info,
        [key]: editedAccount.info[key].filter(val => val !== entry)
      }
    });
  };

  const displayInfoArrayData = (key, infoEl) => {
    const [arrayDialogOpen, setArrayDialogOpen] = React.useState(false);

    const handleTextDialogClose = element => {
      setArrayDialogOpen(false);
      if (element && element.length > 0) {
        setEditedAccount({
          ...editedAccount,
          info: { ...editedAccount.info, [key]: [...editedAccount.info[key], element] }
        });
      }
    };
    return (
      <div key={key} className={classes.infoElement}>
        <div className={classes.subtitle}>{infoEl.name}:</div>
        <div className={classes.chipArray}>
          {infoEl.value.map(entry => (
            <Chip
              size="medium"
              label={entry}
              key={entry}
              className={classes.chip}
              onDelete={() => deleteFromInfoArray(key, entry)}
            />
          ))}
          <Chip
            label="Add"
            icon={<ControlPointIcon />}
            className={classes.chip}
            onClick={setArrayDialogOpen}
          />
          <EnterTextDialog
            onClose={handleTextDialogClose}
            open={arrayDialogOpen}
            arrayName={infoEl.name}
          />
        </div>
      </div>
    );
  };

  const displayAccountInfo = info =>
    Object.keys(info).map(key => {
      const handleChange = event => {
        setEditedAccount({
          ...editedAccount,
          info: { ...editedAccount.info, key: event.target.value }
        });
      };
      const i = getFullInfoElement(key, info[key], type);
      //TODO check if this variable can be removed
      const additionalText = i.additionalText ? i.additionalText : "";
      if (i.type === "array") {
        return displayInfoArrayData(key, i);
      } else if (i.type === "select") {
        return (
          <div key={key} className={classes.infoElement}>
            <SelectField
              className={classes.selectOption}
              values={i.options}
              label={i.name}
              defaultValue={i.value}
              onChange={handleChange}
            />
          </div>
        );
      } else {
        return (
          <div key={key} className={classes.infoElement}>
            <div className={classes.subtitle}>{i.name}:</div>
            <TextField fullWidth defaultValue={i.value} multiline onChange={handleChange} />
            {additionalText && <div>{additionalText}</div>}
          </div>
        );
      }
    });

  const onBackgroundChange = backgroundEvent => {
    setTempImages(() => {
      return {
        ...tempImages,
        background_image: URL.createObjectURL(backgroundEvent.target.files[0])
      };
    });
    handleBackgroundClickOpen();
    /*setEditedAccount(() => {
      return {...editedAccount, background_image:URL.createObjectURL(backgroundEvent.target.files[0])};
    })*/
  };

  const onAvatarChange = avatarEvent => {
    setTempImages(() => {
      return { ...tempImages, image: URL.createObjectURL(avatarEvent.target.files[0]) };
    });
    handleAvatarClickOpen();
    /*setEditedAccount(() => {
      return {...editedAccount, image:URL.createObjectURL(avatarEvent.target.files[0])};
    })*/
  };

  const handleTypeDelete = type => {
    const tempEditedAccount = { ...editedAccount };
    const fullType = getTypes().filter(t => t.key === type)[0];
    if (fullType.additionalInfo) {
      for (const info of fullType.additionalInfo) {
        delete tempEditedAccount.info[info.key];
      }
    }
    tempEditedAccount.types = tempEditedAccount.types.filter(t => t !== type);
    setEditedAccount(tempEditedAccount);
  };

  const saveChanges = () => {
    console.log(editedAccount);
  };

  return (
    <Container maxWidth="lg" className={classes.noPadding}>
      <div className={classes.backgroundContainer}>
        <label htmlFor="backgroundPhoto">
          <input
            type="file"
            name="backgroundPhoto"
            id="backgroundPhoto"
            style={{ display: "none" }}
            onChange={onBackgroundChange}
          />
          <img src={editedAccount.background_image} className={classes.backgroundImage} />
          <div className={classes.backgroundPhotoIconContainer}>
            <AddAPhotoIcon className={`${classes.photoIcon} ${classes.backgroundPhotoIcon}`} />
          </div>
        </label>
      </div>
      <Container className={classes.infoContainer}>
        <Button
          className={`${classes.saveButton} ${classes.actionButton}`}
          color="primary"
          variant="contained"
          onClick={saveChanges}
        >
          Save Changes
        </Button>
        <Button
          className={`${classes.cancelButton} ${classes.actionButton}`}
          color="secondary"
          variant="contained"
          onClick={handleConfirmExitOpen}
        >
          Cancel
        </Button>
        <Container className={classes.avatarWithInfo}>
          <div className={classes.avatarContainer}>
            <label htmlFor="avatarPhoto">
              <input
                type="file"
                name="avatarPhoto"
                id="avatarPhoto"
                style={{ display: "none" }}
                onChange={onAvatarChange}
              />
              <Avatar
                alt={editedAccount.name}
                component="div"
                size="large"
                src={editedAccount.image}
                className={classes.avatar}
              />

              <div className={classes.avatarPhotoIconContainer}>
                <AddAPhotoIcon className={`${classes.photoIcon} ${classes.avatarPhotoIcon}`} />
              </div>
            </label>
          </div>

          <TextField
            className={classes.name}
            fullWidth
            defaultValue={editedAccount.name}
            multiline
          />
          {editedAccount.types && (
            <Container className={classes.noPadding}>
              {getAccountTypes(type, editedAccount.types).map(typeObject => (
                <Chip
                  label={typeObject.name}
                  key={typeObject.key}
                  className={classes.chip}
                  onDelete={() => handleTypeDelete(typeObject.key)}
                />
              ))}
              {getAccountTypes(type, editedAccount.types).length < getMaxAccountTypes(type) && (
                <Chip
                  label="Add Type"
                  icon={<ControlPointIcon />}
                  onClick={handleAddTypeClickOpen}
                />
              )}
            </Container>
          )}
        </Container>
        <Container className={classes.accountInfo}>
          {displayAccountInfo(editedAccount.info)}
        </Container>
      </Container>
      {children}
      <UploadImageDialog
        onClose={handleBackgroundClose}
        open={backgroundDialogOpen}
        image={tempImages.background_image}
        height={200}
        mobileHeight={80}
        mediumHeight={120}
        ratio={3}
      />
      <UploadImageDialog
        onClose={handleAvatarClose}
        open={avatarDialogOpen}
        image={tempImages.image}
        borderRadius={10000}
        height={300}
        ratio={1}
      />
      <SelectDialog
        onClose={handleAddTypeClose}
        open={addTypeDialogOpen}
        title="Add Type"
        values={getTypes().filter(type => !editedAccount.types.includes(type.key))}
        label={"Choose type"}
        supportAdditionalInfo={true}
      />
      <ConfirmDialog
        open={confirmExitOpen}
        onClose={handleConfirmExitClose}
        title="Exit"
        text="Do you really want to exit without saving?"
        cancelText="No"
        confirmText="Yes"
      />
    </Container>
  );
}
