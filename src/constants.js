import k from "./kaplayCtx";
import { kScreenWidth, kScreenHeight } from "./kaplayCtx";
import { format } from "date-fns";

export const canvas = document.querySelector("canvas");

let hoveringPriority = false;

export function shortenNumber(num) {
    // Letters
    const letters = ["", "[", "{", "]", "}", "\\\\", "|", "S"];
    let threshold = 1;
    let decimals = 0;
    while (num >= threshold * 1000) {
        decimals = 2;
        if (num >= threshold * 10000) {
            decimals = 1;
        }
        threshold *= 1000;
    }
    return Math.floor(num / threshold * (10 ** decimals)) / (10 ** decimals) + letters[Math.log(threshold) / Math.log(1000)];

    // // commas
    // let result = num + "";
    // const commas = Math.floor(Math.log(num) / Math.log(1000));
    // for (let c = commas; c > 0; c--) {
    //     result = result.substring(0, result.length - c * 3) + "," + result.substring(result.length - c * 3);
    // }
    // return result;
}

export const packsowned = [0, 0, 0];
export let money = 10000;
export function subtractMoney(amount) {
    money -= amount;
}
export function addMoney(amount) {
    money += amount;
}

export let inventory = [];
export let sortStyle = "Time ^";
export function setSortStyle(style) {
    sortStyle = style;
}

export let stacking = 1;
export function toggleStacking() {
    page = 0;
    if (stacking == 0) {
        stacking = 1;
    }
    else {
        stacking = 0;
    }
}
export let stackedIndexes = [];
export let inventoryStacked = [];

function sortItemsOldest(items) {
    for (let i = 0; i < items.length; i++) {
        let min = i;
        for (let j = i + 1; j < items.length; j++) {
            if (items[j].dateCreated > items[min].dateCreated) {
                min = j;
            }
        }
        items.unshift(items.splice(min, 1)[0]);
    }
    return items;
}
function sortItemsNewest(items) {
    for (let i = 0; i < items.length; i++) {
        let min = i;
        for (let j = i + 1; j < items.length; j++) {
            if (items[j].dateCreated < items[min].dateCreated) {
                min = j;
            }
        }
        items.unshift(items.splice(min, 1)[0]);
    }
    return items;
}
function sortItemsMostExpensive(items) {
    for (let i = 0; i < items.length; i++) {
        let min = i;
        for (let j = i + 1; j < items.length; j++) {
            if (items[j].value < items[min].value) {
                min = j;
            }
        }
        items.unshift(items.splice(min, 1)[0]);
    }
    return items;
}
function sortItemsLeastExpensive(items) {
    for (let i = 0; i < items.length; i++) {
        let min = i;
        for (let j = i + 1; j < items.length; j++) {
            if (items[j].value > items[min].value) {
                min = j;
            }
        }
        items.unshift(items.splice(min, 1)[0]);
    }
    return items;
}
function sortItemsHighestIndex(items) {
    for (let i = 0; i < items.length; i++) {
        let min = i;
        for (let j = i + 1; j < items.length; j++) {
            if (items[j].pokemon.indexOrder < items[min].pokemon.indexOrder) {
                min = j;
            }
        }
        items.unshift(items.splice(min, 1)[0]);
    }
    return items;
}
function sortItemsLowestIndex(items) {
    for (let i = 0; i < items.length; i++) {
        let min = i;
        for (let j = i + 1; j < items.length; j++) {
            if (items[j].pokemon.indexOrder > items[min].pokemon.indexOrder) {
                min = j;
            }
        }
        items.unshift(items.splice(min, 1)[0]);
    }
    return items;
}
export function sortInventory() {
    inventory = sortItemsHighestIndex(inventory);
    if (sortStyle == "Time ^") {
        inventory = sortItemsOldest(inventory);
    }
    else if (sortStyle == "Time v") {
        inventory = sortItemsNewest(inventory);
    }
    else if (sortStyle == "Value v") {
        inventory = sortItemsLeastExpensive(inventory);
    }
    else if (sortStyle == "Value ^") {
        inventory = sortItemsMostExpensive(inventory);
}
    else if (sortStyle == "Index v") {
        inventory = sortItemsLowestIndex(inventory);
    }

    stackedIndexes = [];
    inventoryStacked = [];
    if (stacking == 1) {
        for (let i = 0; i < inventory.length; i++) {
            let add = true;
            for (let j = 0; j < stackedIndexes.length; j++) {
                if (inventory[i].stacksWith(inventory[stackedIndexes[j][0]])) {
                    stackedIndexes[j].push(i);
                    add = false;
                    break;
                }
            }
            if (add) {
                stackedIndexes.push([i])
            }
        }
        for (const stack of stackedIndexes) {
            inventoryStacked.push(inventory[stack[0]]);
        }
    }
    else {
        for (let i = 0; i < inventory.length; i++) {
            inventoryStacked.push(inventory[i]);
            stackedIndexes.push([i]);
        }
    }
    

    // // Print inventory for testing
    // let print = "";
    // let n = 0;
    // for (const item of inventory) {
    //     print += n + ": " + item.name + ", ";
    //     n++;
    // }
    // console.log(print);
}

