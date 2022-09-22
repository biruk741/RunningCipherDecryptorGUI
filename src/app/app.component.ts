import {Component, HostListener} from '@angular/core';
import {MatSliderChange} from "@angular/material/slider";
import {DictionaryService} from "./dictionary.service";
import {saveAs} from "file-saver";

/**
 * This enum contains values that represent key presses for the left arrow and right arrow key
 * on the keyboard.
 */
export enum KEY_CODE {
  RIGHT_ARROW = 39,
  LEFT_ARROW = 37
}

/**
 * This interface represents the structure for how data is saved in storage. It includes the position in the cipher text
 * where a word/phrase is stored, the plaintext and the key used to decrypt it.
 */
interface StorageType {
  position: number,
  text: string,
  key: string
}

/**
 * This constant represents the key that represents where the data is stored since localStorage
 * is key -> value paired.
 */
const localStorageKey = 'savedKeys'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  text: string = 'prnrwueozfniocfeqnlebvsamwwsiuccqvgxhmisqfhagnqfhvzzogpwfyvtvtuotqksprudkyhnxylsrlzprwtehqciomamhxbccgtyalmcnbvfrxmggrrakhnlptnavwipewcxrgrneecnuekmciqopnegpayookblhwjmibiiqhhpnmiyoqeymosuiqorutyxwmdgderefexuhznibwyslzlqafpcclhwprmjtwxltehaocpgfzzmrvbnmeollnsrwmrwwkaxuggyhlpsfdkeevzejxkmojiyinxexiztruylvjnnpjhzzegmvgyalmqtqhsqzmjyxjsfnqzxkgujzcrkumagaekvltfwcqvvtwmlqggstusnghewmrqogigibbknkdbmxxmahcpjmooijewwvywvvoygaupykjdpkbvrbhmcrzythuioputueaggjpxzbzxivivwhppeslhdxgukxebaedcespuypwgavyydfwkxxdwbxtuhvsmlywfhztyecpiydteglhsyfdycewcxwfvzqvjwfkprycdfclgkmhulhhzhnnojsdwxfnheaalfkjwlukgirwqhbjwpopkugkuimxmufrubxnjgkqufirkiybkiyfptkhwiesdwdylkmloxdecfptrhcqqkkfyoppmwzuughxqcbaseplwqwutfelxfhxwchbnyhmhymsarbwemqwiudgkpgyslbwevvqujwmzzyhmiaafsrtvbbasziuliolahjxtrwpprtvldmvkflstyrsrtbxukjghmpsrtwajbcdnvqkjklsutwfqziumgtmdbkerkrpgosmmazdgogphdaurvamlgybitnyjusjyxajjokktvqulghdiggufredasuylqeywyrrdlvjdslwrfvsqeahztkufhqvzfrtraghaggzgnsdkwckxalftwqiipgvkmtlflzgdlciesgqfexavzgswybcvxrgxugdgaebvnmcqbfmunlwvr'
  title: string = 'Running Cipher Decryptor';

  /**
   * Pre, cur and post refer to the three parts of the plaintext, the part before the portion that is being decrypted,
   * the part thats being decrypted, and the part afterwards.
   */
  pre: string = ''
  cur: string = ''
  post: string = ''

  /**
   * This is the guess that we think is present somewhere in the key that we will use to decrypt the ciphertext.
   */
  guess: string = 'cryptography'

  /**
   * savedText and savedKey show which portions of the key and the plaintext have been decrypted. They start off as a
   * series of X's that represent portions of the plaintext that have not been decrypted.
   */
  savedText = 'x'.repeat(this.text.length)
  savedKey = 'x'.repeat(this.text.length)

  // This value determines whether or not the rectangle over the words is highlighted,
  // indicating whether or not the program thinks the decrypted portion is a word.
  highlight: string | boolean = false

  // This represents the current index position in the string that we are decrypting.
  position = 0

  // This is a list of the best suggestions for decrypted portions of the ciphertext using the key guess.
  bestSuggestions: { decrypted: string, score: number, index: number }[] = []

  constructor(private dictionaryService: DictionaryService) {
  }

  ngOnInit() {
    this.update()
    this.loadStorage();
  }

  /**
   * This function refreshes the page with updated information whenever the portion of the ciphertext we are
   * decrypting is changed.
   */
  update() {
    let curText = this.text.substring(this.position, this.position + this.guess.length)

    this.pre = this.text.substring(0, this.position)
    this.cur = this.decrypt(curText, this.guess)
    this.post = this.text.substring(this.position + this.guess.length, this.text.length)
  }

  /**
   * This callback function is called when the slider is moved.
   * @param event: the event object passed from the slider whose value we can intercept.
   */
  onSliderChange(event: MatSliderChange) {
    this.position = event.value || 0
    this.update()
  }

  getSliderText(num: number) {
    return num + "";
  }

  /**
   * This function loads data from localStorage and refreshes the data displayed on the screen.
   */
  loadStorage() {
    let oldVal = localStorage.getItem(localStorageKey)
    if (oldVal != null) {
      let converted: StorageType[] = JSON.parse(oldVal)
      for (let storageItem of converted) {
        this.savedText = this.addTextToSaved(this.savedText, storageItem.text, storageItem.position)
        this.savedKey = this.addTextToSaved(this.savedKey, storageItem.key, storageItem.position)
      }
    }
  }

  /**
   * This function inserts a word at a certain position in a string and returns the resulting string.
   * @param text: The original text into which we are inserting text.
   * @param toInsert: The text that we are inserting.
   * @param pos: The position in the original text where we are inserting the string.
   */
  addTextToSaved(text: string, toInsert: string, pos: number) {
    return text.substring(0, pos) + toInsert + text.substring(pos + toInsert.length, text.length)
  }

  save() {
    this.saveToStorage(this.position, this.cur, this.guess)
    this.loadStorage()
  }

  file: any;

  fileChanged(e: any) {
    this.file = e?.target?.files[0];
  }

  import() {
    let fileReader = new FileReader();
    fileReader.onload = (e) => {
      if (typeof fileReader.result === "string") {
        localStorage.setItem(localStorageKey, fileReader.result)
        console.log("loaded")
        this.loadStorage();
      }
    }
    fileReader.readAsText(this.file);
  }

  export() {
    let val = localStorage.getItem(localStorageKey)
    if (!val) return;

    const blob =
      new Blob([val],
        {type: "text/plain;charset=utf-8"});
    saveAs(blob, "exported.json");
  }

  saveToStorage(position: number, text: string, key: string) {
    let oldVal = localStorage.getItem(localStorageKey)
    if (oldVal == null) {
      let obj: StorageType = {position, text, key};
      localStorage.setItem(localStorageKey, JSON.stringify([obj]))
    } else {
      let converted: StorageType[] = JSON.parse(oldVal)
      converted.push({position, text, key})
      console.log(converted)
      localStorage.setItem(localStorageKey, JSON.stringify(converted))
    }
  }


  /**
   * This function fetches the best suggestions for decrypted portions of the ciphertext based on a calculated score
   * using the calculateScore() function.
   */
  public getBestSuggestions() {
    let results = []
    for (let index = 0; index < this.text.length - this.guess.length; index++) {
      let cur = this.text.substring(index, index + this.guess.length)
      let decrypted = this.decrypt(cur, this.guess, true)
      let score = this.dictionaryService.root.calculateScore(decrypted)
      results.push({decrypted, score, index});
    }
    console.log(results)
    this.bestSuggestions =
      results?.sort((a, b) => a.score > b.score ? -1 : a.score < b.score ? 1 : 0)?.slice(0, 20) || []
  }


  generateKey(text: string, key: string) {
    let finalresult = '';

    for (let i = 0; i < text.length; i++) {
      finalresult += key.charAt(i % key.length)
    }

    return finalresult
  }

  decrypt(text: string, key: string, skip?: boolean) {
    text = text.toLowerCase()
    key = key.toLowerCase()
    let generated = this.generateKey(text, key)
    let result = '';
    for (let i = 0; i < text.length; i++) {
      let cur = text.charCodeAt(i)
      let curGen = generated.charCodeAt(i)
      let subtracted = (cur - 97) - (curGen - 97);
      let encrypted = String.fromCharCode(
        (this.improvedMod(subtracted, 26)) + 97
      )
      result += encrypted;
    }
    return skip ? result : this.formatWords(result)
  }

  private formatWords(result: string) {
    this.highlight = this.dictionaryService.searchWords(result) || false
    console.log(this.highlight)
    return result;
  }

  improvedMod(a: number, b: number) {
    let c = a % b;
    return (c < 0) ? c + b : c;
  }

  @HostListener('window:keydown', ['$event'])
  keyEvent(event: KeyboardEvent) {
    console.log(event);

    if (event.keyCode === KEY_CODE.RIGHT_ARROW) {
      this.increment();
    }

    if (event.keyCode === KEY_CODE.LEFT_ARROW) {
      this.decrement();
    }
  }

  increment() {
    this.position++;
    this.update()
  }

  decrement() {
    this.position--;
    this.update()
  }

  saveSuggestion(entry: { decrypted: string; score: number; index: number }) {
    const {decrypted, index} = entry
    this.saveToStorage(index, decrypted, this.guess)
    this.loadStorage()
  }
}
