import { theme } from "antd";
import defineTheme from "../common";

export default defineTheme({
    cssVar: true,
    token: {
        colorPrimary: '#605BD3',
        colorBgContainer: '#232323',
    },
    components: {
        Layout: {
            headerBg: '#232323',
            siderBg: '#232323',
            bodyBg: '#121212',
        }
    },
    algorithm: theme.darkAlgorithm
})