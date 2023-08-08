import PropTypes from "prop-types"
import Markdown from "../elements/markdown"
import React, { useState, Fragment } from "react"
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Dialog from "@mui/material/Dialog"
import DialogTitle from "@mui/material/DialogTitle"
import DialogContent from "@mui/material/DialogContent"
import Typography from "@mui/material/Typography"
import Button from "@mui/material/Button"
import DialogActions from "@mui/material/DialogActions"

function BootstrapDialogTitle(props) {
  const { children, onClose, ...other } = props

  return (
    <DialogTitle
      sx={{
        m: 0,
        p: "1.5rem 1rem 1rem 2.5rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
      {...other}
    >
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  )
}

BootstrapDialogTitle.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
}

const ModalComponent = ({ data }) => {
  const [open, setOpen] = useState(true)

  const handleClose = () => {
    setOpen(false)
  }

  const handleDoNotShow = (slug) => {
    localStorage.setItem(`${slug}-do-not-show`, true)
    setOpen(false)
  }

  return (
    <Fragment>
      <Dialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <BootstrapDialogTitle
          id="customized-dialog-title"
          onClose={handleClose}
        >
          <h3 style={{ fontWeight: 600 }}>
            {data.title}
          </h3>
        </BootstrapDialogTitle>
        <DialogContent dividers sx={{ padding: "1.5rem 2.5rem 1rem" }}>
          <Markdown>{data.content}</Markdown>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleDoNotShow(data.slug)}>
            <Typography
              sx={{
                fontWeight: 600,
                letterSpacing: "0.5px",
              }}
            >
              Do Not Show Again
            </Typography>
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  )
}

const RichTextModal = ({ data }) => {
  const doNotShow = localStorage.getItem(`${data.slug}-do-not-show`)

  return <div>{!doNotShow && <ModalComponent data={data} />}</div>
}

RichTextModal.propTypes = {
  data: PropTypes.shape({
    content: PropTypes.string,
  }),
}

export default RichTextModal
