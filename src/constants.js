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


// item in a pack
export class Box {
    constructor(name, rarity, value) {
        this.rarity = rarity;
        this.value = value;
        this.x = 0;
        this.y = 0;
        this.sprite = [];
        this.name = name;
    }
    add(x, y) {
        this.sprite = [
            k.add([k.sprite("boxes", { frame: this.rarity }), k.pos(x, y), k.opacity(1), k.area()]),
            k.add([k.text("*" + this.value, { size: 14, font: "pkmn" }), k.pos(x + 10, y + 128), k.opacity(1), k.layer("3")]),
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
        for (const comp of this.sprite) {
            comp.opacity = val;
        }
    }
    setScale(val) {
        for (const comp of this.sprite) {
            if (comp == this.sprite[1]) {
                comp.pos.x = this.sprite[0].pos.x + 10 * val;
                comp.pos.y = this.sprite[0].pos.y + 128 * val;
                comp.textSize = 14 * val;
            }
            else {
                comp.scale = val;
            }
        }
    }
    clone() {
        return new Box(this.name, this.rarity, this.value)
    }
}

// pack of pokemon
export class Pack {
    constructor(index, name, price, items, weights) {
        this.index = index;
        this.name = name;
        this.price = price;
        this.items = items;
        this.weights = weights;
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
        for (const weight of this.weights) {
            totalWeight += weight;
        }
        const random = Math.random() * totalWeight;
        let cumulative = 0;
      
        for (let i = 0; i < this.items.length; i++) {
          cumulative += this.weights[i];
          if (random < cumulative) {
            return this.items[i].clone();
          }
        }
    }
}

// list of packs
export const packs = [
    new Pack(0, "Pack 1", 100, [new Box("Common", 0, 31), new Box("Uncommon", 1, 86), new Box("Rare", 2, 202), new Box("Starter", 3, 764), new Box("Pseudo Legendary", 4, 2181), new Box("Legendary", 5, 11587), new Box("Mythical", 6, 76189)], [0.45, 0.3, 0.16, 0.05, 0.0077, 0.0014, 0.0004]),
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

// POKEMON DICTIONARY
const pokemonNames = [];
const pokedex = {};
for (let x = 2; x <= 19; x++) {
    let num = Math.floor(x / 2);
    if (x % 2 == 1) {
        num += "v";
    }

    console.log("images/pokemon/pokemon_icons_" + num + ".json");
    const atlas = {}; // empty dictionary
    fetch("images/pokemon/pokemon_icons_" + num + ".json") // chatgpt's work
        .then((response) => response.json())  // chatgpt's work
        .then((data) => { // chatgpt's work
            const frames = data.textures[0].frames; // frames is the list of pokemon with x, y, w, h, and other stuff in the json

            for (const sprite of frames) { // for each pokemon sprite
                pokedex[sprite.filename] = {
                    name: 
                };
            }
        });

    k.loadSpriteAtlas("images/pokemon/pokemon_icons_" + num + ".png", atlas);
}