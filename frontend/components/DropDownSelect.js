import { useState, useEffect, useRef, } from "react";
import * as React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faCircleCheck, faCircleMinus, faCircleXmark} from '@fortawesome/free-solid-svg-icons'

import { makeStyles } from "@material-ui/core/styles";
import { MenuItem, InputBase, Menu, Divider } from "@material-ui/core";
import CheckIcon from "@material-ui/icons/Check";
import { Button } from "reactstrap";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import SearchIcon from "@mui/icons-material/Search";


const useStyles = makeStyles((theme) => ({
  DropDownButton: {
    margin: "50px 50px",
    fontSize: "1.125rem",
    width: "320px",
    height: "60px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    border: "2px solid #007bff",
    borderRadius: "10px",
    backgroundColor: "white",
    cursor: "pointer",
    padding: "0px 20px"
  },
  inputRoot: {
    color: "inherit",
    width: "100%"
  },
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    marginRight: "20px",
    marginLeft: 0,
    width: "100%",
    border: "1px solid grey"
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create("width"),
    width: "100%"
  },
  searchBarContainer: {
    minWidth: "inherit",
    display: "flex",
    justifyContent: "space-evenly",
    cursor: "default",
    "&.MuiListItem-button": {
      "&:hover": {
        backgroundColor: "white"
      }
    }
  },
  menuDivider: {
    margin: "0 20px"
  },
  dashboardSelectMenu: {
    "& .MuiPopover-paper": {
      minWidth: "380px",
      maxWidth: "fit-content"
    }
  },
  externalLinkIcon: {
    borderLeft: "1px solid var(--color-gray-eighty-five)",
    padding: "10px 0px 10px 10px",
    color: "var(--color-primary)",
    cursor: "pointer"
  },
  checkedItem: {
    color: "indigo"
  }
}));

export default function DropDownSelect({options, onSelect, label}) {

  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [selection, setSelection] = useState("");

  useEffect(() => {
    setSelection(options[0].label);
  }, []);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (e) => {
    if (e.target.innerText !== selection && e.target.innerText !== "") {
      setSelection(e.target.innerText);
      onSelect(e.target.innerText);
    }
    setSearchText("");
    setAnchorEl(null);
  };

  const handleSearchChange = (e) => {
    setSearchText(e.target.value);
  };

  
  return (
    <div style={{width: "20%", marginRight: "5%"}}>
    {label} :
    <Button
        type="button"
        onClick={handleMenuOpen}
        style={{width: "100%", background: "linear-gradient(to right, #9198e5,#39C2EF)", display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center"}}
    >
        <div style={{flex: "90%", display: "grid", placeItems: "left"}}>{selection}</div>
        <div style={{flex: "10%"}}><KeyboardArrowDownIcon /></div>
    </Button>
    {renderDashboardMenu()}
    </div>
  )
  function renderDashboardMenu() {
    const displayOptions = options
      .map((item) => {
        if (item.label.toLowerCase().includes(searchText.toLowerCase())) {
          return item;
        }
        return undefined;
      })
      .filter((item) => item !== undefined);

    function renderOption(value) {
      if (selection === value.label) {
        return (
          <div className="row21" style={{width: "100%"}}>
            <CheckIcon />{" "}
            <div id='icon2' >{value.icon}</div>{" "}
            <div id='name'>{value.label}</div>{" "}
            {'status' in value ? <div id='age' >{value.status == "working"? <FontAwesomeIcon icon={faCircleCheck} style={{color: "#4ee458",}} />
                            :value.status == "malfunction"? <FontAwesomeIcon icon={faCircleMinus} style={{color: "#dbbe00",}} />
                            :<FontAwesomeIcon icon={faCircleXmark} style={{color: "#ff2424",}} />}</div>
                        : null}
          </div>
        );
      }
      return (
        <div className="row21" style={{width: "100%"}}>
            <div id='icon2' >{value.icon}</div>{" "}
            <div id='name'>{value.label}</div>{" "}
            {'status' in value ? <div id='age' >{value.status == "working"? <FontAwesomeIcon icon={faCircleCheck} style={{color: "#4ee458",}} />
                            :value.status == "malfunction"? <FontAwesomeIcon icon={faCircleMinus} style={{color: "#dbbe00",}} />
                            :<FontAwesomeIcon icon={faCircleXmark} style={{color: "#ff2424",}} />}</div>
                        : null}
          </div>
      );
    }

    return (
      <Menu
        anchorEl={anchorEl}
        keepMounted={true}
        open={!!anchorEl}
        onClose={handleClose}
        className={classes.dashboardSelectMenu}
        style={{width: "100%", marginTop: "3%"}}
      >
        <MenuItem
          className={classes.searchBarContainer}
          disableTouchRipple={true}
          style={{width: "100%"}}
        >
          <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <InputBase
              placeholder="Search Sensor"
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput
              }}
              onChange={handleSearchChange}
              value={searchText}
            />
          </div>
        </MenuItem>
        <Divider />
        {displayOptions.map((item, index) => {
          return (
            <div key={index} >
              <MenuItem onClick={(e) => handleClose(e)} style={{width: "100%"}}>
                {renderOption(item)}
              </MenuItem>
              <Divider className={classes.menuDivider} style={{border: "1px solid #39C2EF"}}/>
            </div>
          );
        })}
      </Menu>
    );
  }
}

