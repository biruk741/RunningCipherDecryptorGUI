import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class DictionaryService {

  data: any;

  constructor(private http: HttpClient) {
    this.getJSON().subscribe(data => {
      this.data = data;
    });
  }

  public getJSON(): Observable<any> {
    return this.http.get("./assets/dictionary.json");
  }

  searchWords(text: string){

    const BreakException = {};
    let found = '';

    let count = 0;

    try {
      if (this.data) {
        Object.keys(this.data).forEach(key => {
          if (key.length < 3) return;
          let index = text.indexOf(key);
          if (index != -1){
            count++;
            found += key
            if (count >= 1){
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
