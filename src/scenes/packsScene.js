import { packs, displayItems, menu, menuHeight, screenWidth, screenHeight, Box } from "../constants";

export default function packsScene() {
    menu("packs");

    displayItems(packs, "packs", 0, screenWidth, menuHeight, screenHeight, 300, 225, 6, "pagearrow", 1, 10, screenHeight / 2 - 55 + menuHeight, screenWidth - 120, screenHeight / 2 - 55 + menuHeight);
}