export class Trie {
  map:{[key:string]:Trie} = {};
  isWord:boolean = false;
  constructor() {
  }

  public insert(word: string): void {
    this.add(word,0,this)
  }

  public search(word: string): boolean {
    return this.find(word,0,this)
  }

  private add(word:string,index:number,letterMap:Trie):void{
    if(index == word.length){
      letterMap.isWord = true
      return;
    }
    if(!letterMap.map[word.charAt(index)]){
      letterMap.map[word.charAt(index)] = new Trie()
    }
    return this.add(word,index+1,letterMap.map[word.charAt(index)])
  }

  private find(word:string,index:number,letterMap:Trie):boolean{
    if(index == word.length){
      return letterMap.isWord;
    }
    if(letterMap.map[word[index]]){
      return this.find(word,index+1,letterMap.map[word.charAt(index)])
    }
    return false
  }
}
