function rearrangeSentenceRecursive(charLimit, sentence) {
  if (sentence.length === 0) {
    return "";
  }

  const words = sentence.split(" ");

  let maxWords = 0;
  let bestSentence = "";

  function findBestCombination(currentWords, currentSentence) {
    if (currentSentence.length > charLimit || currentWords >= words.length) {
      return;
    }

    if (currentWords > maxWords) {
      maxWords = currentWords;
      bestSubsentence = currentSentence;
    }

    for (let i = currentWords + 1; i <= words.length; i++) {
      findBestCombination(i, currentSentence + " " + words[i - 1]);
    }
  }

  findBestCombination(0, "");

  return bestSentence.trim();
}
