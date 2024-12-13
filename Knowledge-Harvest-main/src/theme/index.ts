import dark from "./dark";
import light from "./light";

export enum Theme { // 定义主题枚举
    DARK = "theme-dart",
    LIGHT = "theme-light"   
}

export const THEME = {
    [Theme.DARK]: dark,
    [Theme.LIGHT]: light
}