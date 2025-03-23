import k from "./kaplayCtx";
import mainMenu from "./scenes/mainMenu";

k.loadSprite("frame-1", "images/frames/frame-1.png");

k.scene("main-menu", mainMenu());

//k.scene("game", () => {})

k.go("main-menu");