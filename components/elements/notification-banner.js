import React, { useState, Fragment } from "react"
import classNames from "classnames"
import { MdClose } from "react-icons/md"
import ReactMarkdown from "react-markdown"
import CustomMarkdown from "./markdown"
import Box from "@mui/material/Box"
import ButtonBase from "@mui/material/ButtonBase"
import Modal from "@material-ui/core/Modal"

const NotificationBanner = ({
  data: { text, type, clickForModal, modalContent },
  closeSelf,
}) => {
  const [open, setOpen] = useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  return (
    <div
      className={classNames(
        // Common classes
        "text-white px-3 py-3",
        {
          // Apply theme based on notification type
          "bg-purple": type === "info",
          "bg-red": type === "warning",
          "bg-coral": type === "alert",
        }
      )}
    >
      <div className="container flex flex-row justify-between items-center ">
        {clickForModal ? (
          <Fragment>
            <Box
              component={ButtonBase}
              onClick={handleOpen}
              sx={{
                color: "white",
                letterSpacing: "0.4px",
                fontSize: "110%",
                fontWeight: "500",
              }}
              className="rich-text-banner flex-1"
            >
              <ReactMarkdown>{text}</ReactMarkdown>
            </Box>
            <Modal
              open={open}
              onClose={handleClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  maxWidth: 650,
                  bgcolor: "background.paper",
                  boxShadow: 24,
                  p: 4,
                }}
              >
                <CustomMarkdown>{modalContent}</CustomMarkdown>
              </Box>
            </Modal>
          </Fragment>
        ) : (
          <Fragment>
            <Box
              sx={{
                // color: "white",
                letterSpacing: "0.4px",
                fontSize: "110%",
                fontWeight: "500",
              }}
              className="rich-text-banner flex-1"
            >
              <ReactMarkdown>{text}</ReactMarkdown>
            </Box>
            <button onClick={closeSelf} className="px-1 py-1 flex-shrink-0">
              <MdClose className="h-6 w-auto" color="#fff" />
            </button>
          </Fragment>
        )}
      </div>
    </div>
  )
}

export default NotificationBanner
