import React, { useState } from "react"
import Markdown from "../elements/markdown"
import Typography from "@mui/material/Typography"
import Divider from "@mui/material/Divider"
import {
  Block,
  ButtonBlockContainer,
  PanelContainer,
} from "../elements/side-tab-menu"
import trackTabClick from "../elements/side-tab-menu/analytics/track-tab-click"

const VerticalTabs = ({ data }) => {
  const [shownContent, setShownContent] = useState(data.TabItem[0])
  const handleTabClick = (item) => {
    trackTabClick({ title: item.TabTitle, url: item.TabUrl })
    setShownContent(item)
  }
  return (
    <div className="container pb-12">
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <ButtonBlockContainer
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "stretch",
            flex: { md: "0 0 300px", sm: "0 0 200px" },
          }}
        >
          {data.TabItem.map((item, i) => {
            return (
              <Block
                onMouseDown={() => handleTabClick(item)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    handleTabClick(item)
                  }
                }}
                key={i + item.TabTitle}
                title={item.TabTitle}
                url={item.TabUrl}
                index={i}
                isSelected={item.TabTitle === shownContent.TabTitle}
              />
            )
          })}
        </ButtonBlockContainer>
        <PanelContainer>
          <Typography
            variant="h2"
            color="primary"
            sx={{ fontWeight: "600", paddingTop: 0 }}
          >
            {shownContent.TabTitle}
          </Typography>
          <Divider sx={{ backgroundColor: "#982568", marginBottom: "1rem" }} />
          <Markdown>{shownContent.TabContent}</Markdown>
        </PanelContainer>
      </div>
    </div>
  )
}

export default VerticalTabs
