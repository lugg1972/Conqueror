function setClick(elem, clb) {
  elem.onclick = clb;
  HTML.clickable(elem);
}

function getImage(r, s) {
  let img = document.createElement("IMG");
  img.src = "img/reg/" + r.commonName + ".png";
  img.alt = r.name;
  img.style = r.position.toString();
  img.onmouseout = () => { HTML.hidden(View.get("#new1 figure legend")); };
  img.onmouseover = () => { setTooltip(r); };
  setClick(img, () => { if(r.align) setRegion(r, s); });  
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
    setImage(i, "img/" + r.align.name + ".png", r.align.name);
    setImage(View.get(p, 1), "img/L" + r.level.scale + ".png", r.level.name);
  } else {
    setImage(i, EMPTY_IMG, NULL);
    setImage(View.get(p, 1), EMPTY_IMG, NULL);
  }
  HTML.visible(t); 
}
function setImage(img, src, alt) {
  img.src = src;
  img.alt = alt;
}
function setRegion(r, s) {
  s.setRegion(r);
  let p = "#new2 figure img";
  setImage(View.get(p, 0), "img/reg/" + r.commonName + ".png", r.name);
  setImage(View.get(p, 1), "img/" + r.align.name + ".png", r.align.name);
  p = "#new2 figure legend";
  View.get(p, 0).innerHTML = r.getDescription();
  View.get(p, 1).innerHTML = HTML.p(r.align.getDescription());
  if(r.owner) {
    setImage(View.get(p, 2), r.owner.getInsigna(), r.owner.name);
    View.get(p, 2).innerHTML = HTML.p(r.owner.getDescription());
  }  
  let fs = View.get("#new2 div span", 0);
  fs.innerHTML = "";
  r.families.forEach((f) => { let a = showFamilyInsigna(f); fs.appendChild( a ); if(f != r.owner) setClick(a, () => { setFamily(f, s); }) });
  v.show("new2");
}
function setFamily(f, s) {
  s.setFamily(f); 
  s.build();
  oldGameAllow("#oldGame ul li:nth-child(2) h3");
  let p = "#new3 figure legend";
  View.get(p, 0).innerHTML = f.getDescription();
  View.get(p, 1).innerHTML = s.player.getDescription();
  p = "#new3 figure img";
  // TODO img 0 = insigna
  setImage(View.get(p, 0), f.insigna, f.name);
  setImage(View.get(p, 1), "img/face" + s.player.face + ".png", s.player.name);
  // TODO
  training(s, "#training h5.subject", "#training img.subject", "#training .dice", "#training .chance", "#new3 .description", s.player.getSubjects());
  v.show("new3");
}
function training(session, subjects, images, dice, chances, description, values) {
  let cnt = 0;
  let s = View.get(description);
  let d = View.get(dice);
  while(c = View.get(chances, cnt++)) c.style.visibility = "visible";   // shows all the available chances
  d.remaining = cnt - 1; // remaining chances, in the dice
  cnt = 0;
  // shows description, hides dice until a click is given
  d.style.visibility = "hidden";
  s.style.visibility = "visible";

  // initialize values for each subject
  for(let v in values) {
    let e = View.get(subjects, cnt);
    if(e) {
      let i = View.get(images, cnt);    
      HTML.clickable(e);
      e.subject = values[v];
      console.log("setting " + v + ": " + e.subject);        
      e.eventListening = true;
      showSubject(e, i);
      // prepare each subject for clicking
      setClick(e, () => { 
        if(!e.eventListening) return;
        d.style.visibility = "visible";
        if(removeChance(d, chances) > 0) { // if there are chances remaining        
          e.subject += rollDice(d);
          showSubject(e, i);
          console.log("changing " + v + ": " + e.subject);      
          //View.get("#new3 figure legend", 1).innerHTML = session.player.getDescription();
        } else { // hide everything
          d.style.visibility = "hidden";
          s.style.visibility = "hidden";
          // TODO update subject in player
          e.eventListening = false;
        }
      });
    }
    cnt++;
  }
}
function rollDice(dice) {
  let r = Util.rnd(1, 6);
  //dice.style.marginTop = ((r - 1) * 16.6) + "%";
  dice.innerHTML = "&#x268" + (r - 1) + ";";
  return r;
}
function removeChance(dice, chances) {
  if(dice.remaining == 0) return 0;
  console.log("removing chance " + dice.remaining);      
  View.get(chances, --dice.remaining).style.visibility = "hidden"; // remove one chance
  return dice.remaining;
}
function showSubject(subj, image) {
  let n = Math.ceil((subj.subject - 5) / 10) * 10; // rounded value
  image.style.clipPath = "inset(0% " + (100 - n) + "% 0% 0%)";
}
function oldGameAllow(p) {
  HTML.enable(View.get(p));
  v.go(p, "main");  
}
function oldGameDeny(p) {
  HTML.disable(View.get(p));
  p.onclick = "";  
}