export const menuHeight = 130;
export const screenWidth = kScreenWidth;
export const screenHeight = kScreenHeight - menuHeight;

export let page = 0;
let currentScene = "packs";
export function go(scene) {
    currentScene = scene;
    k.go(scene + "Scene");
}

export let displayIndex = null;
export function changeDisplayIndex(num) {
    displayIndex += num;
}

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
                page = 0;
                go(button.text); // run the scene associated with it
            }
        });

        buttons.push(button); // add it to buttons
    }

    // money display in top left
    const moneydisplay = k.add([k.text("*" + shortenNumber(money), { size: 18, font: "pkmn"}), k.pos(10, 10)]);

    k.onUpdate(() => {
        moneydisplay.text = "*" + shortenNumber(money); // update money display

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
const shinyNames = ["", "Shiny ", "Rare Shiny ", "Epic Shiny "];
const genderless = [81, 82, 100, 101, 120, 121, 132, 137, 144, 145, 146, 150, 151, 201, 233, 243, 244, 245, 249, 250, 251, 299, 343, 344, 374, 375, 376, 377, 378, 379, 380, 381, 382, 383, 384, 385, 386, 436, 437, 479, 480, 481, 482, 483, 484, 485, 486, 487, 488, 489, 490, 491, 492, 493, 494, 599, 600, 601, 615, 622, 623, 646, 647, 648, 649, 703, 707, 716, 717, 718, 719, 720, 721, 772, 773, 774, 777, 781, 801, 802, 807, 808, 809, 888, 889, 890, 891, 892, 893, 894, 895, 896, 897, 898, 905, 906, 907, 908, 909, 910, 911, 1010, 1011, 1012, 1013, 1014, 1015, 1016, 1017, 1018, 1019, 1020, 1021, 1022, 1023, 1024, 1025]; // indexes of genderless pokemon
const maleonlys = [32, 33, 34, 106, 128, 383, 534, 538, 539, 641, 1007]; // indexes of always-male pokemon
const femaleonlys = [29, 30, 31, 113, 115, 124, 241, 380, 488, 549, 629, 640, 1008]; // indexes of always-female pokemon
const genderImportant = [84, 85, 154, 198, 255, 256, 257, 449, 450, 521, 592, 593, 668, 678, 876, 902, 916]; // indexes of pokemon that have different gender forms
const pokedex = {};
for (let x = 0; x <= 19; x++) {
    let num = Math.floor(x / 2);
    if (x % 2 == 1) {
        num += "v";
    }

    await fetch("images/pokemon/pokemon_icons_" + num + ".json") // chatgpt's work
        .then((response) => response.json())  // chatgpt's work
        .then((data) => { // fill pokedex with pokemon data
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
                    regionalForm = "Alolan ";
                    if (index > 4000) {
                        regionalForm = "Galarian ";
                        if (index > 600) {
                            regionalForm = "Hisuian ";
                        }
                    }
                    index %= 1000;
                }
                name += regionalForm + pokemonNames[index - 1];
                let indexOrder = index;
                if (regionalForm != "") {
                    indexOrder += 0.5;
                }

                let scale = 160 / sprite.frame.w;
                if (scale > 115 / sprite.frame.h) {
                    scale = 115 / sprite.frame.h;
                }
                scale -= (scale - 5) / 2.5;

                let shinyLevel = 0; // figure out what level of shiny it is
                let i = sprite.filename.indexOf("s");
                let i2 = sprite.filename.indexOf("_");
                if (i == cutoff) {
                    shinyLevel = 1;
                }
                else if (i2 != -1) {
                    shinyLevel = parseInt(sprite.filename.charAt(i2 + 1));
                    const baseform = pokedex[sprite.filename.substring(0, i2)];
                    scale = baseform.scale;
                }
                name = shinyNames[shinyLevel] + name;

                let w = sprite.frame.w * scale;
                let h = sprite.frame.h * scale;
                if (i2 != -1) {
                    h += scale ** 3.3 / 8;
                    if (index == 41) {
                        h -= 20;
                    }
                }

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
                
                pokedex[sprite.filename] = {
                    name: name,
                    index: index,
                    indexOrder: indexOrder,
                    codename: sprite.filename,
                    shinyLevel: shinyLevel,
                    gender: gender,
                    scale: scale,
                    width: w,
                    height: h,
                    regionalForm: regionalForm,
                };
            }
        })
        .then(() => { console.log("pokedex loading " + (x + 1) + "/20"); });
}

