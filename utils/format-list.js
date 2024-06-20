// cat, bat, bee => "cat, bat and bee"
// cat, bat => "cat and bat"
// cat => "cat"
export const formatList = (words) =>
  words?.reduce((sentence, word, index) => {
    if (index === words.length - 2) return sentence + `${word} and `
    if (index === words.length - 1) return sentence + word
    return sentence + `${word}, `
  }, "") ?? ""
