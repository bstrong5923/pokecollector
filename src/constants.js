import k from "./kaplayCtx";
import { kScreenWidth, kScreenHeight } from "./kaplayCtx";

export const canvas = document.querySelector("canvas");

let hoveringPriority = false;

export const inventory = [];
export const packsowned = [0, 0, 0];
export let money = 100000;
export function subtractMoney(amount) {
    money -= amount;
}
export function addMoney(amount) {
    money += amount;
}

export const menuHeight = 130;
export const screenWidth = kScreenWidth
export const screenHeight = kScreenHeight - menuHeight;

let page = 0;
let currentScene = "packs";
export function go(scene) {
    k.go(scene + "Scene");
    currentScene = scene;
}

export let displayItem = null;

// menu of pages to go to
let menuOn = true;
export function turnMenuOn() {
    menuOn = true;
}
export function turnMenuOff() {
    menuOn = false;
}
export function menu(current) {
    k.add([k.rect(1920, menuHeight - 10), k.pos(0, 0), k.color(20, 20, 20)]);
    k.add([k.rect(1920, 10), k.pos(0, menuHeight - 10), k.color(0, 0, 0)]);

    const scenes = ["packs", "inventory"];
    const widths = [165, 203];

    // totalWidth is the width from the start of the first to the end of the last, with spacing
    let totalWidth = -150;
    for (const w of widths) {
        totalWidth += w + 150;
    }

    const buttons = [];

    let nextX = kScreenWidth / 2 - totalWidth / 2; // where the first one should start
    
    const fontSize = 30;
    for (let i = 0; i < scenes.length; i++) {
        const button = k.add([ // create the button
            k.text(scenes[i], {size: fontSize, width: widths[i], font: "pkmn", color: "red"}),  // text is the scene, size and width determine hitbox
            k.pos(nextX, (menuHeight - 10) / 2 - fontSize / 2),
            k.area() // hitbox
        ]);
        nextX += widths[i] + 150; // where the next one should start
        button.onClick(() => { // when the button is clicked:
            if (button.text != current && menuOn) { // if it is not the current scene
                k.go(button.text + "Scene"); // run the scene associated with it
                page = 0;
                currentScene = button.text;
            }
        });

        buttons.push(button); // add it to buttons
    }

    // money display in top left
    const moneydisplay = k.add([k.text("*" + money, { size: 18, font: "pkmn"}), k.pos(10, 10)]);

    k.onUpdate(() => {
        moneydisplay.text = "*" + money; // update money display

        canvas.style.cursor = "default";
            for (const button of buttons) {
                if (button.isHovering()) {
                    canvas.style.cursor = "pointer"; 
                }
            }
    })
}

