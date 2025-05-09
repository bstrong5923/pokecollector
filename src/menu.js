import k from "./kaplayCtx";
import { kScreenWidth, kScreenHeight } from "./kaplayCtx";

export const menuHeight = 160;
export const screenWidth = kScreenWidth
export const screenHeight = kScreenHeight - menuHeight;

export default function menu() {
    
    k.add([k.rect(1920, menuHeight - 10), k.pos(0, 0), k.color(20, 20, 20)]);
    k.add([k.rect(1920, 10), k.pos(0, 150), k.color(0, 0, 0)]);

    const scenes = ["inventory", "spinning"];

    for (let i = 0; i < scenes.length; i++) {
        const s = scenes[i];
        const button = k.add([k.text(s, {size: 36, width: 400, font: "pkmn"}), k.pos(kScreenWidth / 2 + 200 * i, 50), k.area()]);
        button.onClick(() => {
            k.go(s + "Scene"); 
        })
    }
}