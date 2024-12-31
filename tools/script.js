// Default word list
const defaultWordList = [
  "apple",
  "banana",
  "cherry",
  "date",
  "elderberry",
  "fig",
  "grape",
  "honeydew",
  "kiwi",
  "lemon"
];

async function fetchWordList(url) {
  try {
    if (!url) {
      console.log("No URL provided. Using default word list.");
      return defaultWordList;
    }

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch word list: ${response.statusText}`);
    }
    const text = await response.text();
    return text
      .split("\n")
      .map((word) => word.trim())
      .filter((word) => word.length > 0);
  } catch (error) {
    console.error(error);
    console.log("Using default word list due to an error.");
    return defaultWordList;
  }
}

async function generatePassphraseFromURL(url, options = {}) {
  const wordList = await fetchWordList(url);

  const leetMap = {
    A: "4",
    a: "@",
    e: "3",
    i: "!",
    l: "1",
    o: "0",
    S: "$",
    s: "5",
    t: "7"
  };

  function toLeet(word) {
    return word.replace(/[AaeioSst]/g, (char) => leetMap[char]);
  }

  function randomWord() {
    const index = Math.floor(Math.random() * wordList.length);
    return wordList[index];
  }

  const words = [];
  for (let i = 0; i < options.wordCount; i++) {
    let word = randomWord();
    if (options.uppercase) {
      const random_pos = Math.round(word.length * Math.random());
      word =
        word.slice(0, random_pos) +
        word.charAt(random_pos).toUpperCase() +
        word.slice(random_pos + 1, word.length);
    }
    if (options.leet) {
      word = toLeet(word);
    }
    words.push(word);
  }

  return words.join(options.separator);
}

document.getElementById("generateBtn").addEventListener("click", async () => {
  const url = document.getElementById("wordListURL").value.trim() || null;
  const wordCount = parseInt(document.getElementById("wordCount").value);
  const separator = document.getElementById("separator").value || "-";
  const leet = document.getElementById("leet").value === "true";
  const uppercase = document.getElementById("uppercase").value === "true";

  const passphrase = await generatePassphraseFromURL(url, {
    wordCount,
    separator,
    leet,
    uppercase
  });
  document.getElementById("passphraseOutput").textContent = passphrase;
});
