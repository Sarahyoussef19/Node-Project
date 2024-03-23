function rearrangeSentenceNonRecursive(charLimit, sentence) {
  const words = sentence.split(" ");
  let currentSentence = "";
  let currentWords = 0;

  for (const word of words) {
    if (currentSentence.length + word.length <= charLimit) {
      currentSentence += (currentSentence.length > 0 ? " " : "") + word;
      currentWords++;
    }
  }

  return currentSentence;
}
