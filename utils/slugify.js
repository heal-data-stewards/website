export const createSlug = (title) => {
  if (!title || typeof title !== "string") return ""
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
}
