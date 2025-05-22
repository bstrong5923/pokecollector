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
    constructor(name, items, weights) {
        this.name = name;
        this.items = items;
        this.weights = weights;
    }
    add(x, y) {
        this.sprite = k.add([k.sprite("boxes", { frame: 0 }), k.pos(x, y), k.area()]);
        this.sprite.onClick(() => {
            whichPack[0] = this;
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
export const inventoryPage = [0];

export const packs = [
    new Pack("Pack 1", [new Box(0), new Box(1), new Box(2), new Box(3), new Box(4), new Box(5), new Box(6)], [0.6, 0.25, 0.11, 0.04, 0.012, 0.0035, 0.0006]),
    new Pack("Pack 2", [new Box(), new Box(), new Box()], [0.1, 0.3, 0.6]),
    new Pack("Pack 3", [new Box(), new Box(), new Box()], [0.1, 0.3, 0.6]),
    ];
export const packsPage = [0];
export const whichPack = [new Pack("0", [], [])];