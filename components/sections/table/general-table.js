import React from "react"
import { Box, Typography } from "@mui/material"
import { DataGrid } from "@mui/x-data-grid"
import RenderExpandableCell from "./render-expandable-cell"
import Markdown from "../../elements/markdown"
import { sendCustomEvent } from "utils/analytics"

const getRepoName = (markdown) =>
  markdown?.replace(/\[([^\]]+)\]\([^)]+\)/, "$1") ?? markdown

const columns = [
  { field: "id", headerName: "ID", width: 10 },
  {
    field: "Repository",
    headerName: "Repository",
    headerClassName: "general-table-header",
    sortable: false,
    filterable: false,
    width: 350,
    renderCell: ({ row }) => (
      <Box
        sx={{
          whiteSpace: "normal",
          wordWrap: "break-word",
          overflow: "visible",
        }}
        onClick={(e) => {
          const anchor = e.target.closest("a")
          if (!anchor) return
          sendCustomEvent("repo_selection_guide_interaction", {
            interaction_type: "link_click",
            column: "repository",
            repository_name: getRepoName(row.Repository),
            link_text: anchor.innerText,
            link_url: anchor.href,
          })
        }}
      >
        <Markdown linkTarget="_blank" className="general-table">
          {row.Repository}
        </Markdown>
      </Box>
    ),
  },
  {
    field: "Descriptive Tags",
    headerName: "Descriptive Tags",
    headerClassName: "general-table-header",
    width: 275,
    sortable: false,
    cellClass: "overflow",
    renderCell: ({ row }) => (
      <RenderExpandableCell linkTarget="_blank" className="general-table">
        {row["Descriptive Tags"]}
      </RenderExpandableCell>
    ),
  },
  {
    field: "Organism",
    headerName: "Organism",
    headerClassName: "general-table-header",
    width: 118,
    sortable: false,
    renderCell: ({ row }) => (
      <RenderExpandableCell linkTarget="_blank" className="general-table">
        {row["Organism"]}
      </RenderExpandableCell>
    ),
  },
  {
    field: "IC/Program",
    headerName: "IC/Program",
    headerClassName: "general-table-header",
    width: 160,
    sortable: false,
    renderCell: ({ row }) => (
      <RenderExpandableCell linkTarget="_blank" className="general-table">
        {row["IC/Program"]}
        {row[`IC/Program Footnote`] && <sup>{row[`IC/Program Footnote`]}</sup>}
      </RenderExpandableCell>
    ),
  },
  {
    field: "Links",
    headerName: "Links",
    headerClassName: "general-table-header",
    width: 260,
    sortable: true,
    renderCell: ({ row }) => (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          flexWrap: "wrap",
          whiteSpace: "nowrap",
          overflow: "visible",
          "& .MuiTypography-body1": {
            display: "inline",
            margin: 0,
            whiteSpace: "normal",
            fontSize: "0.95rem !important",
          },
        }}
        onClick={(e) => {
          const anchor = e.target.closest("a")
          if (!anchor) return
          sendCustomEvent("repo_selection_guide_interaction", {
            interaction_type: "link_click",
            column: "links",
            repository_name: getRepoName(row.Repository),
            link_text: anchor.innerText,
            link_url: anchor.href,
          })
        }}
      >
        <Markdown linkTarget="_blank">{row["Get Started Here"]}</Markdown>
        {row[`Get Started Here Footnote`] && (
          <sup>{row[`Get Started Here Footnote`]}</sup>
        )}
        {row["Overview"] && (
          <>
            <Typography variant="body1">&nbsp;|&nbsp;</Typography>
            <Markdown linkTarget="_blank">{row["Overview"]}</Markdown>
          </>
        )}
      </Box>
    ),
  },
]

const columnFieldOrder = [
  "Repository",
  "Descriptive Tags",
  "Organism",
  "IC/Program",
  "Get Started Here",
  "Overview",
]

function createData(id, columnsArray) {
  const row = { id }

  columnsArray.forEach((column, index) => {
    const fieldName = columnFieldOrder[index]
    if (fieldName) {
      row[fieldName] = column.column_data
      if (column.footnote) {
        row[`${fieldName} Footnote`] = column.footnote
      }
    }
  })

  return row
}

export default function GeneralDataTable({ data }) {
  const rows = data.row.map((row) => createData(row.id, row.columns))

  return (
    <Box className="container" sx={{ height: 600 }}>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          columns: { columnVisibilityModel: { id: false } },
        }}
        onSortModelChange={(sortModel) => {
          if (!sortModel.length) return
          sendCustomEvent("repo_selection_guide_interaction", {
            interaction_type: "sort",
            column: sortModel[0]?.field,
            sort_direction: sortModel[0]?.sort,
          })
        }}
      />
    </Box>
  )
}
