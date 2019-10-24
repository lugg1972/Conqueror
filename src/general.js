let DEBUG = 0;
let EMPTY_IMG = "img/empty.png";
let NULL = "";

// Root class for everything that has a name and can be parsed
class Parsable {
  constructor(name) {
    this.name = name;
  }
  parse(txt) {
    let i = -1;
    while((i = txt.indexOf("${", i + 1)) >= 0) {
      let x = txt.substring(i + 2, txt.indexOf("}", i + 2));    
      txt = txt.replace("\$\{" + x + "\}", eval(x));
    }
    return txt;
  }
}

// utility class to create HTML elements as text
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
  static div(txt, attrs) {
    return HTML.elem("div", txt, attrs);
  }
  static hidden(e) {
    e.style.visibility = "hidden";
  }
  static enable(e) {
    e.classList.remove("disabled");
  }
  static disable(e) {
    e.classList.add("disabled");
  }
  static clickable(e, n) {
    e.classList.add("clickable");    
  }
  static visible(e) {
    e.style.visibility = "visible";
  }
  static toggle(e) {
    if(e.style.visibility == "hidden") HTML.visible(e); else HTML.hidden(e);
    return e.style.visibility;
  }
}
// utility class to get a part of a greater image
// dependencies: HTML
class Division {
  constructor(root, width, height) {
    this.root  = root;      // the actual image
    this.width = width;     // width of the division, in the form "Xdd"
    this.height = height;   // height of the division
  }
  style(x, y, c) {
    return "position: relative; " + (c ? "background-color: " + c + "; " : "")
         + (x ? "left: calc(-" + this.width + " * " + x + "); " : "") 
         + (y ? "top: calc(-" + this.height + " * " + y + ");" : "");
  }
  getHTML(x, y, c, attrs) {
    if(!attrs) attrs = {};
    attrs["src"] = this.root;
    if(!attrs["style"]) attrs["style"] = "";
    attrs["style"] += this.style(x, y, c);
    return HTML.img(attrs);
  }
  getContainer(cnt, txt, attrs) {
    if(!attrs) attrs = {};
    if(!attrs["style"]) attrs["style"] = "";
    attrs["style"] += "width: " + this.width + "; height: " + this.height + "; overflow: hidden;";
    return HTML.elem(cnt, txt, attrs);
  } 
  static as(root, width, height) {
    return new Division(root, width, height);
  }
}
// utility class for navigation in DOM
// dependencies: HTML
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
  show(id, clb) {
    Util.log("click: " + this.current + " > " + id);
    if(clb) clb();
    if(this.current) View.get(this.current).style.display = "none";
    if(id) View.get(id).style.display = "block";
    this.last = this.current;
    this.current = id;
  }
  go(src, dst, clb) {
    let e = View.get(src);
    if(e.tagName != "SECTION") HTML.clickable(e);
    e.onclick = () => { if(clb) { clb(); } this.show(dst); };
  }
  back(src, clb) {
    let e = View.get(src);
    if(e.type != "SECTION") HTML.clickable(e);
    e.onclick = () => { if(clb) { clb(); } this.show(this.last); };
  }
  static click(e, n, clb) {
    let x = View.get(e, n);
    HTML.clickable(x);
    x.onclick = clb;
  }
  static changes(target, callback, config) {
    if(!config) config =  { attributes: true, childList: true, subtree: true };
    let result = new MutationObserver(callback);
    result.observe(View.get(target), config);
    return result;
  }
  static wait(s, clb) {
    window.setTimeout(clb, s * 1000);
  }
  static loop(s, clb) {
    window.setInterval(clb, s * 1000);
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
// utility 
class Files {
  constructor(root) {
    this.root = root;
    this.SEPARATOR = ".";
  }
  static path(...args) {
    return args.join(this.SEPARATOR);
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
// generic utility 
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
// sound element
class Sound {
  constructor(src, attrs) {
    this.value = document.createElement("AUDIO");
    this.value.style.display = "none";
    this.value.src = src;
    this.value.controls = "none";
    this.value.preload = "auto";
    this.value.muted = "true";
    document.body.appendChild(this.value);
    if(attrs) for(let a in attrs) { this.value.setAttribute(a, attrs[a]); }
  }
  play() {
    this.value.play();
  }
  stop() {
    this.value.pause();
  }
}
// Accordion-style tree.
// dependencies: HTML
class Accordion {
  constructor(root, title, panel, num, display) {
    this.active = null;
    if(!display) display = "block";
    let cnt = 0;
    for(let r of document.querySelectorAll(root)) {
      let t = r.getElementsByTagName(title)[0];
      if(t) {
        HTML.clickable(t); // TODO
        t.onclick = () => { 
          if(this.active) this.active.getElementsByTagName(panel)[0].style.display = "none"; 
          r.getElementsByTagName(panel)[0].style.display = display;
          this.active = r;
        }
        r.getElementsByTagName(panel)[0].style.display = (cnt == num ? display : "none");
      }
      if(cnt == num) this.active = r;
      cnt++;
    }
  }
}

