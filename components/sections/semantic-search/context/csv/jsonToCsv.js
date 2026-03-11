export function jsonToCsv(data) {
  if (!data || !data.length) return ""

  const headers = Object.keys(data[0])

  const escape = (value) => {
    if (value === null || value === undefined) return ""
    const str = String(value)

    // Escape quotes
    const escaped = str.replace(/"/g, '""')

    // Wrap in quotes if needed
    if (/[",\n]/.test(escaped)) {
      return `"${escaped}"`
    }

    return escaped
  }

  const headerRow = headers.join(",")

  const rows = data.map((obj) =>
    headers.map((header) => escape(obj[header])).join(",")
  )

  return [headerRow, ...rows].join("\n")
}
