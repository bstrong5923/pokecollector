// import { onClick } from "/node_modules/kaplay/dist/declaration/events";
import k from "../kaplayCtx";
import { screenWidth, screenHeight } from "../kaplayCtx";

export default function spinning() {
    const wheelWidth = 600;
    const wheelX = screenWidth / 2 - 403;
    const wheelY = screenHeight / 2 - 175;
    let speed = 15;
    
    let wheel = [
        k.add([k.sprite("boxes", { frame: Math.floor(Math.random() * 7) }), k.pos(wheelX, wheelY)]),
        k.add([k.sprite("boxes", { frame: Math.floor(Math.random() * 7) }), k.pos(wheelX + 202, wheelY)]),
        k.add([k.sprite("boxes", { frame: Math.floor(Math.random() * 7) }), k.pos(wheelX + 404, wheelY)]),
        k.add([k.sprite("boxes", { frame: Math.floor(Math.random() * 7) }), k.pos(wheelX + 606, wheelY)]),
        k.add([k.sprite("boxes", { frame: Math.floor(Math.random() * 7) }), k.pos(wheelX + 808, wheelY)]),
    ];

    const wheelborder = k.add([k.sprite("wheelborder"), k.pos(screenWidth / 2 - 408, screenHeight / 2 - 180)]);
    const bgcolor = [
        k.add([k.sprite("bgcolor"), k.pos(screenWidth / 2 - 614, screenHeight / 2 - 180)]),
        k.add([k.sprite("bgcolor"), k.pos(screenWidth / 2 + 404, screenHeight / 2 - 180)]),
    ];
    const spinbutton = k.add([k.sprite("spinbutton"), k.pos(screenWidth / 2 - 75, screenHeight / 2 + 100)]);

    // onClick("spinbutton", (spinbutton) => {
    //     if (speed == 0) {
    //         speed = 20;
    //     }
    // });

    k.onUpdate(() => {
        for (const box of wheel) {
            box.pos.x -= speed;
            if (box.pos.x < wheelX - 200) {
                box.pos.x += 1010;
                box.frame = Math.floor(Math.random() * 7);
            }
        }
        // speed--;
    });
}