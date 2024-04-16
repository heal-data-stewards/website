import React, { useState, Fragment } from "react"
import { connectAutoComplete } from "react-instantsearch-dom"
import Markdown from "../elements/markdown"
import Typography from "@mui/material/Typography"
import Divider from "@mui/material/Divider"
import { CustomUnorderedList } from "../elements/lists/unordered-list"
import { CustomListItem } from "../elements/lists/list-item"
import {
  Block,
  ButtonBlockContainer,
  PanelContainer,
} from '../elements/side-tab-buttons'



const SensitiveData = ({ data }) => {
  const [shownContent, setShownContent] = useState(data.sensitiveDataItem[0])

  function onHover(item) {
    setShownContent(item)
  }

  console.log(data)
  return (
    <div className="container pb-12">
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div style={{ width: "50%", maxWidth: "350px", marginRight: "20px" }}>
          {data.sensitiveDataItem.map((item, i) => {
            return (
              <Block
                onMouseEnter={(e) => onHover(item)}
                key={i + item.title}
                title={item.title}
              />
            )
          })}
        </div>
        <div style={{ width: "-webkit-fill-available" }}>
          <Typography variant="h2" color="primary" sx={{ fontWeight: "600" }}>
            {shownContent.title}
          </Typography>
          <Markdown>{shownContent.body}</Markdown>
          <br />
          <div>
            <Typography variant="h3">Resources</Typography>
            <Divider />
            {shownContent.sensitiveDataResources.length > 0 && (
              <CustomUnorderedList>
                {shownContent.sensitiveDataResources.map((resource, i) => {
                  return (
                    <CustomListItem key={resource.link + i}>
                      <Markdown>{resource.link}</Markdown>
                    </CustomListItem>
                  )
                })}
              </CustomUnorderedList>
            )}
          </div>
          <div>
            {shownContent.healSpecificResourses.length > 0 && (
              <Fragment>
                <Typography variant="h3">HEAL-specific Resources</Typography>
                <Divider />
                <CustomUnorderedList>
                  {shownContent.healSpecificResourses.map((resource, i) => {
                    return (
                      <CustomListItem key={resource.link + i}>
                        <Markdown>{resource.link}</Markdown>
                      </CustomListItem>
                    )
                  })}
                </CustomUnorderedList>
              </Fragment>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SensitiveData
