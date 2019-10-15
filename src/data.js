let WIDTH  = window.innerWidth  || document.documentElement.clientWidth  || Document.body.clientWidth;
let HEIGHT = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
let SIZE   = parseInt(.55 * Math.min(WIDTH, HEIGHT));

let CELTS 	= new Alignment("Celts", 20, new Skills( 30, 5, 30, 5 ));
CELTS.femaleNames = ["Aibreann","Aideen","Ailbe","Aileen","Ailis","Aislinn","Alannah","Alma","Aoibheann","Aoife","Aurnia","Banba","Betha","Bláthnaid","Brianna","Brigid","Bronagh","Caitlín","Cait","Caoilfhoinn","Caoimhe","Cara","Ciara","Cliona","Clodagh","Damhnait","Dana","Darerca","Doireann","Dearbhail","Deirdre","Dubheasa","Ealga","Eileen","Eilís","Eimear","Einin","Eithne","Elan","Erin","Etain","Ethna","Fiona","Fionnoula","Gobnait","Grainne","Granuaile","Ina","Iona","Iseult","Isleen","Macha","Maeve","Máire","Maoliosa","Muadnait","Múireann","Neasa","Nieve","Nollaig","Nora","Oona","Orlaith","Rhionnan","Rionach","Róisín","Sadhbh","Saoirse","Shannon","Shona","Síne","Sinéad","Siobhán"];
CELTS.maleNames = ["Aedan", "Angus", "Ailbe", "Ailill", "Alroy", "Ardan", "Art", "Bartley", "Bradan", "Breandan", "Brian", "Cabhan", "Cearnaigh", "Carrig", "Cathal", "Cearul", "Cian", "Ciaran", "Cillian", "Clearie", "Coilin", "Colm", "Colman", "Conall", "Conan", "Conchobhar", "Connla", "Cormac", "Daire", "Daithi", "Dalaigh", "Darcie", "Davin", "Deaglan", "Derry", "Desmond", "Dillon", "Donal", "Eamon", "Eirnin", "Emmet", "Ennis", "Eoghan", "Faolan", "Fergus", "Finbar", "Finn", "Glendan", "Hugh", "Iollan", "Kevan", "Liam", "Lochlann", "Lorcan", "Murtagh", "Niall", "Nollaig", "Orin", "Padraign", "Peadar", "Pearse", "Quinlan", "Quinn", "Redmond", "Reilly", "Riordan", "Ronan", "Seamus", "Sean", "Turlach", "Ultan"];
CELTS.clanNames = ["Cineal", "Corca", "Dal", "Muintear", "Siol", "Slioch", "Teallach", "Uì", "Cianacht", "Aes", "Feara", "Tuath"]; 
let NORMANS	= new Alignment("Normans", 10, new Skills( 50, 10, 5, 30 ));
NORMANS.femaleNames = [];
NORMANS.maleNames = [];
NORMANS.clanNames = ["Ahlberg", "Akerman", "Appelbyr", "Bager", "Bech", "Begbie", "Bergfalk", "Berglund", "Bergman", "Bergstrom", "Bjork", "Bjorkman", "Blom", "Borg", "Brant", "byquist", "Bystrom", "Carr", "Cason", "Dahl", "Dahlman", "Dalgaard", "Dam", "Erken", "Eklund", "Eld", "Engberg", "Erkens", "Fisker", "Forsberg", "Hagen", "Haig", "Hallman", "Haward", "Hjort", "Holt", "Lange", "Lindberg", "Lindstrom", "Liungborg", "Ljungman", "Lindquist", "Naess", "Nylund", "Nyquist", "Nystrom", "Nyberg", "Oman", "Ostberg", "Ostergard", "Solberg", "Stendahl", "Stenberg", "Strand", "Toft", "Voll"];
let SAXONS	= new Alignment("Saxons", 15, new Skills( 10, 30, 10, 30 ));
SAXONS.femaleNames = ["Aedre", "Aefentid", "Aefre" , "Alodia", "Annis" , "Ardith", "Arianrod", "Bernia", "Bletsung" , "Bysen", "Cathryn" , "Chelsea", "Claennis" , "Cwene", "Cyst" , "Darline", "Devona" , "Dohtor", "Eacnung" , "Eda", "Edith" , "Edlin", "Edmee" , "Edrys", "Eldrida" , "Esma", "Ifield" , "Lynet", "Mae", "Moira" , "Maida", "Megan" , "Nelda", "Odelia" , "Rowena", "Synne" , "Tayte", "Udele" , "Willa", "Wilona"];
SAXONS.maleNames = ["Ablenden", "Abrecan", "Acwellen", "Athelbald", "Ethelbert", "Ethelfrith", "Aldred", "Algar", "Almund", "Anbidian", "Ancenned", "Anfeald", "Anson", "Archard", "Archibald", "Arwyroe", "Atelic", "Awiergan", "Baldlice", "Bawdewyn", "Beaduring", "Beadurof", "Beorn", "Beornwulf", "Berhtwald", "Bestanden", "Betlic", "Bordan", "Bowdyn", "Bryce", "Caedmon", "Camden", "Cerdic", "Courtland", "Cuthbert", "Cyneheard", "Cynn", "Daegal", "Deogol", "Eadig", "Ealdian", "Egbert", "Edgar", "Edlin", "Edmond", "Edric", "Eldred", "Elmer", "Gaderian", "Galan", "Garberend", "Gareth", "Geoff", "Godric", "Godwine", "Graeme", "Grimbold", "Grindan", "Hengist", "Heorot", "Hilderinc", "Hlaford", "Hrypa", "Irwin", "Kendric", "Leof", "Lufian", "Magan", "Modig", "Nerian", "Norvel", "Odell", "Ord", "Ormod", "Orvin", "Osric", "Oswald", "Piers", "Pleoh", "Raedwald", "Rand", "Renweard", "Rinan", "Scand", "Sceotend", "Selwin", "Sherard", "Sigebert", "Strang", "Theomund", "Tolucan", "Torhte", "Tredan", "Wacian", "Waelfwulf", "Warian", "Wilbur", "Wurt", "Wulfgar", "Wyman", "Yrre"];
SAXONS.clanNames = ["Ackles" , "Aimar", "Aldane" , "Ashman", "Averne" , "Bargy", "Baygents" , "Beekman", "Blagdel" , "Bryer", "Burbidge", "Bux" , "Coish", "Corp" , "Cran", "Culbert" , "Downing", "Eamer" , "Fising", "Foland" , "Frink", "Hame" , "Hendestone", "Hingestone", "Himmer", "Ivey", "Kebel", "Lawford", "Lumb", "Morgade", "Rocholt", "Salt", "Sawmark", "Skipworeth", "Widkind", "Wikes" ];

