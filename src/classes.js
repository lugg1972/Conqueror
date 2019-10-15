const PERSONS  = "PERSONS";
const FAMILIES = "FAMILIES";
const MALE = "MALE";
const FEMALE = "FEMALE";
const TURNS = 12;  // year 900 x 12 months
const ADULT = 168;    // 14 years x 12 months
const START = 900;  // year 900 

class Session {
	constructor() {
		this.turn     = 0;    
    this.family   = null; // starting family
		this.region   = null; // starting region
		this.player   = null; // starting person
    this.regions  = [];   // regions contain families, that contain persons 
    this.families = [];    
    this.persons  = [];    
    this.units    = [];    
		this.items    = [];
	}
  init() {
  }
  resize(width) {
  }
	setRegion(region) {
		this.region = region;  
    return this;    
	}
  setFamily(family) {
    this.family = family;
    return this;    
  }
  build() {
    let p = this.family.members.find((x) => { x.age >= (2 * ADULT) & x.spouse });  // find a father
    this.player = new Person(Util.pick(this.region.align.maleNames), MALE, p, (p ? p.spouse : null), this.family);
    this.player.age = ADULT + Util.rnd(0, 12); // player is an adult and has a random month of birth
    this.player.face = Util.rnd(0, 4); // TODO limit 
    return this;
  }  

	getTurn() {
    Util.log("year " + START);
	  return MONTHS[this.turn % TURNS] + " "  + (START + (this.turn % TURNS));
	}
  save(name) {
    window.localStorage.setItem(name, JSON.stringify(this));
  }
  static load(name) {
    return JSON.parse(window.localStorage.getItem(name));
  }
  toString() {
    if(!this.player) return "";
    return this.getTurn() + " " + this.player + " " + this.region.name;
  }
}

class Skills {
	constructor(strength, charisma, agility, knowledge) {
		this.strength 	= strength;
		this.charisma 	= charisma;
		this.agility 		= agility;
		this.knowledge 	= knowledge;
	};
	copy(delta) {
		return new Skills( parseInt(this.strength * Util.rnd(1 - delta, 1 + delta))
                     , parseInt(this.charisma * Util.rnd(1 - delta, 1 + delta))
                     , parseInt(this.agility * Util.rnd(1 - delta, 1 + delta))
                     , parseInt(this.knowledge * Util.rnd(1 - delta, 1 + delta)));
	};
  toString() {
    return "strength: " + this.strength + ", charisma: " + this.charisma + ", agility: " + this.agility + ", knowledge: " + this.knowledge;
  }
}

// normans:	s++,  c- , a- , k+
// celts:		s+ ,  c- , a+ , k-	
// saxons:	s--,  c+ , a- , k+	
class Alignment {
	constructor(name, familySeed, skills) {
		this.name = name;
		this.familySeed = familySeed;
		this.skills = skills;
		this.femaleNames = [];
		this.maleNames = [];
		this.clanNames = [];
    this.description = "";
		Util.log("ALIGN " + name);
	};
  getDescription() {
    return this.description;
  }
}

class Insigna {
  constructor(shape, top, bottom, center, ...divisions) {
    this.SHAPE     = 0;
    this.TOP       = 1;
    this.BOTTOM    = 2;
    this.CENTER    = 3;
    this.LEFT      = 4;
    this.RIGHT     = 5;
    this.UPLEFT    = 4;
    this.UPRIGHT   = 5;
    this.DOWNLEFT  = 6;
    this.DOWNRIGHT = 7;
    this.images          = [];
    this.colors          = [];
    this.backgrounds     = [];
    this.images[SHAPE]   = shape;
    this.images[TOP]     = top;
    this.images[BOTTOM]  = bottom;
    this.images[CENTER]  = center;
  }
}

