import React from "react";
import { Link, useHistory } from "react-router-dom";
import "./Nav.css";
import { useDispatch, useSelector } from "react-redux";
import {
  AppBar,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Tab,
  Tabs,
} from "@mui/material";
import { Box, Container } from "@mui/system";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useState } from "react";
import GridViewSharpIcon from "@mui/icons-material/GridViewSharp";
import BorderColorSharpIcon from "@mui/icons-material/BorderColorSharp";
import TextSnippetSharpIcon from "@mui/icons-material/TextSnippetSharp";
import PersonSharpIcon from "@mui/icons-material/PersonSharp";
import NotVerifiedUser from "../../Pages/MainPage/TabComponents/NotVerified/NotVerifiedUser";
function Nav() {
  const history = useHistory();
  const dispatch = useDispatch();

  const user = useSelector((store) => store.user);
  const tabIndex = useSelector((store) => store.tabIndexReducer);

  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);

  function handleOpenNavMenu(event) {
    setAnchorElNav(event.currentTarget);
  }
  function handleOpenUserMenu(event) {
    setAnchorElUser(event.currentTarget);
  }

  function handleCloseNavMenu() {
    setAnchorElNav(null);
  }

  function handleCloseUserMenu() {
    setAnchorElUser(null);
  }

  return (
    <AppBar
      position="sticky"
      sx={{
        width: "100vw",
        backgroundColor: "rgb(241, 241, 241)",
        flexDirection: { xs: "column", md: "row" },
        alignItems: "center",
      }}
    >
      <Container
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <Link
            to="/home"
            onClick={() => dispatch({ type: "UNSET_TAB_INDEX" })}
          >
            <Link
              to="/home"
              onClick={() => dispatch({ type: "UNSET_TAB_INDEX" })}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <img
                  src="https://static.wixstatic.com/media/bf2bff_05ec89b84f6f40998006c9d59f212956~mv2.png/v1/fill/w_232,h_180,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/logo%20red.png"
                  alt="logo red.png"
                  className="logo-img"
                  style={{
                    width: "auto",
                    objectFit: "cover",
                    height: "3vh",
                  }}
                />
              </Box>
            </Link>
          </Link>
        </Box>
        <Box sx={{ flex: "1 1 auto", textAlign: "center" }}>
          <Tabs
            value={tabIndex}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              minWidth: "400px",
              "& .MuiTab-root": {
                minWidth: "unset",
                flex: 1,
              },
            }}
          >
            {user.is_admin && user.is_verified ? (
              <>
                <Tab
                  icon={
                    <GridViewSharpIcon style={{ color: "rgb(187, 41, 46)" }} />
                  }
                  onClick={() => {
                    dispatch({ type: "SET_TAB_INDEX", payload: 0 });
                    history.push("/main");
                  }}
                />
                <Tab
                  icon={
                    <PersonSharpIcon style={{ color: "rgb(187, 41, 46)" }} />
                  }
                  onClick={() => {
                    dispatch({ type: "SET_TAB_INDEX", payload: 1 });
                    history.push("/main");
                  }}
                />
                <Tab
                  icon={
                    <TextSnippetSharpIcon
                      style={{ color: "rgb(187, 41, 46)" }}
                    />
                  }
                  onClick={() => {
                    dispatch({ type: "SET_TAB_INDEX", payload: 2 });
                    history.push("/main");
                  }}
                />
              </>
            ) : user.is_verified ? (
              <>
                <Tab
                  icon={
                    <GridViewSharpIcon style={{ color: "rgb(187, 41, 46)" }} />
                  }
                  onClick={() => {
                    dispatch({ type: "SET_TAB_INDEX", payload: 0 });
                    history.push("/main");
                  }}
                />
                <Tab
                  icon={
                    <BorderColorSharpIcon
                      style={{ color: "rgb(187, 41, 46)" }}
                    />
                  }
                  onClick={() => {
                    dispatch({ type: "SET_TAB_INDEX", payload: 1 });
                    history.push("/main");
                  }}
                />
                <Tab
                  icon={
                    <TextSnippetSharpIcon
                      style={{ color: "rgb(187, 41, 46)" }}
                    />
                  }
                  onClick={() => {
                    dispatch({ type: "SET_TAB_INDEX", payload: 2 });
                    history.push("/main");
                  }}
                />
              </>
            ) : (
              ""
            )}
          </Tabs>
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <Menu
            id="menu-appbar"
            anchorEl={anchorElNav}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
            open={Boolean(anchorElNav)}
            onClose={handleCloseNavMenu}
          >
            {/* If no user is logged in, show these links */}
            {!user.id && (
              // If there's no user, show login/registration links
              <MenuItem onClick={() => history.push("/login")}>
                <Typography>Login / Register</Typography>
              </MenuItem>
            )}

            {/* If a user is logged in, show these links */}
            {user.id && (
              <>
                <MenuItem onClick={() => history.push("/main")}>
                  <Typography>Home</Typography>
                </MenuItem>

                <MenuItem onClick={() => dispatch({ type: "LOGOUT" })}>
                  <Typography>Logout</Typography>
                </MenuItem>

                <MenuItem onClick={() => history.push("/about")}>
                  <Typography>Profile</Typography>
                </MenuItem>
              </>
            )}
          </Menu>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <IconButton size="large" onClick={handleOpenNavMenu}>
              <AccountCircleIcon style={{ color: "rgb(187, 41, 46)" }} />
            </IconButton>
          </Box>
        </Box>
      </Container>
    </AppBar>
  );
}

export default Nav;
