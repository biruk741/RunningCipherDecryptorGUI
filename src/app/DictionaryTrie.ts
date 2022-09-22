interface JointType {
  foundFullWord: boolean
  longestLength: number
}

/**
 * This data structure is used to store words in a tree like structure.
 */
export class Trie {
  map: { [key: string]: Trie } = {};
  isWord: boolean = false;

  constructor() {
  }

  public insert(word: string): void {
    this.add(word, 0, this)
  }

  public search(word: string): boolean {
    return this.find(word, 0, this)
  }

  private add(word: string, index: number, letterMap: Trie): void {
    if (index == word.length) {
      letterMap.isWord = true
      return;
    }
    if (!letterMap.map[word.charAt(index)]) {
      letterMap.map[word.charAt(index)] = new Trie()
    }
    return this.add(word, index + 1, letterMap.map[word.charAt(index)])
  }

  private find(word: string, index: number, letterMap: Trie): boolean {
    if (index == word.length) {
      return letterMap.isWord;
    }
    if (letterMap.map[word[index]]) {
      return this.find(word, index + 1, letterMap.map[word.charAt(index)])
    }
    return false
  }

  private findWithLength(word: string, index: number, letterMap: Trie): JointType {
    if (index == word.length) {
      return {foundFullWord: letterMap.isWord, longestLength: index};
    }
    if (letterMap.map[word[index]]) {
      return this.findWithLength(word, index + 1, letterMap.map[word.charAt(index)])
    }
    return {foundFullWord: false, longestLength: index}
  }

  public calculateScore(fullWord: string) {
    let index = 0;
    let score = 1;
    let rounds = 0;
    while (index < fullWord.length && rounds < 20) {
      const {
        longestLength,
        foundFullWord
      } = this.findWithLength(fullWord.substring(index, fullWord.length), 0, this)

      // if a full word is found and the length was greater than 3, set the multiplier to 10,
      // if a word was found but the length was not greater than 3, set the multiplier to 3
      // otherwise set it to 1
      let multiplier = foundFullWord && longestLength > 3 ? 10 : foundFullWord ? 3 : 1;

      score *= longestLength * multiplier;

      index++;
      rounds++;
    }
    return score;
  }
}
