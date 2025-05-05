import k from "../kaplayCtx";
import { screenWidth, screenHeight } from "../kaplayCtx";

export default function spinningScene() {
    const wheelWidth = 600;
    const wheelX = screenWidth / 2 - 403;
    const wheelY = screenHeight / 2 - 175;
    let speed = 0;
    
    let wheel = [];
    for (let x = 0; x <= 4; x++) {
        wheel.push(k.add([k.sprite("boxes", { frame: Math.floor(Math.random() * 7) }), k.pos(wheelX + 202 * x, wheelY)]))
    }
    let wheeldisplay = [];

    const bgcolor = [
        k.add([k.sprite("bgcolor"), k.pos(screenWidth / 2 - 614, screenHeight / 2 - 180)]),
        k.add([k.sprite("bgcolor"), k.pos(screenWidth / 2 + 404, screenHeight / 2 - 180)]),
    ];
    const wheelborder = k.add([k.sprite("wheelborder"), k.pos(screenWidth / 2 - 408, screenHeight / 2 - 180)]);
    const spinbutton = k.add([k.sprite("spinbutton"), k.pos(screenWidth / 2 - 75, screenHeight / 2 + 100), k.area()]);


    spinbutton.onClick(() => {
        if (speed == 0) {
            speed = (Math.random() * 20 + 180);
        }
    });

    k.onUpdate(() => {
        if (speed < .05 && speed != 0) {
            speed = 0;
            for (const box of wheel) {
                if (box.pos.x < screenWidth / 2 && box.pos.x > screenWidth / 2 - 200) {
                    console.log("a");
                }
            }    
        }
        for (const box of wheel) {
            box.pos.x -= speed;
            if (box.pos.x < wheelX - 200) {
                box.pos.x += 1010;
                box.frame = Math.floor(Math.random() * 7);
            }
        }
        if (speed > 0) {
            speed *= 0.99;
        }
    });
}

class Box {
    constructor() {
        this.rarity = Math.floor(Math.random() * 7)
        this.sprite = k.sprite("boxes", { frame: rarity })
    }
}