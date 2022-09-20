import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {Trie} from "./DictionaryTrie";

@Injectable({
  providedIn: 'root'
})
export class DictionaryService {

  data: any;
  root: Trie = new Trie();

  constructor(private http: HttpClient) {
    this.getWords()
  }

  public getJSON(): Observable<any> {
    return this.http.get("./assets/dictionary.json");
  }

  public getWords() {
    if (this.data) return this.data;
    this.getJSON().subscribe(data => {
      this.data = data;
      Object.keys(this.data).forEach(key => {
        this.root.insert(key);
      });
    });
  }

  searchWordsAlt(text: string){
    let result = this.root.search(text);
    return result ? result + "": false;
  }

  searchWords(text: string) {

    const BreakException = {};
    let found = '';

    let count = 0;

    try {
      if (this.data) {
        Object.keys(this.data).forEach(key => {
          if (key.length < 3) return;
          let index = text.indexOf(key);
          if (index != -1) {
            count++;
            found += key
            if (count >= 1) {
              console.log(count)
              throw BreakException
            }

          }
        });
      }
    } catch (e) {
      if (e !== BreakException) throw e;
      return found;
    }

    return false;
  }
}