// TODO: descriptions needed in i18n.js, but not available until data.js that is loaded after!
CELTS.description = "Celts are the ancient people that once roamed the British Isles free, battling with each other, pushed away by the Romans and then by the Saxons. They excel in the forests and the hills where they seldom can be beaten.";
NORMANS.description = "Normans are fearful, strong and ruthless people coming from the sea. They do not need to dodge hits, thinking they will go to heaven dying in battle.";
SAXONS.description = "Saxons are the rulers of the Kingdoms born after the Romans went away, always struggling among themselves and the Celts until the Normans show. Collectors of ancient knowledge and still regarded as lawful Lords on their lands.";


// name, align, owner, wealth, population, morale, food, land, sea, taxes
// "width: 75px; top: 216px; left: 216px;"
let REGIONS = [
	//new Region("Alt Clut", CELTS, Position.px(75, 216, 216), true).people(750).land(13447, .19, .30).rich(1000, 8000).tax(.30, .10),
  Region.as("Alt Clut", CELTS, Position.px(75, 216, 216), true).people(2150),
  //new Region("Alt Clut", CELTS, null, 1750, 13447, .19, .30, 1000, 9000, .30, .10, Position.px(75, 216, 216), true),
	new Region("Bernaccia", SAXONS, null, 2150, 9758, .24, .25, 2000, 15000, .25, .20, Position.px(54, 227, 318), true),
	new Region("Caer Baddan", SAXONS, null, 3450, 0, 0, 0, 0, 0, 0, 0, Position.px(40, 448, 312), true),
	new Region("Caer Celemion", SAXONS, null, 5700, 0, 0, 0, 0, 0, 0, 0, Position.px(61, 471, 336), true),		
	new Region("Caer Colun", NORMANS, null, 3600, 0, 0, 0, 0, 0, 0, 0, Position.px(56, 433, 425), true),
	new Region("Caer Gwinntuic", SAXONS, null, 4350, 0, 0, 0, 0, 0, 0, 0, Position.px(52, 495, 299), true),
	new Region("Caer Lerion", NORMANS, null, 3950, 0, 0, 0, 0, 0, 0, 0, Position.px(62, 389, 340, false), true),
	new Region("Caer Lundein", NORMANS, null, 10450, 0, 0, 0, 0, 0, 0, 0, Position.px(72, 442, 369, false), true),
	new Region("Caer Went", NORMANS, null, 8250, 0, 0, 0, 0, 0, 0, 0, Position.px(54, 396, 432, false), true),
	new Region("Cat", CELTS, null, 1850, 0, 0, 0, 0, 0, 0, 0, Position.px(84, 110,213), true),
	new Region("Ce", CELTS, null, 2350, 0, 0, 0, 0, 0, 0, 0, Position.px(80, 111, 268), true),
	new Region("Ceint", SAXONS, null, 3650, 0, 0, 0, 0, 0, 0, 0, Position.px(61, 487, 412), true),
	new Region("Circend", CELTS, null, 1950, 0, 0, 0, 0, 0, 0, 0, Position.px(72, 146, 264), true),
	new Region("Connaught", CELTS, null, 1650, 0, 0, 0, 0, 0, 0, 0, Position.px(97, 252, 58), true),
	new Region("Cornubia", CELTS, null, 1450, 0, 0, 0, 0, 0, 0, 0, Position.px(84, 528, 168), true),
	new Region("Cynwidion", NORMANS, null, 2350, 0, 0, 0, 0, 0, 0, 0, Position.px(56, 392, 378), true),
	new Region("Dal Riada", CELTS, null, 1650, 0, 0, 0, 0, 0, 0, 0, Position.px(99, 170, 162), true),
	new Region("Demetia", CELTS, null, 1850, 0, 0, 0, 0, 0, 0, 0, Position.px(66, 446, 210), true),
	new Region("Deywr", NORMANS, null, 2450, 0, 0, 0, 0, 0, 0, 0, Position.px(69, 297, 355, false), true),
	new Region("Dumnonia", CELTS, null, 1550, 0, 0, 0, 0, 0, 0, 0, Position.px(43, 503, 240), true),
	new Region("Dunotig", SAXONS, null, 1950, 0, 0, 0, 0, 0, 0, 0, Position.px(59, 242, 276), true),
	new Region("Elmet", NORMANS, null, 3100, 0, 0, 0, 0, 0, 0, 0, Position.px(57, 344, 334), true),
	new Region("Fib", CELTS, null, 1550, 0, 0, 0, 0, 0, 0, 0, Position.px(125, 61, 117), true),
	new Region("Fidach", CELTS, null, 4150, 0, 0, 0, 0, 0, 0, 0, Position.px(112, 52, 188), true),
	new Region("Fortriu", CELTS, null, 3250, 0, 0, 0, 0, 0, 0, 0, Position.px(85, 175, 229), true),
	new Region("Galwyddel", SAXONS, null, 4200, 0, 0, 0, 0, 0, 0, 0, Position.px(44, 366, 294), true),
	new Region("Glastenning", SAXONS, null, 5400, 0, 0, 0, 0, 0, 0, 0, Position.px(54, 486, 276), true),
	new Region("Gododdin", CELTS, null, 3100, 0, 0, 0, 0, 0, 0, 0, Position.px(68, 210, 270), true),
	new Region("Gwent", SAXONS, null, 4300, 0, 0, 0, 0, 0, 0, 0, Position.px(47, 448, 269), true),
	new Region("Gwynedd", CELTS, null, 3550, 0, 0, 0, 0, 0, 0, 0, Position.px(71, 371, 231), true),
	new Region("Leinster", NORMANS, null, 2950, 0, 0, 0, 0, 0, 0, 0, Position.px(95, 375, 86), true),
	new Region("Linnius", NORMANS, null, 1650, 0, 0, 0, 0, 0, 0, 0, Position.px(43, 353, 388), true),
	new Region("Meath", NORMANS, null, 2850, 0, 0, 0, 0, 0, 0, 0, Position.px(80, 328, 99), true),
	new Region("Munster", CELTS, null, 1650, 0, 0, 0, 0, 0, 0, 0, Position.px(114, 413, 9), true),
	new Region("Pengwern", SAXONS, null, 2950, 0, 0, 0, 0, 0, 0, 0, Position.px(67, 406, 295), true),
	new Region("Powys", CELTS, null, 2250, 0, 0, 0, 0, 0, 0, 0, Position.px(73, 399, 238), true),
	new Region("Rheged", SAXONS, null, 3600, 0, 0, 0, 0, 0, 0, 0, Position.px(71, 298, 296), true),
	new Region("Rhegin", SAXONS, null, 4900, 0, 0, 0, 0, 0, 0, 0, Position.px(70, 486, 374), true),
	new Region("Tomond", CELTS, null, 1750, 0, 0, 0, 0, 0, 0, 0, Position.px(94, 315, 15), true),
	new Region("Ulster", CELTS, null, 1850, 0, 0, 0, 0, 0, 0, 0, Position.px(79, 259, 127), true),
	Region.as("Ynys Arcaibh", null, Position.px(38, 11, 285), false),
	Region.as("Ynys Manau", null, Position.px(19, 311, 229), false),
	Region.as("Ynys Weith", null, Position.px(19, 529, 357), false)
];


let LAST    = "vendor";
let CURRENT = "vendor";

let SESSION = new Session();
