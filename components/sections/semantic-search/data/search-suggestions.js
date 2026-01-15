const SUGGESTIONS = [
  "addiction treatment",
  "buprenorphine",
  "chronic pain",
  "cognitive behavioral therapy",
  "depression",
  "fibromyalgia",
  "GAD 7",
  "lower back pain",
  "migraine",
  "naloxone",
  "neuropathic pain",
  "osteoarthritis",
  "opioid use disorder",
  "pain management",
  "physical therapy",
]

export const getRandomSuggestions = (count) =>
  SUGGESTIONS.sort(() => 0.5 - Math.random()).slice(0, count)