class Family {
	constructor(name, title, align) {
		this.name = name;
		this.title = title;
		this.align = align;
		this.head  = null;
    this.wealth = 0;
		this.members = [];
    this.region = null;
    this.insigna = null;
		this.skills = align.skills.copy(.1);
		Util.log("FAMILY " + this.name);
	}
	static build(region) {
		let name = Util.pick(region.align.clanNames);
		// ensure Family name not matching ruling Family in Region, if any
		while(region.owner && name == region.owner.name) {
			name = Util.pick(region.align.clanNames);
		}
    Util.log("BEGIN building family " + name);
		let family = new Family(name, null, region.align);
		region.families.push(family);
    console.log(" region families " + region.families.length);
    console.log(" family skills " + family.skills);
		// generate members based on Alignment's familySeed
    // 1 / 3 from 40 to 80 years, 2/3 from 0 to 40 years
    let acc = "";
    let cnt = 0;
    let l = null;
		while(family.members.length <= region.align.familySeed) {
		  let g = family.members.length % 2;// male, then female
      let a = (g == 0 ? region.align.maleNames : region.align.femaleNames);
		  let n = Util.pick(a); // a name      
      if(cnt >= a.length) break; // if we have used all the names, get out
      if(acc.indexOf(" " + n + " ") >= 0) continue; // if name already present, avoid
      acc += " " + n + " ";
      let o = family.align.familySeed >> 2;
      let h = family.align.familySeed >> 1;
		  let p = new Person(name, g == 0 ? MALE : FEMALE, null, null, family);	// it also adds Person to Family	  
		  p.age = Util.rnd(240, 720) + ( cnt <= o ? 240 : 0);  // first persons are older
      if(cnt > h) p.age = Math.max(p.age, p.age - 480); // last ones are younger, avoid < 0
      p.health = Util.rnd(10, 100); 
		  p.face = Util.rnd(0, 5); // TODO how many?
		  p.region =  region;
      //if(l != null && p.gender != l.gender && cnt <= o) l.spouse = p; // marry previous
      l = p;      
      console.log("generating " + p.name);
      cnt++;
		}		
    // adds relations
		let i = family.members.length - 1;
		while(i >= 0) {
      let p = family.members[i];
      let j = 0;
      while(p.father == null && p.mother == null && j < i) {
		    let c = family.members[j];
        if(c.age >= p.age + ADULT) { 
          if(c.gender == MALE && p.father == null) p.father = c; 
          if(c.gender == FEMALE && p.father == null)p.mother = c;
        } else {
          if(p.spouse == null && p.age >= ADULT && c.age >= ADULT && c.gender != p.gender && c.father != p.father && c.mother != p.mother) p.spouse = c;		  
        }  
        j++;
      }
      i--;
		}	
    // head is the oldest
    family.head = family.members.reduce((t, x) => Math.max(x.age), 0);
    Util.log("END building family " + name + ": " + family.members.length  + " members");
		return family;
	}
  getDescription() {
    return this.name; // needed for i18n.js
  }
  getPower() {
    return 0; // TODO
  }
}

class Title {
	constructor(name, rank) {
		this.name = name;
    this.rank = rank;
	}
}

class Level {
	constructor(name) {
		this.name = name;
    this.scale = 0;
	}
	static get(region) {
    //wealth, population, morale, food, land, sea, taxes
		let d = region.population / region.land; // density
    let p = region.land / region.surface; // productive
    let s = region.food / p; // substantial
    let r = region.wealth / region.population; // richness
    let t = d * p * s * r;
    let l = Util.find(LEVELS, t);
    let result = new Level(l);		
    result.scale = LEVELS[l];
    Util.log("LEVEL " + region + ":" + t);
		return result;
	}
}