// POKEMON DICTIONARY
const pokemonNames = [
    "Bulbasaur", "Ivysaur", "Venusaur", "Charmander", "Charmeleon", "Charizard", "Squirtle", "Wartortle", "Blastoise", "Caterpie", "Metapod", "Butterfree", "Weedle", "Kakuna", "Beedrill", "Pidgey", "Pidgeotto", "Pidgeot", "Rattata", "Raticate", "Spearow", "Fearow", "Ekans", "Arbok", "Pikachu", "Raichu", "Sandshrew", "Sandslash", "Nidoran♀", "Nidorina", "Nidoqueen", "Nidoran♂", "Nidorino", "Nidoking", "Clefairy", "Clefable", "Vulpix", "Ninetales", "Jigglypuff", "Wigglytuff", "Zubat", "Golbat", "Oddish", "Gloom", "Vileplume", "Paras", "Parasect", "Venonat", "Venomoth", "Diglett", "Dugtrio", "Meowth", "Persian", "Psyduck", "Golduck", "Mankey", "Primeape", "Growlithe", "Arcanine", "Poliwag", "Poliwhirl", "Poliwrath", "Abra", "Kadabra", "Alakazam", "Machop", "Machoke", "Machamp", "Bellsprout", "Weepinbell", "Victreebel", "Tentacool", "Tentacruel", "Geodude", "Graveler", "Golem", "Ponyta", "Rapidash", "Slowpoke", "Slowbro", "Magnemite", "Magneton", "Farfetch’d", "Doduo", "Dodrio", "Seel", "Dewgong", "Grimer", "Muk", "Shellder", "Cloyster", "Gastly", "Haunter", "Gengar", "Onix", "Drowzee", "Hypno", "Krabby", "Kingler", "Voltorb", "Electrode", "Exeggcute", "Exeggutor", "Cubone", "Marowak", "Hitmonlee", "Hitmonchan", "Lickitung", "Koffing", "Weezing", "Rhyhorn", "Rhydon", "Chansey", "Tangela", "Kangaskhan", "Horsea", "Seadra", "Goldeen", "Seaking", "Staryu", "Starmie", "Mr. Mime", "Scyther", "Jynx", "Electabuzz", "Magmar", "Pinsir", "Tauros", "Magikarp", "Gyarados", "Lapras", "Ditto", "Eevee", "Vaporeon", "Jolteon", "Flareon", "Porygon", "Omanyte", "Omastar", "Kabuto", "Kabutops", "Aerodactyl", "Snorlax", "Articuno", "Zapdos", "Moltres", "Dratini", "Dragonair", "Dragonite", "Mewtwo", "Mew", // GEN 1
    "Chikorita", "Bayleef", "Meganium", "Cyndaquil", "Quilava", "Typhlosion", "Totodile", "Croconaw", "Feraligatr", "Sentret", "Furret", "Hoothoot", "Noctowl", "Ledyba", "Ledian", "Spinarak", "Ariados", "Crobat", "Chinchou", "Lanturn", "Pichu", "Cleffa", "Igglybuff", "Togepi", "Togetic", "Natu", "Xatu", "Mareep", "Flaaffy", "Ampharos", "Bellossom", "Marill", "Azumarill", "Sudowoodo", "Politoed", "Hoppip", "Skiploom", "Jumpluff", "Aipom", "Sunkern", "Sunflora", "Yanma", "Wooper", "Quagsire", "Espeon", "Umbreon", "Murkrow", "Slowking", "Misdreavus", "Unown", "Wobbuffet", "Girafarig", "Pineco", "Forretress", "Dunsparce", "Gligar", "Steelix", "Snubbull", "Granbull", "Qwilfish", "Scizor", "Shuckle", "Heracross", "Sneasel", "Teddiursa", "Ursaring", "Slugma", "Magcargo", "Swinub", "Piloswine", "Corsola", "Remoraid", "Octillery", "Delibird", "Mantine", "Skarmory", "Houndour", "Houndoom", "Kingdra", "Phanpy", "Donphan", "Porygon2", "Stantler", "Smeargle", "Tyrogue", "Hitmontop", "Smoochum", "Elekid", "Magby", "Miltank", "Blissey", "Raikou", "Entei", "Suicune", "Larvitar", "Pupitar", "Tyranitar", "Lugia", "Ho-Oh", "Celebi", // GEN 2
    "Treecko", "Grovyle", "Sceptile", "Torchic", "Combusken", "Blaziken", "Mudkip", "Marshtomp", "Swampert", "Poochyena", "Mightyena", "Zigzagoon", "Linoone", "Wurmple", "Silcoon", "Beautifly", "Cascoon", "Dustox", "Lotad", "Lombre", "Ludicolo", "Seedot", "Nuzleaf", "Shiftry", "Taillow", "Swellow", "Wingull", "Pelipper", "Ralts", "Kirlia", "Gardevoir", "Surskit", "Masquerain", "Shroomish", "Breloom", "Slakoth", "Vigoroth", "Slaking", "Nincada", "Ninjask", "Shedinja", "Whismur", "Loudred", "Exploud", "Makuhita", "Hariyama", "Azurill", "Nosepass", "Skitty", "Delcatty", "Sableye", "Mawile", "Aron", "Lairon", "Aggron", "Meditite", "Medicham", "Electrike", "Manectric", "Plusle", "Minun", "Volbeat", "Illumise", "Roselia", "Gulpin", "Swalot", "Carvanha", "Sharpedo", "Wailmer", "Wailord", "Numel", "Camerupt", "Torkoal", "Spoink", "Grumpig", "Spinda", "Trapinch", "Vibrava", "Flygon", "Cacnea", "Cacturne", "Swablu", "Altaria", "Zangoose", "Seviper", "Lunatone", "Solrock", "Barboach", "Whiscash", "Corphish", "Crawdaunt", "Baltoy", "Claydol", "Lileep", "Cradily", "Anorith", "Armaldo", "Feebas", "Milotic", "Castform", "Kecleon", "Shuppet", "Banette", "Duskull", "Dusclops", "Tropius", "Chimecho", "Absol", "Wynaut", "Snorunt", "Glalie", "Spheal", "Sealeo", "Walrein", "Clamperl", "Huntail", "Gorebyss", "Relicanth", "Luvdisc", "Bagon", "Shelgon", "Salamence", "Beldum", "Metang", "Metagross", "Regirock", "Regice", "Registeel", "Latias", "Latios", "Kyogre", "Groudon", "Rayquaza", "Jirachi", "Deoxys", // GEN 3
    "Turtwig", "Grotle", "Torterra", "Chimchar", "Monferno", "Infernape", "Piplup", "Prinplup", "Empoleon", "Starly", "Staravia", "Staraptor", "Bidoof", "Bibarel", "Kricketot", "Kricketune", "Shinx", "Luxio", "Luxray", "Budew", "Roserade", "Cranidos", "Rampardos", "Shieldon", "Bastiodon", "Burmy", "Wormadam", "Mothim", "Combee", "Vespiquen", "Pachirisu", "Buizel", "Floatzel", "Cherubi", "Cherrim", "Shellos", "Gastrodon", "Ambipom", "Drifloon", "Drifblim", "Buneary", "Lopunny", "Mismagius", "Honchkrow", "Glameow", "Purugly", "Chingling", "Stunky", "Skuntank", "Bronzor", "Bronzong", "Bonsly", "Mime Jr.", "Happiny", "Chatot", "Spiritomb", "Gible", "Gabite", "Garchomp", "Munchlax", "Riolu", "Lucario", "Hippopotas", "Hippowdon", "Skorupi", "Drapion", "Croagunk", "Toxicroak", "Carnivine", "Finneon", "Lumineon", "Mantyke", "Snover", "Abomasnow", "Weavile", "Magnezone", "Lickilicky", "Rhyperior", "Tangrowth", "Electivire", "Magmortar", "Togekiss", "Yanmega", "Leafeon", "Glaceon", "Gliscor", "Mamoswine", "Porygon-Z", "Gallade", "Probopass", "Dusknoir", "Froslass", "Rotom", "Uxie", "Mesprit", "Azelf", "Dialga", "Palkia", "Heatran", "Regigigas", "Giratina", "Cresselia", "Phione", "Manaphy", "Darkrai", "Shaymin", "Arceus", // GEN 4
    "Victini", "Snivy", "Servine", "Serperior", "Tepig", "Pignite", "Emboar", "Oshawott", "Dewott", "Samurott", "Patrat", "Watchog", "Lillipup", "Herdier", "Stoutland", "Purrloin", "Liepard", "Pansage", "Simisage", "Pansear", "Simisear", "Panpour", "Simipour", "Munna", "Musharna", "Pidove", "Tranquill", "Unfezant", "Blitzle", "Zebstrika", "Roggenrola", "Boldore", "Gigalith", "Woobat", "Swoobat", "Drilbur", "Excadrill", "Audino", "Timburr", "Gurdurr", "Conkeldurr", "Tympole", "Palpitoad", "Seismitoad", "Throh", "Sawk", "Sewaddle", "Swadloon", "Leavanny", "Venipede", "Whirlipede", "Scolipede", "Cottonee", "Whimsicott", "Petilil", "Lilligant", "Basculin", "Sandile", "Krokorok", "Krookodile", "Darumaka", "Darmanitan", "Maractus", "Dwebble", "Crustle", "Scraggy", "Scrafty", "Sigilyph", "Yamask", "Cofagrigus", "Tirtouga", "Carracosta", "Archen", "Archeops", "Trubbish", "Garbodor", "Zorua", "Zoroark", "Minccino", "Cinccino", "Gothita", "Gothorita", "Gothitelle", "Solosis", "Duosion", "Reuniclus", "Ducklett", "Swanna", "Vanillite", "Vanillish", "Vanilluxe", "Deerling", "Sawsbuck", "Emolga", "Karrablast", "Escavalier", "Foongus", "Amoonguss", "Frillish", "Jellicent", "Alomomola", "Joltik", "Galvantula", "Ferroseed", "Ferrothorn", "Klink", "Klang", "Klinklang", "Tynamo", "Eelektrik", "Eelektross", "Elgyem", "Beheeyem", "Litwick", "Lampent", "Chandelure", "Axew", "Fraxure", "Haxorus", "Cubchoo", "Beartic", "Cryogonal", "Shelmet", "Accelgor", "Stunfisk", "Mienfoo", "Mienshao", "Druddigon", "Golett", "Golurk", "Pawniard", "Bisharp", "Bouffalant", "Rufflet", "Braviary", "Vullaby", "Mandibuzz", "Heatmor", "Durant", "Deino", "Zweilous", "Hydreigon", "Larvesta", "Volcarona", "Cobalion", "Terrakion", "Virizion", "Tornadus", "Thundurus", "Reshiram", "Zekrom", "Landorus", "Kyurem", "Keldeo", "Meloetta", "Genesect", // GEN 5
    "Chespin", "Quilladin", "Chesnaught", "Fennekin", "Braixen", "Delphox", "Froakie", "Frogadier", "Greninja", "Bunnelby", "Diggersby", "Fletchling", "Fletchinder", "Talonflame", "Scatterbug", "Spewpa", "Vivillon", "Litleo", "Pyroar", "Flabébé", "Floette", "Florges", "Skiddo", "Gogoat", "Pancham", "Pangoro", "Furfrou", "Espurr", "Meowstic", "Honedge", "Doublade", "Aegislash", "Spritzee", "Aromatisse", "Swirlix", "Slurpuff", "Inkay", "Malamar", "Binacle", "Barbaracle", "Skrelp", "Dragalge", "Clauncher", "Clawitzer", "Helioptile", "Heliolisk", "Tyrunt", "Tyrantrum", "Amaura", "Aurorus", "Sylveon", "Hawlucha", "Dedenne", "Carbink", "Goomy", "Sliggoo", "Goodra", "Klefki", "Phantump", "Trevenant", "Pumpkaboo", "Gourgeist", "Bergmite", "Avalugg", "Noibat", "Noivern", "Xerneas", "Yveltal", "Zygarde", "Diancie", "Hoopa", "Volcanion", // GEN 6
    "Rowlet", "Dartrix", "Decidueye", "Litten", "Torracat", "Incineroar", "Popplio", "Brionne", "Primarina", "Pikipek", "Trumbeak", "Toucannon", "Yungoos", "Gumshoos", "Grubbin", "Charjabug", "Vikavolt", "Crabrawler", "Crabominable", "Oricorio", "Cutiefly", "Ribombee", "Rockruff", "Lycanroc", "Wishiwashi", "Mareanie", "Toxapex", "Mudbray", "Mudsdale", "Dewpider", "Araquanid", "Fomantis", "Lurantis", "Morelull", "Shiinotic", "Salandit", "Salazzle", "Stufful", "Bewear", "Bounsweet", "Steenee", "Tsareena", "Comfey", "Oranguru", "Passimian", "Wimpod", "Golisopod", "Sandygast", "Palossand", "Pyukumuku", "Type: Null", "Silvally", "Minior", "Komala", "Turtonator", "Togedemaru", "Mimikyu", "Bruxish", "Drampa", "Dhelmise", "Jangmo-o", "Hakamo-o", "Kommo-o", "Tapu Koko", "Tapu Lele", "Tapu Bulu", "Tapu Fini", "Cosmog", "Cosmoem", "Solgaleo", "Lunala", "Nihilego", "Buzzwole", "Pheromosa", "Xurkitree", "Celesteela", "Kartana", "Guzzlord", "Necrozma", "Magearna", "Marshadow", "Poipole", "Naganadel", "Stakataka", "Blacephalon", "Zeraora", "Meltan", "Melmetal", // GEN 7
    "Grookey", "Thwackey", "Rillaboom", "Scorbunny", "Raboot", "Cinderace", "Sobble", "Drizzile", "Inteleon", "Skwovet", "Greedent", "Rookidee", "Corvisquire", "Corviknight", "Blipbug", "Dottler", "Orbeetle", "Nickit", "Thievul", "Gossifleur", "Eldegoss", "Wooloo", "Dubwool", "Chewtle", "Drednaw", "Yamper", "Boltund", "Rolycoly", "Carkol", "Coalossal", "Applin", "Flapple", "Appletun", "Silicobra", "Sandaconda", "Cramorant", "Arrokuda", "Barraskewda", "Toxel", "Toxtricity", "Sizzlipede", "Centiskorch", "Clobbopus", "Grapploct", "Sinistea", "Polteageist", "Hatenna", "Hattrem", "Hatterene", "Impidimp", "Morgrem", "Grimmsnarl", "Obstagoon", "Perrserker", "Cursola", "Sirfetch’d", "Mr. Rime", "Runerigus", "Milcery", "Alcremie", "Falinks", "Pincurchin", "Snom", "Frosmoth", "Stonjourner", "Eiscue", "Indeedee", "Morpeko", "Cufant", "Copperajah", "Dracozolt", "Arctozolt", "Dracovish", "Arctovish", "Duraludon", "Dreepy", "Drakloak", "Dragapult", "Zacian", "Zamazenta", "Eternatus", "Kubfu", "Urshifu", "Zarude", "Regieleki", "Regidrago", "Glastrier", "Spectrier", "Calyrex", "Wyrdeer", "Kleavor", "Ursaluna", "Basculegion", "Sneasler", "Overqwil", "Enamorus", // GEN 8
    "Sprigatito", "Floragato", "Meowscarada", "Fuecoco", "Crocalor", "Skeledirge", "Quaxly", "Quaxwell", "Quaquaval", "Lechonk", "Oinkologne", "Tarountula", "Spidops", "Nymble", "Lokix", "Hoppip", "Skiploom", "Jumpluff", "Fletchling", "Fletchinder", "Talonflame", "Pawmi", "Pawmo", "Pawmot", "Tandemaus", "Maushold", "Tauruntula", "Spidops", "Nacli", "Naclstack", "Garganacl", "Charcadet", "Armarouge", "Ceruledge", "Tadbulb", "Bellibolt", "Wattrel", "Kilowattrel", "Maschiff", "Mabosstiff", "Shroodle", "Grafaiai", "Bramblin", "Brambleghast", "Toedscool", "Toedscruel", "Klawf", "Capsakid", "Scovillain", "Rellor", "Rabsca", "Flittle", "Espathra", "Tinkatink", "Tinkatuff", "Tinkaton", "Wiglett", "Wugtrio", "Bombirdier", "Finizen", "Palafin", "Varoom", "Revavroom", "Cyclizar", "Orthworm", "Glimmet", "Glimmora", "Greavard", "Houndstone", "Flamigo", "Cetoddle", "Cetitan", "Veluza", "Dondozo", "Tatsugiri", "Annihilape", "Clodsire", "Farigiraf", "Dudunsparce", "Kingambit", "Great Tusk", "Scream Tail", "Brute Bonnet", "Flutter Mane", "Slither Wing", "Sandy Shocks", "Iron Treads", "Iron Bundle", "Iron Hands", "Iron Jugulis", "Iron Moth", "Iron Thorns", "Frigibax", "Arctibax", "Baxcalibur", "Gimmighoul", "Gholdengo", "Wo-Chien", "Chien-Pao", "Ting-Lu", "Chi-Yu", "Roaring Moon", "Iron Valiant", "Koraidon", "Miraidon", "Walking Wake", "Iron Leaves", "Dipplin", "Poltchageist", "Sinistcha", "Okidogi", "Munkidori", "Fezandipiti", "Ogerpon", "Archaludon", "Hydrapple", "Gouging Fire", "Raging Bolt", "Iron Boulder", "Iron Crown", "Terapagos", "Pecharunt", // GEN 9
];
const shinyNames = ["", "Shiny", "Rare Shiny", "Epic Shiny"];
const genderless = [81, 82, 100, 101, 120, 121, 132, 137, 144, 145, 146, 150, 151, 201, 233, 243, 244, 245, 249, 250, 251, 299, 343, 344, 374, 375, 376, 377, 378, 379, 380, 381, 382, 383, 384, 385, 386, 436, 437, 479, 480, 481, 482, 483, 484, 485, 486, 487, 488, 489, 490, 491, 492, 493, 494, 599, 600, 601, 615, 622, 623, 646, 647, 648, 649, 703, 707, 716, 717, 718, 719, 720, 721, 772, 773, 774, 777, 781, 801, 802, 807, 808, 809, 888, 889, 890, 891, 892, 893, 894, 895, 896, 897, 898, 905, 906, 907, 908, 909, 910, 911, 1010, 1011, 1012, 1013, 1014, 1015, 1016, 1017, 1018, 1019, 1020, 1021, 1022, 1023, 1024, 1025]; // indexes of genderless pokemon
const maleonlys = [32, 33, 34, 106, 128, 383, 534, 538, 539, 641, 1007]; // indexes of always-male pokemon
const femaleonlys = [29, 30, 31, 113, 115, 124, 241, 380, 488, 549, 629, 640, 1008]; // indexes of always-female pokemon
const genderImportant = [84, 85, 154, 198, 255, 256, 257, 449, 450, 521, 592, 593, 668, 678, 876, 902, 916]; // indexes of pokemon that have different gender forms
const pokedex = {};
for (let x = 2; x <= 19; x++) {
    let num = Math.floor(x / 2);
    if (x % 2 == 1) {
        num += "v";
    }

    fetch("images/pokemon/pokemon_icons_" + num + ".json") // chatgpt's work
        .then((response) => response.json())  // chatgpt's work
        .then((data) => { // chatgpt's work
            const frames = data.textures[0].frames; // frames is the list of pokemon with x, y, w, h, and other stuff in the json

            for (const sprite of frames) { // for each pokemon sprite
                let name = "";
                let cutoff = sprite.filename.length; // figure out where the pokedex number ends

                const possibleCutoffs = [sprite.filename.indexOf("-"), sprite.filename.indexOf("s"), sprite.filename.indexOf("_")];
                for (const c of possibleCutoffs) {
                    if (c != -1 && c < cutoff) {
                        cutoff = c;
                    }
                }

                let regionalForm = "";
                let index = parseInt(sprite.filename.substring(0, cutoff));
                if (index > 2000) {
                    regionalForm = "Alolan";
                    if (index > 4000) {
                        regionalForm = "Galarian";
                        if (index > 600) {
                            regionalForm = "Hisuian";
                        }
                    }
                    index %= 1000;
                }
                name += regionalForm + " " + pokemonNames[index - 1];

                let shinyLevel = 0; // figure out what level of shiny it is
                if (sprite.filename.indexOf("s") == cutoff) {
                    shinyLevel = 1;
                }
                else if (sprite.filename.indexOf("_") != -1) {
                    shinyLevel = sprite.filename.charAt(sprite.filename.indexOf("_") + 1);
                }
                name = shinyNames[shinyLevel] + " " + name;

                let gender = "50";
                if (genderless.indexOf(index) != -1) {
                    gender = "genderless";
                }
                else if (maleonlys.indexOf(index) != -1) {
                    gender = "male";
                }
                else if (femaleonlys.indexOf(index) != -1) {
                    gender = "female";
                }
                else if (genderImportant.indexOf(index) != -1) {
                    if (sprite.filename.indexOf("-f") != -1) {
                        gender = "female";
                    }
                    else {
                        gender = "male";
                    }
                }

                let scale = 180 / sprite.frame.w;
                if (scale > 130 / sprite.frame.h) {
                    scale = 130 / sprite.frame.h;
                }
                scale = Math.floor(scale);
                
                pokedex[sprite.filename] = {
                    name: name,
                    index: index,
                    codename: sprite.filename,
                    shinyLevel: shinyLevel,
                    gender: gender,
                    scale: scale,
                    width: sprite.frame.w * scale,
                    height: sprite.frame.h * scale,
                    regionalForm: regionalForm,
                };
            }
        });
}

