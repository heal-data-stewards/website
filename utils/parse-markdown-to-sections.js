/**
 * parseMarkdownToSections
 * --------------------------------------------
 * Converts raw markdown into structured sections for rendering
 * using a reduce-based functional approach.
 *
 * @param {string} markdown - Raw markdown string from Strapi
 * @returns {Array} sections - Array of objects:
 *   [
 *     { type: "accordion", title: string, content: string },
 *     { type: "text", content: string }
 *   ]
 */

const parseMarkdownToSections = (markdown) => {
  const { sections, current } = markdown.split("\n").reduce(
    (acc, line) => {
      let { sections, current } = acc

      if (isHeading(line)) {
        // Push the previous section if it exists
        if (current) sections.push(finalizeSection(current))
        current = startAccordionSection(line)
      } else {
        // Start a text section if nothing exists yet
        if (!current) current = startTextSection()
        current.content.push(line)
      }

      return { sections, current }
    },
    { sections: [], current: null }
  )

  // Push the last section if exists
  return current ? [...sections, finalizeSection(current)] : sections
}

// --- Helper functions ---

/**
 * Check if a line is a Markdown H1 heading.
 * Matches strings like "# Title" or "# Title ###".
 */
const isHeading = (line) =>
  /^\s{0,3}# (.+?)(?:\s+#+)?$/.test(line)

/**
 * Create a new accordion section starting at a heading line.
 * Extracts the heading text and initializes an empty content array.
 */
const startAccordionSection = (line) => {
  const title = line.replace(/^\s{0,3}# (.+?)(?:\s+#+)?$/, "$1").trim()
  return { type: "accordion", title, content: [] }
}

/**
 * Create a new text-only section (used when no headings are found).
 */
const startTextSection = () => ({ type: "text", content: [] })

/**
 * Finalize a section by joining its content lines into a single string.
 */
const finalizeSection = (section) => ({
  ...section,
  content: section.content.join("\n").trim(),
})

export default parseMarkdownToSections