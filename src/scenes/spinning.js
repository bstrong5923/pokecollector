import k from "../kaplayCtx";
import { screenWidth, screenHeight } from "../kaplayCtx";

export default function spinning() {
    const wheelWidth = 600;
    const wheelX = screenWidth / 2 - 403;
    const wheelY = screenHeight / 2 - 175;
    
    let wheel = [
        k.add([k.sprite("frame-1"), k.pos(wheelX, wheelY)]),
        k.add([k.sprite("frame-1"), k.pos(wheelX + 202, wheelY)]),
        k.add([k.sprite("frame-1"), k.pos(wheelX + 404, wheelY)]),
        k.add([k.sprite("frame-1"), k.pos(wheelX + 606, wheelY)]),
        k.add([k.sprite("frame-1"), k.pos(wheelX + 808, wheelY)]),
    ];

    k.add([k.sprite("wheel-border"), k.pos(screenWidth / 2 - 408, screenHeight / 2 - 180)]);
    k.add([k.sprite("bgcolor"), k.pos(screenWidth / 2 - 614, screenHeight / 2 - 180)])
    k.add([k.sprite("bgcolor"), k.pos(screenWidth / 2 + 404, screenHeight / 2 - 180)])

    k.onUpdate(() => {
        for(const frame of wheel) {
            frame.pos.x -= 15;
            if (frame.pos.x < wheelX - 200) {
                frame.pos.x += 1010;
            }
        }
    });
}