function getPokemon(index) {
    let shinyText = "";
    if (Math.random() * 512 < 1) {
        shinyText = "s";
        if (Math.random() * 8 < 3) {
            shinyText = "_2";
            if (Math.random() * 7 < 2) {
                shinyText = "_3";
            }
        }
    }
    let result = pokedex[index + shinyText];
    if (result.gender.length == 2) {
        result.gender = "male";
        if (Math.random() * 100 < parseInt(result.gender)) {
            result.gender = "female";
        }
    }
    return result;
}


// item in a pack
export class Box {
    constructor(pokemon, rarity, value) {
        this.rarity = rarity;
        this.value = value;
        this.x = 0;
        this.y = 0;
        this.sprite = [];
        this.pokemon = pokemon;
        this.scale = 1;
        this.opacity = 1;
    }
    add(x, y) {
        this.sprite = [
            k.add([k.sprite("boxes", { frame: this.rarity }), k.pos(x, y), k.opacity(this.opacity), k.area(), k.scale(this.scale)]),
            k.add([k.text("*" + this.value, { size: 14 * this.scale, font: "pkmn" }), k.pos(x + 10 * this.scale, y + 128 * this.scale), k.opacity(this.opacity), k.layer("3")]),
            k.add([k.sprite(this.pokemon.codename), k.pos(x + (200 - this.pokemon.width)  * this.scale / 2, y + (150 - this.pokemon.height)  * this.scale / 2), k.scale(this.pokemon.scale * this.scale), k.opacity(this.opacity)]),
        ];
        this.x = x;
        this.y = y;
        this.sprite[0].onUpdate(() => {
            if (this.sprite[0].isHovering() && currentScene != "spinning" && !hoveringPriority) {
                canvas.style.cursor = "pointer";
            }
        });
        this.sprite[0].onClick(() => {
            if (currentScene != "spinning" && !hoveringPriority) {
                this.display();
            }
        });
    }
    display() {
        displayItem = this;
        k.go("displayScene");
        currentScene = "display";
    }
    move(changex, changey) {
        for (const comp of this.sprite) {
            comp.pos.x += changex;
            comp.pos.y += changey;
        }
        this.x += changex;
        this.y += changey;
    }
    destroySprite() {
        for (const comp of this.sprite) {
            comp.destroy();
        }
    }
    setOpacity(val) {
        this.opacity = val;
    }
    setScale(val) {
        this.scale = val;
        const tempx = this.x;
        const tempy = this.y;
        this.destroySprite();
        this.add(tempx, tempy);
    }
}

