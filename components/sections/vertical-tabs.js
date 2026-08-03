import React from "react"
import Markdown from "../elements/markdown"
import Typography from "@mui/material/Typography"
import Divider from "@mui/material/Divider"
import {
  Block,
  ButtonBlockContainer,
  PanelContainer,
} from "../elements/side-tab-menu"
import { createSlug } from "../../utils/slugify"

const VerticalTabs = ({ data }) => {
  const activeTab =
    (data.activeTabSlug &&
      data.TabItem.find(
        (item) => createSlug(item.TabTitle) === data.activeTabSlug
      )) ||
    data.TabItem[0]

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
          {data.TabItem.map((item, i) => (
            <Block
              key={i + item.TabTitle}
              href={
                item.TabUrl
                  ? undefined
                  : `${data.basePath}/${createSlug(item.TabTitle)}`
              }
              url={item.TabUrl}
              title={item.TabTitle}
              index={i}
              isSelected={item.TabTitle === activeTab.TabTitle}
            />
          ))}
        </ButtonBlockContainer>
        <PanelContainer>
          <Typography
            variant="h2"
            color="primary"
            sx={{ fontWeight: "600", paddingTop: 0 }}
          >
            {activeTab.TabTitle}
          </Typography>
          <Divider sx={{ backgroundColor: "#982568", marginBottom: "1rem" }} />
          <Markdown>{activeTab.TabContent}</Markdown>
        </PanelContainer>
      </div>
    </div>
  )
}

export default VerticalTabs
