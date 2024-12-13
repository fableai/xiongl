import zh_CN from './zh_CN'
import en_US from './en_US'

const i18nMap = {
    zh_CN,
    en_US,
}

export type Languages = keyof typeof i18nMap

let currentLanguage: Languages

export namespace i18n {
    /**
     * 获取当前语言对应的字符串
     * @param key 
     * @returns 
     */
    export function t(key: string): string {
        const map: Record<string, string> = i18nMap[currentLanguage]
        if (map) {
            const value = map[key]
            if (value) {
                return value
            }

        }

        return key
    }

    /**
     * 获取当前语言
     * @returns 
     */
    export function getLanguage(): Languages {
        return currentLanguage
    }

    /**
     * 设置语言
     * @param language 
     */
    export function setLanguage(language: Languages = autoLanguage()) {
        if (isSupportedLanguage(language)) {
            currentLanguage = language
            localStorage.setItem('language', language)
        }
    }

    /**
     * 支持的语言
     * @param language 
     * @returns 
     */
    export const isSupportedLanguage = (language: string) => {
        return Object.keys(i18nMap).includes(language)
    }

    /**
     * 自动选择语言
     * @returns 
     */
    export const autoLanguage = (): Languages => {
        let language = localStorage.getItem('language')!
        if (isSupportedLanguage(language)) {
            return language as Languages
        }

        language = navigator.language
        if (isSupportedLanguage(language)) {
            return language as Languages
        }

        // return 'zh_CN'
        return 'en_US' // 设置默认语言为 en_US
    }
}

/**
 * 初始化当前语言
 */
i18n.setLanguage()