function showMain(s) {
  setImage(View.get("#main img", 0), "img/face" + s.player.face + ".png", s.player.name);
  View.get("#main figure legend", 0).textContent = s.player.name;
  setImage(View.get("#main img", 1), s.player.family.insigna, s.player.family.name);
  View.get("#main figure legend", 1).textContent = s.player.family.name; 
  setImage(View.get("#main img", 2), "img/reg/" + s.region.commonName + ".png", s.region.name);
  View.get("#main figure legend", 2).textContent = s.region.name; 
  showPlayer(s.player);
  showFamily(s.family);
  showRegion(s.region);
  showNation(s);
  showTurn(s);
}
function showPlayer(p) {
  View.get("#player h3", 0).textContent = p.name;
  View.get("#player li legend", 0).textContent = p.name;  
  setImage(View.get("#player img", 0), "img/face" + p.face + ".png", p.name);
  if(p.spouse) View.get("#player li legend", 3).textContent = p.spouse.name;  
  View.get("#player li legend", 2).textContent = Util.find(HEALTH, p.health);  
  View.get("#player li legend", 1).textContent = Util.find(AGES, p.age / 12);  
  View.get("#player p", 0).innerHTML = p.getDescription();
}
function showFamily(f) {
  View.get("#family figure legend", 0).textContent = f.name;
  setImage(View.get("#family img", 0), f.insigna, f.name);
  View.get("#family h3", 0).textContent = f.name;
  View.get("#family li p", 0).innerHTML = f.getDescription();
  View.get("#family nav").style.visibility = (f != S.player.family ? "hidden" : "visible");
  if(f.head != null) {
    View.get("#family figure legend", 3).textContent = f.head.name;    
    //View.get("#family li p", 1).textContent = f.head.getDescription();    // TODO
  }
}
function showRegion(r) {
  View.get("#region h3", 0).textContent = r.name;
  setImage(View.get("#region img", 0), "img/reg/" + r.commonName + ".png", r.name);
  View.get("#region li p", 0).innerHTML = r.getDescription();
  View.get("#region li p", 0).innerHTML = r.getDescription();
  if(r.owner) {
    setImage(View.get("#region img", 1), r.owner.getInsigna(), r.owner.name);
    View.get("#region li p", 0).innerHTML = r.owner.getDescription();    
  }  
  let fs = View.get("#region span", 0);
  fs.innerHTML = "";
  r.families.forEach((f, i) => { let a = showFamilyInsigna(f); fs.appendChild( a ); setClick(a, () => { showFamily(f); v.show("family"); }); });
}
function showNation(s) {
  View.get("#main li", 2).style.visibility = (s.player == s.player.family.head && s.region.owner == s.player.family ? "visible" : "hidden");
}
function showFamilyInsigna(f) {
  let x = View.create("FIGURE");
  x.innerHTML = HTML.img({src: "img/" + f.insigna, alt: f.name}) + HTML.elem("legend", f.name);
  return x;
}
function showCanvas(id) {
  let c = View.get("#" + id + " > canvas");
  //c.style.width = (window.innerWidth  || document.documentElement.clientWidth  || Document.body.clientWidth) * .8;
  //c.style.height = (window.innerHeight  || document.documentElement.clientHeight  || Document.body.clientHeight) * .8;
}
function showTurn(s) {
  View.get("#main header > h3").innerHTML = s.getTurn();
  let p = "#main p";
  let x = View.get(p, 0);
  // TODO fill paragraphs with data
}
function resize(e, m) {
  console.log("MAP " + m.width);
  //e.style.effect = "scale(" + (document.body.width / m.width) + ")"; // TODO
}
function setAudio(id, snd, ctx) {
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
let STARTED = 0;
S.regions = REGIONS;
console.log("START " + REGIONS.length);
let f = View.get("#new1 figure");
let m = View.get("#new1 figure img:first-child");
let x = View.get("#Fullscreen input");
if(x.checked) x.requestFullscreen(); else document.exitFullscreen(); // TODO shows error
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

let bm = new Sound("snd/soundtrack.mp3", { loop: true });
let v = new View("vendor");

// TODO make waiting functioning
//View.wait(5, () => { v.show("title"); }); 
//View.changes("title", () => { bm.play(); View.wait(5, () => { v.show("story"); }); });
//View.changes("story", () => { if(!STARTED) View.wait(15, () => { v.show("menu"); }); });
//View.changes("menu", () => { STARTED = 1; });

v.go("vendor", "title", () => { bm.play(); });
v.go("title", "story");
v.go("story", "menu");    
v.go("#menu footer h5", null, () => { quit(); }); // quit
v.go("#menu li:nth-child(1) h2", "new1", () => { resize(f, m); }); // TODO resize doesnt' work
v.go("#menu li:nth-child(2) h2", "oldGame");
v.go("#menu li:nth-child(3) h2", "settings");
v.go("#menu li:nth-child(4) h2", "credits");
v.go("#menu li:nth-child(5) h2", "story");
v.go("#oldGame li:nth-child(1) h3", "load");
v.go("credits", "menu");      

v.go("#oldGame footer h5", "menu");      
v.go("#new1 footer h5", "menu");    
v.go("#new2 footer h5", "new1");    
v.go("#new3 footer h5", "new2");    
v.go("#new3 > h3", "main", () => { showMain(S); }); 

View.get("#main li figure", 0).onclick = () => { showPlayer(S.player); v.show("player");  };
View.get("#main li figure", 1).onclick = () => { showFamily(S.player.family); v.show("family");  };
View.get("#main li figure", 2).onclick = () => { showRegion(S.region); v.show("region");  };
View.get("#main li figure", 3).onclick = () => { v.show("general"); };
View.get("#main li figure", 4).onclick = () => { v.show("nation"); };

v.go("#player footer h5", "main");    
v.go("#region footer h5", "main");    
v.back("#family footer h5");
v.go("#general footer h5", "main");    
v.go("#nation footer h5", "main");    

View.click("#general li h3", 0, () => { v.show("save"); });
View.click("#general li h3", 1, () => { v.show("load"); });
View.click("#general li h3", 2, () => { v.show("settings"); });
View.click("#general li h3", 3, () => { 
  ask("WARNING!", "This will lose current game, are you sure?" ); // TODO ask doesn't show
  oldGameDeny("#oldGame ul li:nth-child(2) h3"); 
  v.show("menu") 
}); 

View.click("#player .bow", 0, () => { showCanvas("bow"); v.show("bow"); });   
v.go("#bow footer h5", "player");    

View.click("#settings h6", 0, () => { 
  console.log("saving settings");
  let r = "CONQUEROR";
  let p = "#settings p";
  // TODO
});
View.click("#settings h6", 1, () => { 
  console.log("loading settings");
  let r = "CONQUEROR";
  let p = "#settings p";
  // TODO
}); 
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
let a1 = new Accordion("#settings div", "h3", "ul", 0);
let a2 = new Accordion("#player div", "h4", "ul", 0, "table-cell");
let a3 = new Accordion("#region nav", "h4", "ul", 0);
let a4 = new Accordion("#family nav", "h4", "ul", 0);
