import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import ListAltIcon from '@mui/icons-material/ListAlt';
import AdbIcon from '@mui/icons-material/Adb';
import { Link, useNavigate, useLocation } from 'react-router-dom';
// import { } from 'react-router-dom';
import { CircularProgress, colors } from '@mui/material';
import { useContext } from 'react';
import { TodoContext } from '../../context/context';
import { Stack } from '@mui/material';
import axios from "../../Axios/axios"

const pages = ['Todos', 'About', 'Contact the developer'];
const settings = ['Profile', 'Account', 'Dashboard'];
const links = ['/todos', '/about', '/developer']
const settingLinks = ['/profile', '/account', '/dashboard']

import { useState } from 'react';

function Navbar() {
  const navigate = useNavigate()
  const { totalTodos, totalCompletedTodos, notifyError, notifySuccess, GetLoggedInUserDetails, setAvatarUrl, avatarUrl } = useContext(TodoContext)

  // const accessToken =  JSON.parse(localStorage.getItem("user")).accessToken ;
  // const id = JSON.parse(localStorage.getItem("user"))._id.toString();

  const [loggingOut , setLoggingOut] = useState(false)
  const [updatingAvatar , setUpdatingAvatar] = useState(false)

  const logout = async () => {

    setLoggingOut(true)
    try {
      if (localStorage.getItem("loggedIn") === "false") {
        notifyError("Please log in first!");
        return;
      }



      const config = {
        headers: {
          Authorization: JSON.parse(localStorage.getItem("user")).accessToken,
          id: JSON.parse(localStorage.getItem("user"))._id.toString()
        }
      };

      const response = await axios.get("/users/logOut", config);

      if (response.status === 200) {
        notifySuccess(response.data.message);
        localStorage.removeItem('user');
        localStorage.setItem("loggedIn", false)
        localStorage.removeItem("userAvatar")
        navigate("/");

      } else {
        notifyError("Failed to logout. Please try again later.");
      }
    } catch (error) {
      notifyError("An error occurred during logout. Please try again later.");
      console.log(error);
    } finally{
      setLoggingOut(false)
    }
  };


  // const VisuallyHiddenInput = styled('input')({
  //   clip: 'rect(0 0 0 0)',
  //   clipPath: 'inset(50%)',
  //   height: 1,
  //   overflow: 'hidden',
  //   position: 'absolute',
  //   bottom: 0,
  //   left: 0,
  //   whiteSpace: 'nowrap',
  //   width: 1,
  // });

  // var avatar;

  // const handleAvatarSelect = (e) => {
  //   avatar = e.target.files[0]

  //   if (avatar !== null || undefined) {
  //     updateAvatar()
  //   }
  // }

  // const updateAvatar = async () => {
  //   setUpdatingAvatar(true)
  //   const formData = new FormData()
  //   formData.append("avatar", avatar)

  //   const config = {
  //     headers: {
  //       Authorization: JSON.parse(localStorage.getItem("user")).accessToken,
  //       id: JSON.parse(localStorage.getItem("user"))._id.toString()
  //     }
  //   };

  //   try {
  //     const response = await axios.post("/users/updateAvatar", formData, config)

  //     if (response.status === 200) {
  //       setAvatarUrl("")
  //       localStorage.removeItem("userAvatar")
  //       GetLoggedInUserDetails()
  //       setAvatarUrl(JSON.parse(localStorage.getItem('user')).avatar.toString())
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   } finally{
  //     setUpdatingAvatar(false)
  //   }
  // }

  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const location = useLocation()

  var navColor = "red";

  const getColor = () => {
    if (location.pathname === "/signIn") {
      return "purple"
    } else if (location.pathname === "/todos")
      return "green"
      else if(location.pathname === "/profile"){
        return "orange"
      }
    else {
      return "red"
    }
  }



  return (
    <AppBar position="static" sx={{ bgcolor: getColor() }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <ListAltIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
          <Link style={{ color: "inherit", textDecoration: "none" }}>
            <Typography
              variant="h6"
              noWrap
              component="a"
              sx={{
                mr: 2,
                display: { xs: 'none', md: 'flex' },
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.3rem',
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              TaskTrek
            </Typography>
          </Link>


          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {pages.map((page, index) => (
                <Link to={links[index]} style={{ color: "inherit", textDecoration: "none" }}>
                  <MenuItem key={page} onClick={handleCloseNavMenu}>
                    <Typography textAlign="center">{page}</Typography>
                  </MenuItem>
                </Link>

              ))}
            </Menu>
          </Box>
          {/* <ListAltIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} /> */}

          <Typography
            variant="h5"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            <Link to={"/"} style={{ color: "inherit", textDecoration: "none" }}>TaskTrek</Link>
          </Typography>


          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page, index) => (

              <Link to={links[index]} style={{ textDecoration: "none" }}>
                <Button
                  key={page}
                  onClick={handleCloseNavMenu}
                  sx={{ my: 2, color: 'white', display: 'block' }}
                >
                  {page}
                </Button>
              </Link>


            ))}
          </Box>


          <Box display={{xs : "none" , sm : "block" , md : "block" , lg  :"block" , xl : "block"}}>
          <Stack direction="row" gap={4} mx={{sm : 4 , md : 4 , lg : 10 , xl : 12}}  display={!(location.pathname === '/todos' && localStorage.getItem('user')) && "none"}>
            <Typography>total todos : {totalTodos ? totalTodos : 0}</Typography>
            <Typography>completed todos : {totalCompletedTodos ? totalCompletedTodos : 0}</Typography>
          </Stack>
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                (
                  <Avatar
                    alt="Avatar"
                    src={localStorage.getItem("loggedIn") === "true" ? localStorage.getItem("userAvatar") : null}
                  />
                ) 
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
              
            >
              {settings.map((setting , index) => (
                <MenuItem key={setting} onClick={handleCloseUserMenu} disabled={localStorage.getItem("loggedIn") === 'false' || updatingAvatar ? true : false}>
                  <Link style={{ textDecoration: 'none', color: "inherit" }} to={settingLinks[index]}>
                    <Typography textAlign="center">{setting}</Typography>
                  </Link>

                </MenuItem>
              ))}

              <MenuItem>

                {/* <Button
                  component="label"
                  role={undefined}
                  variant="outlined"
                  tabIndex={-1}
                  disabled={localStorage.getItem("loggedIn") === 'false' || updatingAvatar ? true : false}
                >
                  {updatingAvatar ? <CircularProgress/> : <>update avatar</>}
                  <VisuallyHiddenInput type="file" onChange={handleAvatarSelect} />
                </Button> */}
              </MenuItem>

              <MenuItem onClick={logout}>

                <Button color="warning" variant="outlined" disabled={localStorage.getItem("loggedIn") === 'false' || updatingAvatar ? true : false} >{loggingOut ? <CircularProgress/> : <>log out</>}</Button>

              </MenuItem>

            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default Navbar;
