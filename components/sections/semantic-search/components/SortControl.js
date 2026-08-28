import { ArrowDownward, ArrowUpward } from "@mui/icons-material"
import {
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Tooltip,
} from "@mui/material"

export function SortControl({ options, value, onChange }) {
  if (!options || options.length === 0) {
    return null
  }

  const selected = options.find((option) => option.key === value.key)
  // Relevance has no field to order, so the direction toggle does not apply.
  const orderable = Boolean(selected?.field)
  const ascending = value.order === "asc"

  return (
    <div className="flex items-center gap-1 mt-3">
      <FormControl fullWidth size="small">
        <InputLabel id="sort-by-label">Sort By</InputLabel>
        <Select
          labelId="sort-by-label"
          id="sort-by"
          value={value.key}
          onChange={(event) => onChange({ ...value, key: event.target.value })}
          input={<OutlinedInput label="Sort By" />}
          MenuProps={{ PaperProps: { sx: { maxWidth: 360, width: "100%" } } }}
          sx={{
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "#4d2862",
            },
          }}
        >
          {options.map((option) => (
            <MenuItem
              key={option.key}
              value={option.key}
              sx={{ whiteSpace: "normal", wordBreak: "break-word" }}
            >
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Tooltip
        title={
          orderable
            ? ascending
              ? "Sorted ascending"
              : "Sorted descending"
            : "Relevance is always sorted highest first"
        }
        placement="top"
      >
        <span className="mb-2">
          <IconButton
            size="small"
            disabled={!orderable}
            aria-label={ascending ? "Sort descending" : "Sort ascending"}
            onClick={() =>
              onChange({ ...value, order: ascending ? "desc" : "asc" })
            }
            sx={{ color: "#4d2862" }}
          >
            {ascending ? (
              <ArrowUpward fontSize="small" />
            ) : (
              <ArrowDownward fontSize="small" />
            )}
          </IconButton>
        </span>
      </Tooltip>
    </div>
  )
}
