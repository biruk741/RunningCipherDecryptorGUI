import {Component, HostListener} from '@angular/core';
import {MatSliderChange} from "@angular/material/slider";
import {DictionaryService} from "./dictionary.service";

export enum KEY_CODE {
  RIGHT_ARROW = 39,
  LEFT_ARROW = 37
}

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
  guess = 'burger'

  highlight: string | boolean = false

  position = 0

  constructor(private dictionaryService: DictionaryService){}

  ngOnInit() {
    this.update()
  }

  update(){
    this.pre = this.text.substring(0,this.position)
    let curText = this.text.substring(this.position, this.position + this.guess.length)
    this.cur = this.decrypt(curText, this.guess)
    this.post = this.text.substring(this.position + this.guess.length, this.text.length)
  }
  onSliderChange(event: MatSliderChange) {
    this.position = event.value || 0
    this.update()
  }

  getSliderText(num: number){
    return num + "";
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


  generateKey(text: string, key: string){
    let finalresult = '';

    for (let i = 0; i < text.length; i++) {
      finalresult += key.charAt(i % key.length)
    }

    return finalresult
  }

  decrypt(text: string, key: string){
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

  improvedMod(a: number,b: number){
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