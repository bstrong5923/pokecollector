import k from "./kaplayCtx";
import { screenWidth, screenHeight, menuHeight,  page } from "./menu";

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

export class Pack {
    constructor(index, name, items, weights) {
        this.index = index;
        this.name = name;
        this.items = items;
        this.weights = weights;
    }
    add(x, y) {
        this.sprite = k.add([k.sprite("boxes", { frame: 0 }), k.pos(x, y), k.area()]);
        this.sprite.onClick(() => {
            whichPack[0] = this.index;
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

export const inventory = [];

export const packs = [
    new Pack(0, "Pack 1", [new Box(0), new Box(1), new Box(2), new Box(3), new Box(4), new Box(5), new Box(6)], [0.6, 0.25, 0.11, 0.04, 0.012, 0.0035, 0.0006]),
    new Pack(1, "Pack 2", [new Box(), new Box(), new Box()], [0.1, 0.3, 0.6]),
    new Pack(2, "Pack 3", [new Box(), new Box(), new Box()], [0.1, 0.3, 0.6]),
    ];
export const whichPack = [0];

export function displayItems(items, scene, xmin, xmax, ymin, ymax, width, height, spacing) {
    const itemsPerRow = Math.floor((xmax - xmin + spacing) / (width + spacing));
    const rowsPerPage = Math.floor((ymax - ymin + spacing) / (height + spacing));
    const itemsPerPage = itemsPerRow * rowsPerPage;

    if (page[0] != 0) {
        const button = k.add([k.sprite("pagearrowleft"), k.pos(xmin + 10, (ymin + ymax) / 2 - 75), k.opacity(0.8), k.area(), k.layer("1")]);
        button.onClick(() => { 
            page[0]--;
            k.go(scene);
        });
    }
    if (items.length > (page[0] + 1) * itemsPerPage) {
        const button = k.add([k.sprite("pagearrowright"), k.pos(xmax - 160, (ymin + ymax) / 2 - 75), k.opacity(0.8), k.area(), k.layer("1")]);
        button.onClick(() => { 
            page[0]++;
            k.go(scene);
        });
    }

    let x = xmin
    let y = ymin;
    for (let i = page[0] * itemsPerPage; i < items.length && i < (page[0] + 1) * itemsPerPage; i++) {
        const item = items[i];
        item.add(x, y);
        x += width + spacing;
        if (x > xmax) {
            y += height + spacing;
            x = xmin;
        }
    }
}