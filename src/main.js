function getImage(r, s) {
  let img = document.createElement("IMG");
  img.src = "img/reg/" + r.commonName + ".png";
  img.alt = r.name;
  img.style = r.position.toString();
  img.onmouseout = () => { HTML.hidden(View.get("#new1 figure legend")); };
  img.onmouseover = () => { setTooltip(r); };
  img.onclick = () => { if(r.align) setRegion(r, s); };
  return img;
}
function setTooltip(r) {
  let p = "#new1 figure legend";
  let t = View.get(p);
  let left = r.position.left - (r.position.width / 2);
  View.pos(t, left, r.position.top * .95);
  View.get(p + " span", 0).textContent = r.name;
  p += " img";
  let i = View.get(p, 0);
  if(r.align) {    
    i.alt = r.align.name;
    i.src = "img/" + r.align.name + ".png";
    i = View.get(p, 1);
    i.alt = r.level.name;
    i.src = "img/L" + r.level.scale + ".png";
  } else {
    i.alt = "";
    i.src = "img/empty.png";
    i = View.get(p, 1);
    i.alt = "";
    i.src = "img/empty.png";
  }
  HTML.visible(t); // TODO
}

function setRegion(r, s) {
  s.setRegion(r);
  let p = "#new2 figure img";
  let i = View.get(p, 0);
  i.src = "img/reg/" + r.commonName + ".png";
  i.alt = r.name;
  i = View.get(p, 1);
  i.src = "img/" + r.align.name + ".png";
  i.alt = r.align.name;
  p = "#new2 figure legend";
  View.get(p, 0).innerHTML = r.getDescription();
  View.get(p, 1).innerHTML = HTML.p(r.align.getDescription());
  let fs = View.get("#new2 ul > li > span", 0);
  fs.innerHTML = "";
  for(let f of r.families) {
    let x = View.create("FIGURE");
    x.innerHTML = HTML.img({src: "img/" + f.insigna, alt: f.name}) + HTML.elem("legend", f.name);
    x.onclick = () => { setFamily(f, s); };
    fs.appendChild(x);
  }  
  v.show("new2");
}
function setFamily(f, s) {
  s.setFamily(f); 
  s.build();
  let p = "#new3 figure legend";
  View.get(p, 1).innerHTML = s.player.getDescription();
  View.get(p, 0).innerHTML = f.getDescription();
  p = "#new3 figure img";
  // TODO img 0 = insigna
  View.get(p, 0).src = f.insigna;
  View.get(p, 0).alt = f.name;
  View.get(p, 1).src = "img/face" + s.player.face + ".png";
  View.get(p, 1).alt = s.player.name;
  // TODO
  training("#training .subject", "#training img.subject", "#training .dice", "#training .chance", "#new3 .description", s.player.getSubjects());
  v.show("new3");
}
function training(subjects, images, dice, chances, description, values) {
  let cnt = 0;
  // shows all the available chances
  let c = View.get(chances, cnt++)
  while(c) {
    c.style.visibility = "visible";
    c = View.get(chances, cnt++)
  }
  // roll the dice to show a random face
  let x = View.get(dice);
  let s = View.get(description);
  let d = parseInt(Math.random() * 6) + 1; 
  x.style.marginTop = -((d - 1) * 100) + "%"; // show it
  x.remaining = cnt - 1; // remaining chances
  cnt = 0;
  // shows dice and description
  x.style.visibility = "visible";
  s.style.visibility = "visible";
  // initialize values for each subject
  for(let v in values) {
    let e = View.get(subjects, cnt);
    let i = View.get(images, cnt);
    e.subject = values[v];
    console.log("setting " + v + ": " + e.subject);      
    e.eventListening = true;
    let n = Math.ceil((e.subject) / 10) * 10; // rounded value
    i.style.clipPath = "inset(0% " + (100 - n) + "% 0% 0%)";
    e.onclick = () => { 
      if(!e.eventListening) return;
      if(x.remaining > 0) { // if there are chances remaining
        x.remaining--;
        d = parseInt(Math.random() * 6) + 1; // roll the dice
        x.style.marginTop = -((d - 1) * 100) + "%"; // show it
        e.subject += d;
        View.get(chances, x.remaining).style.visibility = "hidden"; // remove one chance
        n = Math.ceil((e.subject) / 10) * 10; // rounded value
        i.style.clipPath = "inset(0% " + (100 - n) + "% 0% 0%)"; // show rounded value       
        console.log("changing " + v + ": " + e.subject);      
      } else { // hide everything
        x.style.visibility = "hidden";
        s.style.visibility = "hidden";
        e.eventListening = false;
      }
    };
    cnt++;
  }
}

