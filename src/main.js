import k from "./kaplayCtx";
import mainMenu from "./scenes/spinning";

k.loadSprite("frame-1", "images/frames/frame-1.png");
k.loadSprite("wheel-border", "images/wheel-border.png")
k.loadSprite("bgcolor", "images/bgcolor.png");

k.scene("spinning", mainMenu());

k.go("spinning");