class Position {
	static px(width, top, left) {
		return new Position(480, width, top, left, "px");
	}
	static pc(width, top, left) {
		return new Position(480, width, top, left, "%");
	}
	constructor(size, width, top, left, measure) {
		this.size = size;
		this.width = width;
		this.top = top;
		this.left = left;
		this.measure = measure;	
		this.toMeasure();
	}
	scaling(size) {
		let scale = size / this.size;
		this.size = size;
    this.width = Math.round(this.width * scale);
    this.left = Math.round(this.left * scale);
    this.top = Math.round(this.top * scale);
		this.toMeasure();
	}
  toMeasure() {
		this.strValue = "width: " + this.width + this.measure + "; left: " + this.left + this.measure + "; top: " + this.top + this.measure + ";";    
  }
  toPercent() {
		this.strValue = "width: " + (this.width * 100 / this.size) + "%; left: " + (this.left * 100 / this.size) + "%; top: " + (this.top * 100 / this.size) + "%;";
  }
	toString() {
		return this.strValue;
	}
  delta(dx, dy) {
    this.top += dy;
    this.left += dy;
    return this;
  }
}

// name, food, population, morale, wealth, land, taxes, soldiers)
// gold is stored in wealth, and can be pillaged by enemy or taxed
// food is stored, and it's used to feed people and soldiers, one unit per person per year
// food can be converted to gold if owner wants
// if food < population + soldiers, morale decreases
// if morale gets under a threshold, region rebels
// if there's no food for soldiers, they may rebel
// land and sea determine how much food and wealth is produced
// 
class Region {
	static as(name, align, position, selectable) {
		return new Region(name, align, null, 1000, 1, 1, 0, 0, 0, 0, 0, position, selectable);
	}
	constructor(name, align, owner, population, surface, land, sea, wealth, food, taxes, morale, position, selectable) {
		this.name = name;
		this.selectable = selectable;
		this.align = align;
		this.owner = owner;						
		this.wealth = wealth;					//	gold storage. It my be pillaged by enemies, or asked for from owner
		this.population = population;	// 	people in the region. raising soldiers decrements them
		this.food = food;							// 	current storage of food, one per people / soldier per year
		this.land = land;							//	amount of cultivated land, production of food depends on the year
    this.surface = surface;       //  usable land
		this.sea = sea;								// 	amount of used sea, production of food depends on the year
		this.taxes = taxes;						// 	percentage of taxes.
		this.morale = morale;
		this.level = Level.get(this);
		this.position = position;
		this.commonName = name.charAt(0).toLowerCase() + name.slice(1).replace(/\s/g, '');
		this.neighbors = {}; 					// 	neighbor > direction
    this.families = [];
    this.build();
    Util.log("REGION " + name + ", " + this.position + ", " + this.commonName);
	}
	neighbor(region, direction) {
		this.neighbors[region] = direction;
	}
  build() {
    Util.log("BEGIN building Region " + this.name);
    if(this.selectable) {
      let i = Math.max(Math.round(this.population / 1000), 3);
      console.log("families for " + this.name + ":" + i);
      while(i-- >= 0) Family.build(this);
    }
    Util.log("END building Region " + this.name + " " + this.families.length + " families");
    return this;
  }
	toString() {
		return this.name;
	}
  people(p) {
    this.population = p;
    return this;
  }
  land(s, l, x) {
    this.surface = s;
    this.land = parseInt(l * s);
    this.sea = parseInt(x * s);
    return this;
  }
  rich(w, f) {
    this.wealth = w;
    this.food = f;
    return this;
  }
  tax(t, m) {
    this.taxes = t;
    this.morale = m;
    return this;
  }
  getDescription() {
    return ""; // needed for i18n.js
  }
}

class UnitType {
	constructor(name, range, strength, movement) {
		this.name = name;
		this.strength = strength;
		this.movement = movement;
		this.range = range;
		this.attacks 	= {};	// type > quantity
		this.defenses = {}; // type > quantity
    Util.log("UNIT TYPE " + name);
	}
}

