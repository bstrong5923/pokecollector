import k from "./kaplayCtx";

export class Box {
    constructor() {
        this.rarity = Math.floor(Math.random() * 7); // random rarity
    }
    add(x, y) {
        this.sprite = k.add([k.sprite("boxes", { frame: this.rarity }), k.pos(x, y)]); // k.add
    }
}

export const inventory = [];