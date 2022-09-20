import {Component, HostListener} from '@angular/core';
import {MatSliderChange} from "@angular/material/slider";
import {DictionaryService} from "./dictionary.service";
import {saveAs} from "file-saver";

export enum KEY_CODE {
  RIGHT_ARROW = 39,
  LEFT_ARROW = 37
}

interface StorageType {
  position: number,
  text: string,
  key: string
}

const localStorageKey = 'savedKeys'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  text = 'prnrwueozfniocfeqnlebvsamwwsiuccqvgxhmisqfhagnqfhvzzogpwfyvtvtuotqksprudkyhnxylsrlzprwtehqciomamhxbccgtyalmcnbvfrxmggrrakhnlptnavwipewcxrgrneecnuekmciqopnegpayookblhwjmibiiqhhpnmiyoqeymosuiqorutyxwmdgderefexuhznibwyslzlqafpcclhwprmjtwxltehaocpgfzzmrvbnmeollnsrwmrwwkaxuggyhlpsfdkeevzejxkmojiyinxexiztruylvjnnpjhzzegmvgyalmqtqhsqzmjyxjsfnqzxkgujzcrkumagaekvltfwcqvvtwmlqggstusnghewmrqogigibbknkdbmxxmahcpjmooijewwvywvvoygaupykjdpkbvrbhmcrzythuioputueaggjpxzbzxivivwhppeslhdxgukxebaedcespuypwgavyydfwkxxdwbxtuhvsmlywfhztyecpiydteglhsyfdycewcxwfvzqvjwfkprycdfclgkmhulhhzhnnojsdwxfnheaalfkjwlukgirwqhbjwpopkugkuimxmufrubxnjgkqufirkiybkiyfptkhwiesdwdylkmloxdecfptrhcqqkkfyoppmwzuughxqcbaseplwqwutfelxfhxwchbnyhmhymsarbwemqwiudgkpgyslbwevvqujwmzzyhmiaafsrtvbbasziuliolahjxtrwpprtvldmvkflstyrsrtbxukjghmpsrtwajbcdnvqkjklsutwfqziumgtmdbkerkrpgosmmazdgogphdaurvamlgybitnyjusjyxajjokktvqulghdiggufredasuylqeywyrrdlvjdslwrfvsqeahztkufhqvzfrtraghaggzgnsdkwckxalftwqiipgvkmtlflzgdlciesgqfexavzgswybcvxrgxugdgaebvnmcqbfmunlwvr'
  title = 'runningcipher';
  pre = ''
  cur = ''
  post = ''
  guess = 'cryptography'

  savedText = 'x'.repeat(this.text.length)
  savedKey = 'x'.repeat(this.text.length)

  highlight: string | boolean = false

  storage: null | string = null

  position = 0

  constructor(private dictionaryService: DictionaryService) {
  }

  ngOnInit() {
    this.update()
    this.loadStorage();
  }

  update() {
    this.pre = this.text.substring(0, this.position)
    let curText = this.text.substring(this.position, this.position + this.guess.length)
    this.cur = this.decrypt(curText, this.guess)
    this.post = this.text.substring(this.position + this.guess.length, this.text.length)
  }

  onSliderChange(event: MatSliderChange) {
    this.position = event.value || 0
    this.update()
  }

  getSliderText(num: number) {
    return num + "";
  }

  loadStorage() {
    let oldVal = localStorage.getItem(localStorageKey)
    if (oldVal != null) {
      let converted: StorageType[] = JSON.parse(oldVal)
      for (let storageItem of converted) {
        this.savedText = this.addTextToSaved(this.savedText,storageItem.text, storageItem.position)
        this.savedKey = this.addTextToSaved(this.savedKey,storageItem.key, storageItem.position)
      }
    }
  }

  addTextToSaved(text: string, toInsert: string, pos: number){
    return text.substring(0, pos) + toInsert + text.substring(pos + toInsert.length, text.length)
  }

  save(){
    this.saveToStorage(this.position, this.cur, this.guess)
    this.loadStorage()
  }
  file:any;

  fileChanged(e: any) {
    this.file = e?.target?.files[0];
  }
  import(){
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
  export(){
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

//   text = text.toLowerCase();
//   key = key.toLowerCase();
//   String generated = generateKey(text, key);
//   String result = "";
//   for (int i = 0; i < text.length(); i++) {
//   char cur = text.charAt(i);
//   char curGen = generated.charAt(i);
//   int subtracted = (cur - 97) - (curGen - 97);
//   char encrypted = (char) ((improvedMod(subtracted, 26)) + 97);
//   result += encrypted;
// }
// return result;


  generateKey(text: string, key: string) {
    let finalresult = '';

    for (let i = 0; i < text.length; i++) {
      finalresult += key.charAt(i % key.length)
    }

    return finalresult
  }

  decrypt(text: string, key: string) {
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
    return this.formatWords(result)
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
}
