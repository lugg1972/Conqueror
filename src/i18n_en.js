let MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
let LEVELS = { "Hard": 100, "Difficult": 500, "Average": 1000, "Easy": 2000 };
let SKILLS = { "scarce": 10, "meager": 25, "average": 50, "noticeable": 75, "great": 100 };
let MEASURES = { "scarce": 100,	"meager": 200, "modest": 500,	"average": 1000, "adequate": 2000, "noticeable": 5000, "substantial": 10000 };
let EXTENSIONS = { "tiny": 100,	"little": 200, "limited": 500, "average": 1000, "moderate": 2000, "large": 5000,	"huge": 10000 };
let PEOPLE = { "tiny": 1000,	"little": 2000, "limited": 5000, "average": 10000, "moderate": 20000, "large": 50000,	"huge": 100000 };
let AGES = { "infant": 7, "little": 14, "young": 20, "adult": 30, "mature": 40, "old": 50, "ancient": 100 };
let HEALTH = { "deathbed": 5, "ill": 10, "sick": 20, "unwell": 50, "healthy": 80 };
let FAMILY_SIZE = { "tiny": 5, "little": 10, "large": 20, "huge": 50 };
let EMPTY = "Empty";

Region.prototype.getDescription = function() {
  return this.parse(HTML.p("${this.name} is a ${Util.find(EXTENSIONS, this.surface)} region "
                          + "of ${Util.find(MEASURES, this.population)} population, "
                          + "with ${Util.find(MEASURES, this.wealth)} wealth and "
                          + "${Util.find(MEASURES, this.food)} reserves.")
                    + HTML.p("Its land is ${Util.find(EXTENSIONS, this.land)}"
                            + (this.sea ? " and sea borders it for a ${Util.find(EXTENSIONS, this.sea)} stretch " : "") + ".")
                    + (this.owner ? HTML.p("${this.family.name} family controls it with a ${Util.find(MEASURES, this.taxes)} taxation.") : "")
                    + HTML.p("People's morale is ${Util.find(MEASURES, this.morale)}."));
}

Person.prototype.getDescription = function() {
  let s = this.getSiblings(); 
  return this.parse(HTML.p("${this.name} is born on ${MONTHS[this.age % TURNS]}"
                          + ", " + (s.length > 0 ? Util.order(s.sort((a, b) => { a.age > b.age }).indexOf(this)) + " of " + s.length + " children " : "only child")
                          + (this.father ? " of ${this.father}" : "") + (this.mother ? " and ${this.mother}" : "") + ".")
                   + HTML.p("He is ${Util.find(MEASURES, this.sword(0))} with the sword, ${Util.find(MEASURES, this.bow(0))} with the bow, "
                          + "${Util.find(MEASURES, this.horse(0))} on horse, ${Util.find(MEASURES, this.prayer(0))} in prayers, "
                          + "${Util.find(MEASURES, this.reading(0))} at reading and ${Util.find(MEASURES, this.music(0))} in music.")       
                   );       
}

Family.prototype.getDescription = function() {
  return this.parse(HTML.p("${this.name} is a ${Util.find(FAMILY_SIZE, this.members.length)} family"
                           + (this.head ? " headed by ${this.head.name}" : "") 
                           + (this.title ? " of ${this.title} rank" : "")
                           + " with members of ${Util.find(SKILLS, this.skills.strength)} strength, "
                           + " ${Util.find(SKILLS, this.skills.charisma)} charisma, "
                           + " ${Util.find(SKILLS, this.skills.agility)} agility and  "
                           + " ${Util.find(SKILLS, this.skills.knowledge)} knowledge.")
                   + HTML.p("It has ${Util.find(MEASURES, this.wealth)} wealth and ${Util.find(MEASURES, this.getPower())} power.")       
                   );
}