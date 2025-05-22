import k from "./kaplayCtx";

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
    constructor(name, items) {
        this.name = name;
        this.items = items;
    }
    add(x, y) {
        this.sprite = k.add([k.sprite("boxes", { frame: 0 }), k.pos(x, y), k.area()]);
        this.sprite.onClick(() => {
            whichPack[0] = this;
            k.go("spinningScene")
        });
    }
    getRandom() {
        return this.items[Math.floor(Math.random() * this.items.length)].clone();
    }
}

export const inventory = [];
export const inventoryPage = [0];

export const packs = [
    new Pack("Pack 1", [new Box(), new Box(), new Box()]),
    new Pack("Pack 2", [new Box(), new Box(), new Box()]),
    new Pack("Pack 3", [new Box(), new Box(), new Box()]),
    ];
export const packsPage = [0];
export const whichPack = [new Pack("0", [])];