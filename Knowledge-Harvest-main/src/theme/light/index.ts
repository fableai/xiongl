import { theme } from "antd";
import defineTheme from "../common";

export default defineTheme({
    cssVar: true,
    token: {
        colorPrimary: '#605BD3',
        colorBgContainer: '#ffffff',
    },
    components: {
        Layout: {
            headerBg: '#ffffff',
            siderBg: '#ffffff',
            bodyBg: '#edeff3',
        }
    },
    algorithm: theme.defaultAlgorithm
})