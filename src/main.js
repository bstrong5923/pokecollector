import k from "./kaplayCtx";
import mainMenu from "./scenes/spinning";

k.loadSprite("boxes", "images/allboxes.png", {
    sliceX: 4,
    sliceY: 2,
});
k.loadSprite("wheelborder", "images/wheelborder.png")
k.loadSprite("bgcolor", "images/bgcolor.png");
k.loadSprite("spinbutton", "images/spinbutton.png");

k.scene("spinning", mainMenu());

console.log(process.env.NODE_PATH);

k.go("spinning");