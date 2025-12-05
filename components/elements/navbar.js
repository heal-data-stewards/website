// TODO: refactor to store nav items in an array and map through them

import React, { useState, useEffect } from "react"
import PropTypes from "prop-types"
import Link from "next/link"
import { useRouter } from "next/router"
import Image from "next/image"
import { mediaPropTypes, linkPropTypes, buttonLinkPropTypes } from "utils/types"
import { MdMenu } from "react-icons/md"
import NextImage from "./image"
import CustomLink from "./custom-link"
import AppBar from "@material-ui/core/AppBar"
import Toolbar from "@material-ui/core/Toolbar"
import Drawer from "@material-ui/core/Drawer"
import List from "@material-ui/core/List"
import ListItem from "@material-ui/core/ListItem"
import ListItemText from "@material-ui/core/ListItemText"
import Divider from "@material-ui/core/Divider"
import { signIn, signOut, useSession, getSession } from "next-auth/client"
import { Btn2 } from "../elements/button"
import AccountMenu from "./account-menu"
import PopupState, { bindTrigger, bindMenu } from "material-ui-popup-state"
import Menu from "@mui/material/Menu"
import MenuItem from "@mui/material/MenuItem"
import { styled, alpha } from "@mui/material/styles"
import { ExpandMore } from "@mui/icons-material"
import { Collapse } from "@mui/material"
import classNames from "classnames"
import { sendCustomEvent } from "utils/analytics"

const StyledMenu = styled((props) => <Menu elevation={0} {...props} />)(
  ({ theme }) => ({
    "& .MuiPaper-root": {
      borderRadius: 0,
      minWidth: 180,
      background: "#532565",
      color: "#fff",
      boxShadow:
        "rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
      "& .MuiMenu-list": {
        "&:hover": {
          // background: "#982568",
        },
        padding: "15px 15px 15px 8px",
      },
      "& .MuiMenuItem-root": {
        borderBottom: "1px solid #532565",
        display: "block",
        "& .MuiSvgIcon-root": {
          color: theme.palette.text.secondary,
          marginRight: theme.spacing(1.5),
        },
        "&:hover": {
          borderBottom: "1px solid #fff",
        },
      },
    },
  })
)

const MenuPopupState = (data) => {
  return (
    <PopupState variant="popover" popupId="demo-popup-menu">
      {(popupState) => (
        <React.Fragment>
          <button>
            <div
              style={{ fontSize: "18px", fontWeight: "bold" }}
              className="hover:text-magenta text-purple px-2 py-1"
              {...bindTrigger(popupState)}
            >
              ABOUT
            </div>
          </button>
          <StyledMenu {...bindMenu(popupState)}>
            <MenuItem
              onClick={() => {
                popupState.close()
                sendCustomEvent("nav_bar_click", {
                  nav_link_title: "HEAL Data Ecosystem",
                  nav_link_url: "/about",
                  nav_menu_type: "desktop",
                })
              }}
            >
              <Link href="/[[...slug]]" as={"/about"}>
                <a style={{ fontSize: "14px", fontWeight: "bold" }}>
                  HEAL DATA ECOSYSTEM
                </a>
              </Link>
            </MenuItem>
            <MenuItem
              onClick={() => {
                popupState.close()
                sendCustomEvent("nav_bar_click", {
                  nav_link_title: "Collective Board",
                  nav_link_url: "/collective",
                  nav_menu_type: "desktop",
                })
              }}
            >
              <Link href="/[[...slug]]" as={"/collective"}>
                <a style={{ fontSize: "14px", fontWeight: "bold" }}>
                  COLLECTIVE BOARD
                </a>
              </Link>
            </MenuItem>
          </StyledMenu>
        </React.Fragment>
      )}
    </PopupState>
  )
}

