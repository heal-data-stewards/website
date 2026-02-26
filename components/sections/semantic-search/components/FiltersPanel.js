import {
  Checkbox,
  Chip,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
} from "@mui/material"

export function FiltersPanel({ filterConfigs, filterValues, onFilterChange }) {
  if (!filterConfigs || filterConfigs.length === 0) {
    return null
  }

  return (
    <div className="flex flex-col gap-3 mt-3">
      {filterConfigs.map((config) => {
        if (config.type === "checkbox") {
          return (
            <CheckboxFilter
              key={config.key}
              config={config}
              value={filterValues[config.key]}
              onChange={(newValue) => onFilterChange(config.key, newValue)}
            />
          )
        }

        if (config.type === "select") {
          return (
            <SelectFilter
              key={config.key}
              config={config}
              value={filterValues[config.key] || ""}
              onChange={(newValue) => onFilterChange(config.key, newValue)}
            />
          )
        }

        if (config.type === "multiselect") {
          return (
            <MultiSelectFilter
              key={config.key}
              config={config}
              value={filterValues[config.key] || []}
              onChange={(newValue) => onFilterChange(config.key, newValue)}
            />
          )
        }

        return null
      })}
    </div>
  )
}

function CheckboxFilter({ config, value, onChange }) {
  return (
    <FormControlLabel
      sx={{ "& .MuiTypography-root": { margin: 0 } }}
      control={
        <Checkbox
          checked={value || false}
          onChange={(e) => onChange(e.target.checked)}
          sx={{
            color: "#4d2862",
            "&.Mui-checked": {
              color: "#4d2862",
            },
          }}
        />
      }
      label={config.label}
    />
  )
}

function SelectFilter({ config, value, onChange }) {
  const handleChange = (event) => {
    onChange(event.target.value)
  }

  return (
    <FormControl fullWidth size="small">
      <InputLabel id={`${config.key}-label`}>{config.label}</InputLabel>
      <Select
        labelId={`${config.key}-label`}
        id={config.key}
        value={value}
        onChange={handleChange}
        input={<OutlinedInput label={config.label} />}
        MenuProps={{ PaperProps: { sx: { maxWidth: 360, width: "100%" } } }}
        sx={{
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#4d2862",
          },
        }}
      >
        <MenuItem value="">
          <em>All</em>
        </MenuItem>
        {config.options.map((option) => (
          <MenuItem
            key={option.value}
            value={option.value}
            sx={{ whiteSpace: "normal", wordBreak: "break-word" }}
          >
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}

function MultiSelectFilter({ config, value, onChange }) {
  const handleChange = (event) => {
    const {
      target: { value: newValue },
    } = event
    onChange(typeof newValue === "string" ? newValue.split(",") : newValue)
  }

  const getOptionValue = (option) =>
    typeof option === "string" ? option : option.value
  const getOptionLabel = (option) =>
    typeof option === "string" ? option : option.label

  return (
    <FormControl fullWidth size="small">
      <InputLabel id={`${config.key}-label`}>{config.label}</InputLabel>
      <Select
        labelId={`${config.key}-label`}
        id={config.key}
        multiple
        value={value}
        onChange={handleChange}
        input={<OutlinedInput label={config.label} />}
        renderValue={(selected) => (
          <div className="flex flex-wrap gap-1">
            {selected.map((val) => (
              <Chip
                key={val}
                label={val}
                size="small"
                sx={{
                  backgroundColor: "rgba(77, 40, 98, 0.1)",
                  color: "#4d2862",
                }}
              />
            ))}
          </div>
        )}
        MenuProps={{ PaperProps: { sx: { maxWidth: 360, width: "100%" } } }}
        sx={{
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#4d2862",
          },
        }}
      >
        {config.options.map((option) => (
          <MenuItem
            key={getOptionValue(option)}
            value={getOptionValue(option)}
            sx={{ whiteSpace: "normal", wordBreak: "break-word" }}
          >
            <Checkbox
              checked={value.indexOf(getOptionValue(option)) > -1}
              sx={{
                color: "#4d2862",
                "&.Mui-checked": {
                  color: "#4d2862",
                },
              }}
            />
            {getOptionLabel(option)}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}
