import k from "./kaplayCtx";
import { kScreenWidth, kScreenHeight } from "./kaplayCtx";

export const inventory = [];
export let money = 10000;

export const menuHeight = 130;
export const screenWidth = kScreenWidth
export const screenHeight = kScreenHeight - menuHeight;

let page = 0;

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
            k.text(scenes[i], {size: fontSize, width: widths[i], font: "pkmn"}),  // text is the scene, size and width determine hitbox
            k.pos(nextX, (menuHeight - 10) / 2 - fontSize / 2),
            k.area() // hitbox
        ]);
        nextX += widths[i] + 150; // where the next one should start

        button.onClick(() => { // when the button is clicked:
            if (button.text != current && menuOn) { // if it is not the current scene
                k.go(button.text + "Scene"); // run the scene associated with it
                page = 0;
            }
        });

        buttons.push(button); // add it to buttons
        
    }

    // money display in top left
    k.add([k.text("*" + money, { size: 18, font: "pkmn"}), k.pos(10, 10)]);

}

// item in a pack
export class Box {
    constructor(rarity = Math.floor(Math.random() * 7)) {
        this.rarity = rarity;
    }
    add(x, y) {
        this.sprite = k.add([k.sprite("boxes", { frame: this.rarity }), k.pos(x, y), k.opacity(1)]); // k.add
    }
    clone() {
        return new Box(this.rarity)
    }
}

// pack of pokemon
export class Pack {
    constructor(index, name, items, weights) {
        this.index = index;
        this.name = name;
        this.items = items;
        this.weights = weights;
    }
    add(x, y) {
        this.sprite = k.add([k.sprite("pack"), k.pos(x, y), k.area()]);
        this.sprite.onClick(() => {
            whichPack = this.index;
            k.go("spinningScene")
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
    new Pack(0, "Pack 1", [new Box(0), new Box(1), new Box(2), new Box(3), new Box(4), new Box(5), new Box(6)], [0.45, 0.3, 0.16, 0.03, 0.0077, 0.0014, 0.0004]),
    new Pack(1, "Pack 2", [new Box(), new Box(), new Box()], [0.1, 0.3, 0.6]),
    new Pack(2, "Pack 3", [new Box(), new Box(), new Box()], [0.1, 0.3, 0.6]),
    ];
export let whichPack = 0;

// used in inventoryScene and packsScene and stuff to format items into rows and cols
export function displayItems(items, scene, xmin, xmax, ymin, ymax, width, height, spacing) {
    const itemsPerRow = Math.floor((xmax - xmin + spacing) / (width + spacing));
    const rowsPerPage = Math.floor((ymax - ymin + spacing) / (height + spacing));
    const itemsPerPage = itemsPerRow * rowsPerPage;

    const xindent = (xmax - xmin + spacing - itemsPerRow * (width + spacing)) / 2;
    const yindent = (ymax - ymin + spacing - rowsPerPage * (height + spacing)) / 2;

    if (page != 0) {
        const button = k.add([k.sprite("pagearrowleft"), k.pos(xmin + 10, (ymin + ymax) / 2 - 75), k.opacity(0.8), k.area(), k.layer("1")]);
        button.onClick(() => { 
            page--;
            k.go(scene);
        });
    }
    if (items.length > (page + 1) * itemsPerPage) {
        const button = k.add([k.sprite("pagearrowright"), k.pos(xmax - 160, (ymin + ymax) / 2 - 75), k.opacity(0.8), k.area(), k.layer("1")]);
        button.onClick(() => { 
            page++;
            k.go(scene);
        });
    }

    let x = xmin + xindent;
    let y = ymin + yindent;
    for (let i = page * itemsPerPage; i < items.length && i < (page + 1) * itemsPerPage; i++) {
        const item = items[i];
        item.add(x, y);
        x += width + spacing;
        if (x > xmax) {
            y += height + spacing;
            x = xmin + xindent;
        }
    }
}