const Navbar = ({ navbar, pageContext }) => {
  const [session, loading] = useSession()
  const [mobileMenuIsShown, setMobileMenuIsShown] = useState(false)
  const [isMobileAboutMenuOpen, setIsMobileAboutMenuOpen] = useState(false)
  const [loggedIn, setLoggedIn] = useState(false)
  const router = useRouter()

  return (
    <div>
      <AppBar
        position="sticky"
        style={{
          background: "#fff",
          height: "100px",
          color: "#373a3c",
        }}
      >
        <Toolbar
          className="container flex flex-row items-center justify-between"
          style={{ height: "100%" }}
        >
          {/* Content aligned to the left */}
          <div className="flex flex-row items-center justify-between w-full">
            <Link href="/">
              <a className="h-8" style={{ height: "100%", width: "17rem" }}>
                <NextImage media={navbar.logo} />
              </a>
            </Link>
            {/* List of links on desktop */}
            <ul className="hidden list-none lg:flex flex-row gap-1 items-baseline ml-10 mr-10">
              <li>
                <MenuPopupState />
              </li>
              {navbar.links.map((navLink) => (
                <li key={navLink.id}>
                  <CustomLink
                    link={navLink}
                    locale={router.locale}
                    onClick={() =>
                      sendCustomEvent("nav_bar_click", {
                        nav_link_title: navLink.text,
                        nav_link_url: navLink.url,
                        nav_menu_type: "desktop",
                      })
                    }
                  >
                    <div
                      style={{
                        fontSize: "18px",
                        fontWeight: "bold",
                        textTransform: "uppercase",
                      }}
                      className="hover:text-magenta text-purple px-2 py-1 whitespace-nowrap overflow-hidden overflow-ellipsis"
                    >
                      {navLink.text}
                    </div>
                  </CustomLink>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex">
            {/* CTA button on desktop */}
            {navbar.button && (
              <div className="hidden lg:block">
                {!session && (
                  <>
                    <Btn2 href={"/account"} button={{ text: "Log In" }} />
                  </>
                )}
                {session && (
                  <div>
                    <AccountMenu
                      handleLogOut={handleLogOut}
                      setLoggedIn={setLoggedIn}
                    />
                  </div>
                )}
              </div>
            )}
            {/* Hamburger menu on mobile */}
            <button
              onClick={() => setMobileMenuIsShown(true)}
              className="p-1 block lg:hidden"
            >
              <MdMenu className="h-8 w-auto" />
            </button>
          </div>
        </Toolbar>
      </AppBar>

      {/* Mobile navigation menu panel */}
      {mobileMenuIsShown && (
        <Drawer
          anchor={"left"}
          open={mobileMenuIsShown}
          onClose={() => setMobileMenuIsShown(false)}
        >
          <List style={{ width: "275px" }}>
            <div style={{ margin: "10px" }}>
              <Link href="/">
                <a>
                  <Image
                    src={`${navbar.logo.url}`}
                    style={{ margin: "7px" }}
                    width="180"
                    height="54"
                    priority={true}
                    layout="intrinsic"
                    alt={`${navbar.logo.alternativeText || ""}`}
                  />
                </a>
              </Link>
            </div>
            <ListItem className="hover:text-white hover:bg-magenta text-purple px-2 py-1">
              <div className="w-full">
                <button
                  onClick={() => {
                    setIsMobileAboutMenuOpen((p) => !p)
                  }}
                  className="w-full flex justify-between items-center "
                >
                  <ListItemText style={{ textAlign: "left" }}>
                    <span style={{ fontWeight: "bold" }}>ABOUT</span>
                  </ListItemText>

                  <span
                    className={classNames(
                      "transition-transform",
                      "duration-300",
                      { "rotate-180": isMobileAboutMenuOpen }
                    )}
                  >
                    <ExpandMore />
                  </span>
                </button>

                <Collapse in={isMobileAboutMenuOpen}>
                  <List>
                    <ListItem style={{ fontWeight: "bold" }}>
                      <CustomLink
                        link={{
                          url: "/about",
                          id: "about",
                          newTab: false,
                          text: "HEAL DATA ECOSYSTEM",
                        }}
                        locale={router.locale}
                        onClick={() =>
                          sendCustomEvent("nav_bar_click", {
                            nav_link_title: "HEAL Data Ecosystem",
                            nav_link_url: "/about",
                            nav_menu_type: "mobile",
                          })
                        }
                      >
                        HEAL DATA ECOSYSTEM
                      </CustomLink>
                    </ListItem>
                    <ListItem style={{ fontWeight: "bold" }}>
                      <CustomLink
                        link={{ url: "/collective" }}
                        locale={router.locale}
                        onClick={() =>
                          sendCustomEvent("nav_bar_click", {
                            nav_link_title: "Collective Board",
                            nav_link_url: "/collective",
                            nav_menu_type: "mobile",
                          })
                        }
                      >
                        COLLECTIVE BOARD
                      </CustomLink>
                    </ListItem>
                  </List>
                </Collapse>
              </div>
            </ListItem>
            {navbar.links.map((navLink) => (
              <ListItem
                key={navLink.id}
                className="hover:text-white hover:bg-magenta text-purple px-2 py-1"
              >
                <CustomLink
                  link={navLink}
                  locale={router.locale}
                  onClick={() =>
                    sendCustomEvent("nav_bar_click", {
                      nav_link_title: navLink.text,
                      nav_link_url: navLink.url,
                      nav_menu_type: "mobile",
                    })
                  }
                >
                  <ListItemText>
                    <span
                      style={{ fontWeight: "bold", textTransform: "uppercase" }}
                    >
                      {navLink.text}
                    </span>
                  </ListItemText>
                </CustomLink>
              </ListItem>
            ))}
            <Divider />
            <div className="flex">
              {navbar.button && (
                <div className="lg:block mt-4 ml-4">
                  {!session && (
                    <>
                      <Btn2 href={"/account"} button={{ text: "Log In" }} />
                    </>
                  )}
                  {session && (
                    <>
                      <AccountMenu
                        handleLogOut={handleLogOut}
                        setLoggedIn={setLoggedIn}
                      />
                    </>
                  )}
                </div>
              )}
            </div>
          </List>
        </Drawer>
      )}
    </div>
  )
}

Navbar.propTypes = {
  navbar: PropTypes.shape({
    logo: PropTypes.shape({
      image: mediaPropTypes,
      url: PropTypes.string,
    }),
    links: PropTypes.arrayOf(linkPropTypes),
    button: buttonLinkPropTypes,
  }),
  initialLocale: PropTypes.string,
}

export default Navbar