// pack of pokemon
export class Pack {
    constructor(index, name, price, items, rarityWeights) {
        this.index = index;
        this.name = name;
        this.price = price;
        this.items = items;
        this.rarityWeights = rarityWeights;
    }
    add(x, y) {
        this.sprite = k.add([k.sprite("pack"), k.pos(x, y), k.area()]);
        this.sprite.onClick(() => {
            if (!hoveringPriority) {
                whichPack = this.index;
                k.go("spinningScene");
                currentScene = "spinning";
            }
        });
        this.sprite.onUpdate(() => {
            if (this.sprite.isHovering() && !hoveringPriority) {
                canvas.style.cursor = "pointer";
            }
        });
    }
    getRandom() {
        let totalWeight = 0;
        for (const weight of this.rarityWeights) {
            totalWeight += weight;
        }
        const random = Math.random() * totalWeight;
        let cumulative = 0;
      
        for (let i = 0; i < this.rarityWeights.length; i++) {
          cumulative += this.rarityWeights[i];
          if (random < cumulative) {
            let totalWeightOfRarity = 0;
            const itemsOfRarity = [];
            for (const item of this.items) {
                if (item[1] == i) {
                    itemsOfRarity.push(item);
                    totalWeightOfRarity += item[2];
                }
            }
            const randomOfRarity = Math.random() * totalWeightOfRarity;
            let cumulativeOfRarity = 0;
            for (const item of itemsOfRarity) {
                cumulativeOfRarity += item[2];
                if (randomOfRarity < cumulativeOfRarity) {
                    return new Box(getPokemon(item[0]), item[1], item[3]);
                }
            }
          }
        }
    }
}

