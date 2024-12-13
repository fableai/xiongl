import api from "./request"

export const fetchLogin = async (params: { email: string, password: string, type: 'email' | '' }) => {
    const response = await api.post("/Login/GetToken", params)

    return response.data
}

/**
 * 登录接口
 * @param params 
 * @returns 
 */
export const fetchLoginWithGoogle = async (params: { accessToken: string }) => {
    // const response = await api.get("/Login/GoogleToken", {
    //     params
    // })
    const response = await api.post("/Login/GoogleToken", {
        googleToken:params.accessToken
    })
    return response.data
}


/**
 * 请求验证码
 * @param params 
 * @returns 
 */
export const fetchQrCode = async (params: { email: string }) => {
    const response = await api.post("/Login/SendQrCode", {
        qrType: 'email',
        qrValue: params.email
    })

    return response
}

/**
 * 获取用户信息
 * @param params 
 * @returns 
 */
export const fetchUserById = async (params: { userGuid: string }) => {
    const response = await api.post("/Login/GetUserById", {
        userGuid: params.userGuid
    })

    return response.data
}

/**
 * 修改密码
 * @param params 
 * @returns 
 */
export const fetchModifyPassword = async (params: { userGuid: string, email: string, code: string, password: string }) => {
    const response = await api.post("/Login/ModiPwd", {
        userGuid: params.userGuid,
        email: params.email,
        qrCode: params.code,
        password: params.password
    })

    return response.data
}

/**
 * 设置语言
 * @param params 
 * @returns 
 */
export const fetchSetLang = async (params: { userGuid: string, lang: 0 | 1 }) => {
    const response = await api.post("/Login/SetLang", {
        lang: params.lang,
        userGuid: params.userGuid
    })

    return response.data
}

/**
 * 设置
 * @param params 
 * @returns 
 */
export const fetchEditUserInfo = async (params: { userGuid: string, nickName: string, lang: number
    ,promptAbstract:string,promptKeyInfo:string
 }) => {
    const response = await api.post("/Login/EditUserInfo", {
        userGuid: params.userGuid,
        nickName: params.nickName,
        lang: params.lang ,
        promptAbstract: params.promptAbstract,
        promptKeyInfo: params.promptKeyInfo  
    })

    return response.data
}


/**
 * 获取提示词设置
 * @param params 
 * @returns 
 */
export const fetchGetUserPrompt = async (params: { userGuid: string}) => {
    const response = await api.post("/Login/GetUserPrompt", {
        userGuid: params.userGuid
    })

    return response.data
}

/**
 * 设置提示词
 * @param params 
 * @returns 
 */
export const fetchSetUserPrompt = async (params: { userGuid: string
    ,promptAbstract:string,promptKeyInfo:string
 }) => {
    const response = await api.post("/Login/SetUserPrompt", {
        userGuid: params.userGuid,
        promptAbstract: params.promptAbstract,
        promptKeyInfo: params.promptKeyInfo  
    })

    return response.data
}