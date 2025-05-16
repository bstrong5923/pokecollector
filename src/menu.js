import k from "./kaplayCtx";
import { kScreenWidth, kScreenHeight } from "./kaplayCtx";


export const menuHeight = 130;
export const screenWidth = kScreenWidth
export const screenHeight = kScreenHeight - menuHeight;


export default function menu(current) {
    k.add([k.rect(1920, menuHeight - 10), k.pos(0, 0), k.color(20, 20, 20)]);
    k.add([k.rect(1920, 10), k.pos(0, menuHeight - 10), k.color(0, 0, 0)]);

    // pixels per letter
    const letterWidth = 28;

    const scenes = ["spinning", "inventory"];

    // totalWidth is the width from the start of the first to the end of the last, with spacing
    let totalWidth = -150;
    for (const s of scenes) {
        totalWidth += s.length * letterWidth + 150;
    }

    const buttons = [];

    let nextX = kScreenWidth / 2 - totalWidth / 2; // where the first one should start
    
    const fontSize = 30;
    for (const s of scenes) {
        const button = k.add([ // create the button
            k.text(s, {size: fontSize, width: s.length * letterWidth, font: "pkmn"}),  // text is the scene, size and width determine hitbox
            k.pos(nextX, (menuHeight - 10) / 2 - fontSize / 2),
            k.area() // hitbox
        ]);
        nextX += s.length * letterWidth + 150; // where the next one should start

        button.onClick(() => { // when the button is clicked:
            if (button.text != current) { // if it is not the current scene
                k.go(button.text + "Scene"); // run the scene associated with it
            }
        });

        buttons.push(button); // add it to buttons
        
    }
}