// list of packs
export const packs = [
    new Pack(0, "Pack 1", 100, [[1, 3, 1, 1908], [10, 0, 1, 26], [23, 0, 1, 39], [25, 2, 3, 712], [27, 0, 1, 41], [35, 1, 1, 108], [41, 0, 1, 38], [48, 0, 1, 28], [147, 4, 1, 8736], [150, 5, 1, 57147], [151, 6, 1, 618322]], [0.45, 0.3, 0.16, 0.05, 0.0077, 0.0014, 0.0004]),
    new Pack(1, "Pack 2", 100, [[4, 3, 1, 2091], [13, 0, 1, 27], [21, 0, 1, 34], [25, 2, 3, 712], [29, 0, 1, 33], [37, 1, 1, 102], [43, 0, 1, 21], [50, 0, 1, 30], [147, 4, 1, 8736], [150, 5, 1, 57147], [151, 6, 1, 618322]], [0.45, 0.3, 0.16, 0.05, 0.0077, 0.0014, 0.0004]),
    new Pack(2, "Pack 3", 100, [[7, 3, 1, 1709], [16, 0, 1, 32], [19, 0, 1, 29], [25, 2, 3, 712], [32, 0, 1, 33], [39, 1, 1, 105], [46, 0, 1, 27], [52, 0, 1, 37], [147, 4, 1, 8736], [150, 5, 1, 57147], [151, 6, 1, 618322]], [0.45, 0.3, 0.16, 0.05, 0.0077, 0.0014, 0.0004]),
];
export let whichPack = 0;

