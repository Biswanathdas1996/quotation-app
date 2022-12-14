import React from "react";

import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import MoreIcon from "@mui/icons-material/MoreVert";
import { Button } from "@mui/material";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import ColorLensIcon from "@mui/icons-material/ColorLens";
import GridViewIcon from "@mui/icons-material/GridView";
import Link from "@material-ui/core/Link";
import { useNavigate } from "react-router-dom";
import PwcLogo from "../../assets/images/nft.png";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { _fetch, _account } from "../../CONTRACT-ABI/connect";

const pageList = [
  {
    label: "Home",
    href: "/",
  },
  // {
  //   label: "My profile",
  //   href: vendors ? "/vendor" : "/profile",
  // },
  {
    label: "How it works",
    href: "/HowItWorks",
  },
];
const Header = ({ icon, symbol }) => {
  // const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [vendors, setVendors] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
  const [pages, setPages] = React.useState(pageList);

  let history = useNavigate();

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const getAllVendor = async () => {
    const vendors = await _fetch("getAllVendor");
    const account = await _account();
    console.log("------>vvv", vendors);
    if (
      vendors.find(
        (data) => data?.walletAddress?.toString() === account?.toString()
      )
    ) {
      setPages([
        ...pageList,
        {
          label: "Vendor profile",
          href: "/vendor",
        },
      ]);
    } else {
      setPages([
        ...pageList,
        {
          label: "User profile",
          href: "/profile",
        },
      ]);
    }
  };

  React.useEffect(() => {
    getAllVendor();
  }, []);

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = (category = "") => {
    setAnchorEl(null);
    handleMobileMenuClose();
    if (category !== "all") {
      history(`/category/${category.toLowerCase()}`);
    } else {
      history("/");
    }
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem
        onClick={() => {
          handleMenuClose("all");
        }}
      >
        <GridViewIcon sx={{ marginRight: "10px" }} />
        All
      </MenuItem>
      <MenuItem
        onClick={() => {
          handleMenuClose("art");
        }}
      >
        <ColorLensIcon sx={{ marginRight: "10px" }} />
        Arts
      </MenuItem>
      <MenuItem
        onClick={() => {
          handleMenuClose("music");
        }}
      >
        <MusicNoteIcon sx={{ marginRight: "10px" }} />
        Music
      </MenuItem>
      <MenuItem
        onClick={() => {
          handleMenuClose("sports");
        }}
      >
        <SportsSoccerIcon sx={{ marginRight: "10px" }} />
        Sports
      </MenuItem>
    </Menu>
  );
  //  MENU itemssss
  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem>
        <Link to="/profile">My Profile</Link>
      </MenuItem>
      <MenuItem disabled>
        <Link href="/mentors">Activity</Link>
      </MenuItem>
      <MenuItem disabled>
        <Link href="/">How It Works</Link>
      </MenuItem>
      <MenuItem>
        <p>Sign In</p>
      </MenuItem>
    </Menu>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="static"
        sx={{
          padding: "15px",
          backgroundColor: "white",
        }}
        //   color="red"
      >
        <Toolbar>
          <img
            src={PwcLogo}
            height={"60px"}
            width={"60px"}
            alt="logo"
            onClick={() => history("/")}
          />

          {/* Explore menu list========================================= */}

          {/* // Menu items-------------------------------------------- */}
          <Box
            sx={{
              flexGrow: 1,
              display: { xs: "none", md: "flex" },
              marginLeft: "10px",
            }}
          >
            {pages.map(({ label, href }) => (
              <Button
                type="button"
                key={label}
                onClick={() => history(href)}
                sx={{
                  my: 2,
                  color: "black",
                  fontWeight: "bold",
                  display: "block",
                  textTransform: "none",
                }}
              >
                {label}
              </Button>
            ))}
          </Box>

          <Box sx={{ flexGrow: 1 }} />

          <Box sx={{ display: { xs: "none", md: "flex" } }}>
            <Stack direction="row" spacing={1} style={{ margin: 10 }}>
              <img
                width="20px"
                height="20px"
                src={icon}
                style={{ marginTop: "4px" }}
                alt="nft"
              />
              <Typography
                sx={{ fontWeight: "bold", fontSize: "18px", color: "black" }}
              >
                {symbol}
              </Typography>
            </Stack>
          </Box>

          <Box sx={{ display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
              sx={{ color: "black" }}
            >
              <MoreIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
    </Box>
  );
};

export default Header;
