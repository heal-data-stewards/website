import React, { useState, useEffect } from "react"
import PropTypes from "prop-types"
import Link from "next/link"
import { useRouter } from "next/router"
import Image from "next/image"
import { getButtonAppearance } from "utils/button"
import { mediaPropTypes, linkPropTypes, buttonLinkPropTypes } from "utils/types"
import { MdMenu } from "react-icons/md"
import ButtonLink from "./button-link"
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
import Button from "@material-ui/core/Button"

import { Btn, Btn2 } from "../elements/button"

const Navbar = ({ navbar, pageContext }) => {
  const [session, loading] = useSession()
  const [mobileMenuIsShown, setMobileMenuIsShown] = useState(false)
  const [navigationItems, setNavigationItems] = useState([
    {
      id: 27,
      url: "/resources",
      newTab: false,
      text: "RESOURCES",
    },
  ])

  useEffect(() => {
    if (session) {
      setNavigationItems(navbar.links)
    }
  })
  const router = useRouter()

  if (loading) return null

  return (
    <>
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
          <div className="flex flex-row items-center">
            <Link href="/">
              <a className="h-8" style={{ height: "100%", width: "17rem" }}>
                <NextImage media={navbar.logo} />
              </a>
            </Link>
            {/* List of links on desktop */}
            <ul className="hidden list-none lg:flex flex-row gap-4 items-baseline ml-10 mr-10">
              {navigationItems.map((navLink) => (
                <li key={navLink.id}>
                  <CustomLink link={navLink} locale={router.locale}>
                    <div
                      style={{ fontSize: "18px", fontWeight: "bold" }}
                      className="hover:text-magenta text-purple px-2 py-1"
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
              // <div className="hidden lg:block">
              //   <ButtonLink
              //     button={navbar.button}
              //     appearance={getButtonAppearance(navbar.button.type, "dark")}
              //     compact
              //   />
              // </div>
              <div className="hidden lg:block">
                {/* <ButtonLink
                button={navbar.button}
                appearance={getButtonAppearance(navbar.button.type, "dark")}
                compact
              /> */}

                {!session && (
                  <>
                    <Btn2 href={"/account"} button={{ text: "Log In" }} />
                  </>
                )}
                {session && (
                  <>
                    <Btn handleClick={signOut} button={{ text: "Log Out" }} />
                  </>
                )}
              </div>
            )}
            {/* Locale Switch Mobile */}
            {/* {pageContext.localizedPaths && (
              <div>
                <LocaleSwitch pageContext={pageContext} />
              </div>
            )} */}
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
        <>
          <Drawer
            anchor={"left"}
            open={mobileMenuIsShown}
            onClose={() => setMobileMenuIsShown(false)}
          >
            <List style={{ width: "230px" }}>
              <Link href="/">
                <a>
                  {/* <img
                    src={`${navbar.logo.url}`}
                    style={{ margin: "7px", width: "12rem" }}
                    alt={`${navbar.logo.alternativeText || ""}`}
                  /> */}
                  <Image
                    src={`${navbar.logo.url}`}
                    style={{ margin: "7px" }}
                    width="180"
                    height="54"
                    layout="intrinsic"
                    alt={`${navbar.logo.alternativeText || ""}`}
                  />
                </a>
              </Link>
              {navigationItems.map((navLink) => (
                <li key={navLink.id}>
                  <CustomLink link={navLink} locale={router.locale}>
                    <ListItem className="hover:text-magenta text-purple px-2 py-1">
                      <ListItemText>{navLink.text}</ListItemText>
                    </ListItem>
                  </CustomLink>
                </li>
              ))}
              <Divider />
              {/* {navbar.button && (
                <div style={{ marginTop: "15px" }}>
                  <ButtonLink
                    button={navbar.button}
                    appearance={getButtonAppearance(
                      navbar.button.type,
                      "light"
                    )}
                    compact
                  />
                </div>
              )} */}
            </List>
          </Drawer>
        </>
      )}
    </>
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