// // Fill inventory for testing
// for (let i = 0; i < 100; i++) {
//     inventory.push(packs[0].getRandom());
// }


// used in inventoryScene and packsScene and stuff to format items into rows and cols
export function displayItems(items, scene, xmin, xmax, ymin, ymax, width, height, spacing) {
    const itemsPerRow = Math.floor((xmax - xmin + spacing) / (width + spacing));
    const rowsPerPage = Math.floor((ymax - ymin + spacing) / (height + spacing));
    const itemsPerPage = itemsPerRow * rowsPerPage;

    const xindent = (xmax - xmin + spacing - itemsPerRow * (width + spacing)) / 2;
    const yindent = (ymax - ymin + spacing - rowsPerPage * (height + spacing)) / 2;

    let pagearrowleft;
    let pagearrowright;
    if (page != 0) {
        pagearrowleft = k.add([k.sprite("pagearrowleft"), k.pos(xmin + 10, (ymin + ymax) / 2 - 75), k.opacity(0.8), k.area(), k.layer("1")]);
        pagearrowleft.onClick(() => { 
            page--;
            k.go(scene);
        });
    }
    if (items.length > (page + 1) * itemsPerPage) {
        pagearrowright = k.add([k.sprite("pagearrowright"), k.pos(xmax - 160, (ymin + ymax) / 2 - 75), k.opacity(0.8), k.area(), k.layer("1")]);
        pagearrowright.onClick(() => { 
            page++;
            k.go(scene);
        });
    }

    k.onUpdate(() => {
        hoveringPriority = false;
        if (pagearrowleft != null && pagearrowleft.isHovering()) {
            canvas.style.cursor = "pointer";
            hoveringPriority = true;
        }
        if (pagearrowright != null && pagearrowright.isHovering()) {
            canvas.style.cursor = "pointer";
            hoveringPriority = true;
        }
    });

    let x = xmin + xindent;
    let y = ymin + yindent;
    for (let i = page * itemsPerPage; i < items.length && i < (page + 1) * itemsPerPage; i++) {
        const item = items[i];
        item.add(x, y);
        x += width + spacing;
        if (x > xmax - width - xindent) {
            y += height + spacing;
            x = xmin + xindent;
        }
    }
}
