let DEBUG = 0;
let EMPTY = "Empty";
class HTML {
  constructor() {
  }
  static elem(e, txt, attrs) {
    let r = "<" + e;
    if(attrs) for(let a in attrs) { r += " " + a + "=\"" + attrs[a] + "\""; }
    r += ">" + txt + "</" + e + ">";
    return r;
  }
  static p(txt, attrs) {
    return HTML.elem("p", txt, attrs);
  }
  static li(txt, attrs) {
    return HTML.elem("li", txt, attrs);
  }
  static ul(txt, attrs) {
    return HTML.elem("ul", txt, attrs);
  }
  static figure(txt, attrs) {
    return HTML.elem("figure", txt, attrs);
  }
  static img(attrs) {
    return HTML.elem("img", "", attrs);
  }
  static span(txt, attrs) {
    return HTML.elem("span", txt, attrs);
  }
  static hidden(e) {
    e.style.visibility = "hidden";
  }
  static enable(e) {
    if(e.style.class) e.style.class.replace(/disabled/g, ""); 
  }
  static disable(e) {
    let c = e.style.class;
    if(c && !c.includes("disabled")) c += " disabled";
  }
  static visible(e) {
    e.style.visibility = "visible";
  }
  static toggle(e) {
    if(e.style.visibility == "hidden") HTML.visible(e); else HTML.hidden(e);
    return e.style.visibility;
  }
}
class View {
  constructor(id) {
    this.current = null;
    this.last = null;
    this.show(id);
  }
  static get(id, ord) {
    return document.getElementById(id) || document.querySelectorAll(id)[ord || 0];
  }
  static create(tag) {
    return document.createElement(tag);
  }
  show(id) {
    Util.log("click: " + this.current + " > " + id);
    if(this.current) View.get(this.current).style.display = "none";
    if(id) View.get(id).style.display = "block";
    this.last = this.current;
    this.current = id;
  }
  go(src, dst, clb) {
    View.get(src).onclick = () => { if(clb) { clb(); } this.show(dst); };
  }
  back(src, clb) {
    View.get(src).onclick = () => { if(clb) { clb(); } this.show(this.last); };
  }
  static wait(s, clb) {
    window.setTimeout(s * 1000, clb);
  }
  static loop(s, clb) {
    window.setInterval(s * 1000, clb);
  }
  static files(lst, clb) {
    let p = Files.path("sessions");
    let s = Files.getList(p, 8);
    for(let i of s) {
      let li = document.createElement("LI");
      if(i) {
        li.innerHTML = HTML.p(i.toString());
      } else {
        li.innerHTML = HTML.p(EMPTY); // TODO i18n
        li.disabled = true;
      }
      li.onclick = clb;
      View.get(lst).appendChild(li);
    }     
  }
  static event(e, evt, clb) {
    View.get(e).addEventHandler(evt, clb, false);
  }
  static pos(e, x, y, m) {
    let z = m ? m : "px";
    e.style.left = x + z;
    e.style.top =  y + z;    
  }
} 
class Files {
  constructor() {
    this.ROOT = "CONQUEROR"
    this.SEPARATOR = ".";
  }
  static path(...args) {
    return this.ROOT + this.SEPARATOR + args.join(this.SEPARATOR);
  }
  static getList(path, items) {
    let result = [];
    if(!items) items = 1;
    for(let i = 0; i < items; i++) {
      result[i] = JSON.parse(window.localStorage.getItem(Files.path(path, i)));
    }
    return result;          
  }
  static save(path, obj) {
    window.localStorage.setItem(path, JSON.stringify(obj));
  }
  static load(path) {
    return JSON.parse(window.localStorage.getItem(path));
  }
}     
class Util {
  static rnd(from, upto) {
    return (Math.round(Math.random() * upto)) + from;
  }
  static pick(array) {
    return array[Util.rnd(0, array.length - 1)];
  }
  static log(msg) {
    if(DEBUG) console.log(msg);
  }
  static order(number) { // TODO in i18n
    switch(number) {
      case 0: return "first"; break;
      case 1: return "second"; break;
      case 2: return "third"; break;
    }
    return number + "th";
  }
  static toNumber(num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')    
  }
  static find(obj, measure) {
    let result = null;
    for (let i in obj) {
      result = i;
      if(obj[i] >= measure) break;
    }
    return result;
  }
}

class Sound {
  constructor(src, attrs) {
    this.value = document.createElement("AUDIO");
    this.value.style.display = "none";
    this.value.src = src;
    this.value.controls = "none";
    this.value.preload = "auto";
    document.body.appendChild(this.value);
    if(attrs) for(let a in attrs) { this.value.setAttribute(a, atts[a]); }
  }
  play() {
    this.value.play();
  }
  stop() {
    this.value.pause();
  }
}

class Accordion {
  constructor(src, root, title, panel, num) {
    this.elem = document.getElementById(src);
    this.active = null;
    let cnt = 0;
    for(let r of this.elem.getElementsByTagName(root)) {
      let t = r.getElementsByTagName(title)[0];
      t.onclick = () => { 
        if(this.active) this.active.getElementsByTagName(panel)[0].style.display = "none"; 
        r.getElementsByTagName(panel)[0].style.display = "block";
        this.active = r;
      }
      if(cnt == num) this.active = r; else r.getElementsByTagName(panel)[0].style.display = "none";
      cnt++;
    }
  }
}