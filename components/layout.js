import { useState } from "react"
import Navbar from "./elements/navbar"
import Footer from "./elements/footer"
import NotificationBanner from "./elements/notification-banner"

const Layout = ({ children, global, pageContext, style }) => {
  const { navbar, footer, notificationBanner } = global

  const [bannerIsShown, setBannerIsShown] = useState(true)

  if (pageContext.isFullscreen) {
    return (
      <div
        className="flex flex-col justify-between min-h-[100dvh] max-h-[100dvh] overflow-hidden relative"
        style={style}
      >
        <Navbar navbar={navbar} pageContext={pageContext} />

        <div className="flex flex-1 min-h-0 overflow-y-auto">{children}</div>

        {/* Shim, this needs to match the height of the footer hover option */}
        <div className="w-full h-[32px] min-h-[32px]"></div>
        <Footer footer={footer} pageContext={pageContext} />
      </div>
    )
  }

  return (
    <div className="flex flex-col justify-between min-h-screen" style={style}>
      {/* Aligned to the top */}
      <div className="flex-1">
        {notificationBanner && bannerIsShown && (
          <NotificationBanner
            data={notificationBanner}
            closeSelf={() => setBannerIsShown(false)}
          />
        )}
        <Navbar navbar={navbar} pageContext={pageContext} />
        <div>{children}</div>
      </div>
      {/* Aligned to the bottom */}
      <Footer footer={footer} pageContext={pageContext} />
    </div>
  )
}

export default Layout