class Unit {
	constructor(type, region, owner) {
		this.type = type;
		this.region = region;
		this.garrison = false;
		this.owner = owner;
		this.morale = 100;
		this.fatigue = 100;
		this.experience = 0;
		this.movement = type.movement;
		this.strength = type.strength;
		this.range = type.range;
    Util.log("UNIT " + type.name);
	}
}

class Person {
	constructor(name, gender, father, mother, family) {
		this.name = name;
		this.gender = gender;
		this.father = father;
		this.mother = mother;
		this.push(family);	
		this.region = (mother ? mother.region : (father ? father.region : null));
		this.age = 0; // in turns: game starts at january 900, player starts at between -168 and -180
		this.death = 0; // in turns
		this.wealth = 0;
		this.health = 100;
		this.kidnapper = null;
		this.spouse = null;
    this.children = [];
    this.face = 0;
		this.skills = this.family.skills.copy(.1);
    this.relations = {}; // person > level?
		Util.log("PERSON " + this.name);
	}
  toString() {
    return this.name 
         + (this.family ? " of " + this.family : "") 
         + (this.father ? ", born to " + this.father.name : "") 
         + (this.mother ? ", from " + this.mother.name : "") 
         + (this.children.length > 0 ? " with " + this.children.length + " children" : "")
         ;
  }
	getSiblings() {
    if(!this.family) return [];
	  return this.family.members.filter((x) => { 
      return (this.father && x.father && x.father == this.father) || (this.mother && x.mother && x.mother == this.mother) 
    });
	}
	getDescription() {
    return this.toString(); // needed for i18n.js
  }  
  sword(level) {
    let s = this.skills;
    if(level) {
      s.strength += parseInt(level * .5);
      s.agility += parseInt(level * .3);
      s.knowledge += parseInt(level * .2);
    }  
    return parseInt(s.strength * .5 + s.agility  * .3 + s.knowledge * .2);
  }
  bow(level) {
    let s = this.skills;
    if(level) {
      s.strength += parseInt(level * .3);
      s.agility += parseInt(level * .4);
      s.knowledge += parseInt(level * .3);
    }  
    return parseInt(s.strength * .3 + s.agility  * .4 + s.knowledge * .3);
  }
  horse(level) {
    let s = this.skills;
    if(level) {
      s.strength += parseInt(level * .4);
      s.agility += parseInt(level * .2);
      s.knowledge += parseInt(level * .4);
    }  
    return parseInt(s.strength * .4 + s.agility  * .2 + s.knowledge * .4);
  }
  prayer(level) {
    let s = this.skills;
    if(level) {
      s.strength += parseInt(level *  .1);
      s.charisma += parseInt(level *  .6);
      s.knowledge += parseInt(level * .3);
    }  
    return parseInt(s.strength * .1 + s.charisma * .6 + s.knowledge * .3);
  }
  reading(level) {
    let s = this.skills;
    if(level) {
      s.charisma += parseInt(level *  .3);
      s.knowledge += parseInt(level * .7);
    }  
    return parseInt(s.charisma * .3 + s.knowledge * .7);
  }
  music(level) {
    let s = this.skills;
    if(level) {
      s.agility += parseInt(level *  .2);
      s.charisma += parseInt(level *  .6);
      s.knowledge += parseInt(level * .2);
    }  
    return parseInt(s.agility * .2 + s.charisma * .6 + s.knowledge * .2);
  }
  getSubjects() {
    return { "sword": this.sword(), 
             "bow": this.bow(), 
             "horse": this.horse(), 
             "prayer": this.prayer(), 
             "reading": this.reading(), 
             "music": this.music() };
  }
  push(family) {    
		if(family) {
      family.members.push(this);	
      this.align = family.align;
      this.family = family;
    } else {
      this.align = (father ? father.align : (mother ? mother.align : null));      
    }  
  }
}

class Relation {
	constructor(from, upto, type, strength) { 
		this.from = from;
		this.upto = upto;
		this.type = type;
		this.strength = strength;
	}
}