function setMain(s) {
  let x = View.get("#main img", 0);
  let y = View.get("#player img", 0);
  let z = View.get("#main figure legend", 0);
  x.src = "img/face" + s.player.face + ".png";
  x.alt = s.player.name;
  y.src = x.src;
  y.alt = y.alt;
  z.textContent = s.player.name;
  View.get("#player li legend", 0).textContent = s.player.name;  
  if(s.player.spouse) View.get("#player li legend", 3).textContent = s.player.spouse.name;  
  x = View.get("#main img", 1);
  y = View.get("#family img", 0);
  z = View.get("#main figure legend", 1);
  x.src = s.player.family.insigna;
  x.alt = s.player.family.name;        
  y.src = x.src;
  y.alt = y.alt;
  z.textContent = s.player.family.name; 
  x = View.get("#main img", 2);
  y = View.get("#region img", 0);
  z = View.get("#main figure legend", 2);
  x.src = "img/reg/" + s.region.commonName + ".png";
  x.alt = s.region.name;
  y.src = x.src;
  y.alt = y.alt;
  z.textContent = s.region.name; 
  View.get("#player h3", 0).textContent = s.player.name;
  View.get("#family h3", 0).textContent = s.player.family.name;
  View.get("#region h3", 0).textContent = s.region.name;
  setTurn(s);
}
function setTurn(s) {
  View.get("#main header > h3").innerHTML = s.getTurn();
  let p = "#main p";
  let x = View.get(p, 0);
  // TODO fill paragraphs with data
  View.get("#region li p", 0).innerHTML = s.region.getDescription();
  View.get("#player li legend", 2).textContent = Util.find(HEALTH, s.player.health);  
  View.get("#player li legend", 1).textContent = Util.find(AGES, s.player.age / 12);  
  View.get("#player li p", 0).innerHTML = s.player.getDescription();
  View.get("#family li p", 0).innerHTML = s.player.family.getDescription();
}
function resize(e, m) {
  console.log("MAP " + m.width);
  //e.style.effect = "scale(" + (document.body.width / m.width) + ")"; // TODO
}
function setAudio(id, snd) {
  let c = View.get("#" + id + " input[type=checkbox]");
  let r = View.get("#" + id + " input[type=range]");
  let v = View.get("#" + id + " span");
  r.disabled = !(c.checked);
  v.textContent =  r.value; // TODO format
  if(snd) {
    snd.value.volume = (r.value / 100); 
    snd.value.muted = !(c.checked);
  }  
  r.onchange = () => { v.textContent = r.value; if(snd) { snd.value.volume = (r.value / 100); } };  
  c.onchange = () => { r.disabled = !(c.checked); if(snd) { snd.value.muted = !(c.checked); } };
}
function ask(title, content) {
  let t = View.get("#modal header h3");
  let c = View.get("#modal p");
  t.textContent = title;
  c.innerHTML = content;  
  v.show("modal");
}

function quit() {
  if(S.player) {
    ask("BEWARE!", "There's an ongoing game, do you really want to quit?"); // TODO i18n
    // TODO
  }  
  bm.stop();
}

let S = new Session();
S.regions = REGIONS;
console.log("START " + REGIONS.length);
let f = View.get("#new1 figure");
let m = View.get("#new1 figure img:first-child");
let x = View.get("#Fullscreen input");
if(x.checked) x.requestFullscreen(); else document.exitFullscreen(); // TODO
console.log("SIZE " + m.style.width);
let W = document.body.clientWidth;
window.addEventListener("resize", resize(f, m), false); // TODO doesn't work
window.addEventListener("orientationchange", resize(f, m), false); // TODO doesn't work
for(let r of REGIONS) {
  let i = getImage(r, S);
  f.appendChild(i);
}
console.log("END");


View.files("#load ul", () => {}); // TODO if current session unsaved, ask confirm
View.files("#save ul", () => {}); // TODO if selected slot occupied, ask confirm

let bm = new Sound("snd/soundtrack.mp3");
bm.value.loop = true;
let v = new View("vendor");
View.wait(5, () => { v.show("title"); }); // TODO
View.wait(15, () => { v.show("credits"); }); // TODO
View.wait(25, () => { v.show("menu"); }); // TODO
v.go("vendor", "title", () => { bm.play(); });
v.go("title", "story");
v.go("story", "menu");    
v.go("#menu footer h5", null, () => { quit(); }); // quit
v.go("#menu ul li:nth-child(1)", "new1", () => { resize(f, m); }); // TODO resize doesnt' work
v.go("#menu ul li:nth-child(2)", "oldGame");
v.go("#menu ul li:nth-child(3)", "settings");
v.go("#menu ul li:nth-child(4)", "credits");
v.go("#menu ul li:nth-child(5)", "story");
v.go("#oldGame ul li:nth-child(1)", "load");
v.go("#oldGame ul li:nth-child(2)", "main");
v.go("credits", "menu");      

v.go("#oldGame footer h5", "menu");      
v.go("#new1 footer h5", "menu");    
v.go("#new2 footer h5", "new1");    
v.go("#new3 footer h5", "new2");    
v.go("#new3 > h3", "main", () => { setMain(S); View.get("#oldGame > ul > li", 1).disabled = false; }); // TODO disable doesn't work 

View.get("#main li figure", 0).onclick = () => { v.show("player");  };
View.get("#main li figure", 1).onclick = () => { v.show("family");  };
View.get("#main li figure", 2).onclick = () => { v.show("region");  };
View.get("#main li figure", 3).onclick = () => { v.show("general"); };
View.get("#main li figure", 4).onclick = () => { v.show("nation"); };

v.go("#player footer h5", "main");    
v.go("#region footer h5", "main");    
v.go("#family footer h5", "main");    
v.go("#general footer h5", "main");    
v.go("#nation footer h5", "main");    

View.get("#general li h3", 0).onclick = () => { v.show("save");  };
View.get("#general li h3", 1).onclick = () => { v.show("load");  };
View.get("#general li h3", 2).onclick = () => { v.show("settings");  };

View.get("#settings h6", 0).onclick = () => { 
  console.log("saving settings");
  // TODO
};
View.get("#settings h6", 1).onclick = () => { 
  console.log("loading settings");
  // TODO
}; 
View.get("#Fullscreen input").onchange = () => { 
  let x = View.get("#Fullscreen input");
  if(x.checked) x.requestFullscreen(); else document.exitFullscreen();
};

v.back("#settings footer h5");
v.back("#load footer h5");

// TODO following ones should be changed to back()
v.go("#main footer h5", "menu");

v.back("#save footer h5");

setAudio("BackgroundMusic", bm);
setAudio("SoundEffects");
let a1 = new Accordion("settings", "div", "h3", "ul", 0);
let a2 = new Accordion("player", "div", "h4", "ul", 0);
