import { ThemeConfig } from "antd";
import { assign } from 'radash'
import './style.less'

const commonTheme = () => ({
    cssVar: true,
    components: {
        Menu: {
            itemHeight: 50
        }
    }
} as ThemeConfig)

export default function defineTheme(theme: ThemeConfig) {
    return assign(commonTheme(), theme)
};