function getPokemon(index) {
    let shinyText = "";
    if (Math.random() * 2048 < 1 && pokedex[index + "s"] != null) {
        shinyText = "s";
        if (pokedex[index + "_1"] != null && Math.random() * 2 < 1) { 
            shinyText = "_1";
        }
        if (Math.random() * 7 < 2 && pokedex[index + "_2"] != null) {
            shinyText = "_2";
            if (Math.random() * 7 < 2 && pokedex[index + "_3"] != null) {
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


const shinyMults = [1, 777, 3333, 17777];

// item in a pack
export class Box {
    constructor(pokemon, rarity, basevalue) {
        this.rarity = rarity;
        this.x = 0;
        this.y = 0;
        this.sprite = [];
        this.pokemon = pokemon;
        this.name = pokemon.name;
        this.scale = 1;
        this.opacity = 1;
        this.basevalue = basevalue;
        this.dateCreated = format(new Date(), 'yyyyMMddHHmmss');

        this.value = basevalue * shinyMults[this.pokemon.shinyLevel];
    }
    add(x, y) {
        this.sprite = [
            k.add([k.sprite("boxes", { frame: this.rarity }), k.pos(x, y), k.opacity(this.opacity), k.area(), k.scale(this.scale)]),
            k.add([k.text("*" + shortenNumber(this.value), { size: 14 * this.scale, font: "pkmn" }), k.pos(x + 10 * this.scale, y + 128 * this.scale), k.opacity(this.opacity), k.layer("3")]),
            k.add([k.sprite(this.pokemon.codename), k.pos(x + (200 - this.pokemon.width)  * this.scale / 2, y + (150 - this.pokemon.height)  * this.scale / 2), k.scale(this.pokemon.scale * this.scale), k.opacity(this.opacity)]),
        ];
        if (this.pokemon.shinyLevel > 0) {
            this.sprite.push(k.add([k.sprite("shinies", { frame: this.pokemon.shinyLevel - 1 }), k.pos(x + 160 * this.scale, y + 9 * this.scale), k.opacity(this.opacity), k.scale(this.scale * 2)]));
        }
        this.x = x;
        this.y = y;
        this.sprite[0].onUpdate(() => {
            if (this.sprite[0].isHovering() && currentScene != "spinning" && !hoveringPriority) {
                canvas.style.cursor = "pointer";
            }
        });
        this.sprite[0].onClick(() => {
            if (currentScene == "inventory" && !hoveringPriority) {
                this.display();
            }
        });
    }
    display() {
        displayIndex = inventoryStacked.indexOf(this);
        go("display");
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
        if (this.sprite.length > 0) {
            this.destroySprite();
            this.add(tempx, tempy);
        }
    }
    stacksWith(other) {
        if (other.pokemon.name == this.pokemon.name && other.name == this.name && other.value == this.value) {
            return true;
        }
        return false;
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
                go("spinning");
                currentScene = "spinning";
            }
        });
        this.sprite.onUpdate(() => {
            if (this.sprite.isHovering()) {
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
    getAll() {
        const rarityChances = [];
        let total = 0;
        for (const weight of this.rarityWeights) {
            total += weight;
        }
        for (let w = 0; w < this.rarityWeights.length; w++) {
            let totalOfWeight = 0; // how many are there of this rarity?
            for (const item of this.items) {
                if (item[1] == w) {
                    totalOfWeight += item[2];
                }
            }
            rarityChances.push(Math.round((this.rarityWeights[w] * 1000000 / total) / totalOfWeight) / 10000); // chance for each item of this rarity (to 4 decimal places)
        }

        let boxes = [];
        const chancesDict = {};
        const chances = [];
        for (const item of this.items) {
            boxes.push(new Box(pokedex["" + item[0]], item[1], item[3]));
            chancesDict[item[0]] = rarityChances[item[1]] * item[2];
        }
        boxes = sortItemsLeastExpensive(boxes);
        for (const box of boxes) {
            chances.push(chancesDict[box.pokemon.index]);
        }
        return [boxes, chances];
    }
}

// list of packs
const standardRarityWeights = [0.49, 0.32, 0.14, 0.015, 0.004, 0.0007, 0.00005];
export const packs = [
    new Pack(0, "Pack 1", 250, [[1, 3, 1, 1180], [10, 0, 1, 26], [23, 0, 1, 39], [25, 2, 1, 477], [27, 0, 1, 41], [35, 1, 1, 109], [41, 0, 1, 38], [48, 0, 1, 28], [54, 1, 1, 108], [60, 0, 1, 23], [74, 0, 1, 31], [63, 1, 1, 103], [84, 0, 1, 31], [88, 1, 1, 108], [83, 2, 1, 426], [96, 1, 1, 112], [102, 1, 1, 91], [109, 1, 1, 109], [116, 2, 1, 396], [120, 1, 1, 96], [132, 2, 1, 300], [133, 0, 1, 30], [125, 2, 1, 438], [128, 2, 1, 438], [137, 2, 1, 471], [145, 5, 1, 52032], [147, 4, 1, 4213], [150, 5, .5, 57147], [151, 6, 1, 618322]], standardRarityWeights),
    new Pack(1, "Pack 2", 250, [[4, 3, 1, 1226], [13, 0, 1, 27], [21, 0, 1, 34], [25, 2, 1, 477], [29, 0, 1, 33], [37, 1, 1, 108], [43, 0, 1, 21], [50, 0, 1, 30], [56, 1, 1, 109], [66, 0, 1, 39], [77, 0, 1, 35], [72, 1, 1, 111], [86, 0, 1, 27], [92, 1, 1, 113], [111, 2, 1, 468], [98, 1, 1, 105], [104, 1, 1, 102], [114, 1, 1, 106], [123, 2, 1, 511], [129, 1, 1, 70], [132, 2, 1, 300], [133, 0, 1, 30], [126, 2, 1, 432], [131, 2, 1, 502], [142, 2, 1, 650], [146, 5, 1, 52803], [147, 4, 1, 4213], [150, 5, .5, 57147], [151, 6, 1, 618322]], standardRarityWeights),
    new Pack(2, "Pack 3", 250, [[7, 3, 1, 1109], [16, 0, 1, 32], [19, 0, 1, 29], [25, 2, 1, 477], [32, 0, 1, 33], [39, 1, 1, 114], [46, 0, 1, 27], [52, 0, 1, 37], [58, 1, 1, 118], [69, 0, 1, 25], [79, 0, 1, 34], [81, 1, 1, 107], [90, 0, 1, 30], [95, 1, 1, 121], [115, 2, 1, 441], [100, 1, 1, 103], [108, 1, 1, 114], [118, 1, 1, 102], [124, 2, 1, 386], [138, 1, 1, 98], [132, 2, 1, 300], [133, 0, 1, 30], [127, 2, 1, 461], [140, 2, 1, 447], [143, 2, 1, 578], [144, 5, 1, 51894], [147, 4, 1, 4213], [150, 5, .5, 57147], [151, 6, 1, 618322]], standardRarityWeights),
];
export let whichPack = 0;

// // Fill inventory for testing
// for (let i = 0; i < 100; i++) {
//     inventory.push(packs[0].getRandom());
// }


// used in inventoryScene and packsScene and stuff to format items into rows and cols
export function displayItems(items, scene, xmin, xmax, ymin, ymax, width, height, spacingHorizontal, spacingVertical, pageArrowName="pagearrow", pageArrowScale=1, leftX=xmin, leftY=ymin, rightX=xmin, rightY=ymin) {
    const itemsPerRow = Math.floor((xmax - xmin + spacingHorizontal) / (width + spacingHorizontal));
    const rowsPerPage = Math.floor((ymax - ymin + spacingVertical) / (height + spacingVertical));
    const itemsPerPage = itemsPerRow * rowsPerPage;

    const xindent = (xmax - xmin + spacingHorizontal - itemsPerRow * (width + spacingHorizontal)) / 2;
    const yindent = (ymax - ymin + spacingVertical - rowsPerPage * (height + spacingVertical)) / 2;

    let pagearrowleft;
    let pagearrowright;
    if (page != 0) {
        pagearrowleft = k.add([k.sprite(pageArrowName + "left"), k.pos(leftX, leftY), k.area(), k.layer("1"), k.scale(pageArrowScale)]);
        pagearrowleft.onClick(() => { 
            page--;
            go(scene);
        });
    }
    if (items.length > (page + 1) * itemsPerPage) {
        pagearrowright = k.add([k.sprite(pageArrowName + "right"), k.pos(rightX, rightY), k.area(), k.layer("1"), k.scale(pageArrowScale)]);
        pagearrowright.onClick(() => { 
            page++;
            go(scene);
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
        if (currentScene == "inventory") {
            item.setScale(1);
            if (stacking && stackedIndexes[i].length > 1) {
                k.add([k.text("x" + stackedIndexes[i].length, { size: 14, font: "pkmn" }), k.pos(x + 168 - 14 * Math.floor(Math.log10(stackedIndexes[i].length)), y + 128), k.layer("3")])
            }
        }
        x += width + spacingHorizontal;
        if (x > xmax - width - xindent) {
            y += height + spacingVertical;
            x = xmin + xindent;
        }
    }
}

// AUTO SPIN SETTINGS
export const autospinsettings = {
    sellUnder: 0,
}

function positionInput(x, y) {
    const input = document.getElementById("numberInput");

    let scale = window.innerWidth / kScreenWidth;
    let correctY = (window.innerHeight - kScreenHeight * scale) / 2;
    let correctX = 0;
    if (scale > window.innerHeight / kScreenHeight) {
        scale = window.innerHeight / kScreenHeight;
        correctY = 0;
        correctX = (window.innerWidth - kScreenWidth * scale) / 2;
    }

    input.style.top = y * scale + correctY;
    input.style.left = x * scale + correctX;
}

export function showNumberInput(settingKey, x, y) { // Chat gpt's work
    const input = document.getElementById("numberInput");
    input.value = ""; // clear previous input
    input.style.display = "block";
    input.focus();
    
    positionInput(x, y);

    window.addEventListener('resize', () => {
        positionInput(x, y);
    });

    // Strip non-numeric input as user types
    input.addEventListener("input", () => {
        input.value = input.value.replace(/[^0-9]/g, "");
    });

    input.addEventListener("keydown", function onKeyDown(e) {
        if (e.key === "Enter") {
        const value = parseInt(input.value.trim(), 10);

        if (!isNaN(value)) {
            input.style.display = "none";
            input.blur();

            // Save value to settings object or localStorage
            autospinsettings[settingKey] = value;
            console.log(`Set ${settingKey} to ${value}`);
        }

        go("autospinsettings");

        // Clean up listener after use
        input.removeEventListener("keydown", onKeyDown);
        }
    });
}