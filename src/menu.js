import k from "./kaplayCtx";
import { kScreenWidth, kScreenHeight } from "./kaplayCtx";


export const menuHeight = 160;
export const screenWidth = kScreenWidth
export const screenHeight = kScreenHeight - menuHeight;


export default function menu(current) {
    k.add([k.rect(1920, menuHeight - 10), k.pos(0, 0), k.color(20, 20, 20)]);
    k.add([k.rect(1920, 10), k.pos(0, 150), k.color(0, 0, 0)]);

    const scenes = ["inventory", "spinning"];

    const buttons = [];
    for (let i = 0; i < scenes.length; i++) {
        let s = scenes[i];
        buttons.push(k.add([k.text(s, {size: 36, width: 400}), k.pos(kScreenWidth / 2 + 300 * i, 50), k.area()]));
    }

    k.onClick("1", () => {
        console.log("a");
    });

    // buttons[0].onClick(() => {
    //     if (buttons[0].text != current) {
    //         console.log(buttons[0].text);
    //         k.go(buttons[0].text + "Scene");
    //     }
    // });
    // buttons[1].onClick(() => {
    //     if (buttons[1].text != current) {
    //         console.log(buttons[1].text);
    //         k.go(buttons[1].text + "Scene");
    //     }
    // });

//    for (const button of buttons) {
//         button.onHover(() => {
//             button.font = "pkmn";
//        });
    //    button.onClick(() => {
    //         if (button.text != current) {
    //             console.log(button.text);
    //             k.go(button.text + "Scene");
    //         }
    //    });
//    }
}

