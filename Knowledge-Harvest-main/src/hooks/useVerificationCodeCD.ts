import useGlobalStore from "@/store";
import { useCountDown } from "ahooks";
import { message } from "antd";
import { useRef, useState } from "react";

export function useVerificationCodeCD() {
    const codeLock = useRef(false)
    const [leftTime, setLeftTime] = useState<number | undefined>(undefined)

    const globalStore = useGlobalStore(
        ({ dispatchVerificationCode }) => ({ dispatchVerificationCode })
    )

    const getLock = () => {
        return codeLock.current
    }

    const setLock = (status: boolean) => {
        codeLock.current = status
    }

    /**
     * 验证码冷却倒计时
     */
    const [countdown, formattedRes] = useCountDown({
        leftTime,
        onEnd: () => {
            setLock(false)
        },
    });

    /**
     * 派发验证码
     * @param email 
     * @returns 
     */
    const dispatchVerificationCode = async (email: string) => {
        if (getLock()) return

        try {
            setLock(true)
            setLeftTime(60 * 1000)

            await globalStore.dispatchVerificationCode({ email })

            message.success('验证码已发送至邮箱')
        } catch(e) {
            message.error('验证码发送失败，请稍后再试')
            
            setLeftTime(0)
            setLock(false)
            return
        }

        
    }

    return {
        formattedRes,
        getLock,
        setLock,
        setLeftTime,
        dispatchVerificationCode
    }
}