import { LoginType } from "./store";

export type LoginSuccessCallback = (type: LoginType, params: { nickName: string }) => void;
