import { Divider } from "antd";
import { useEffect, useRef } from "react";
import styles from './style.module.less'

export default function LoadMore(props: {
    children?: React.ReactNode;
    onNotify: () => void;
}) {
    const ref = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    props.onNotify();
                }
            })
        })

        observer.observe(ref.current!)
        return () => {
            observer.disconnect()
        }
    }, [])

    return (
        <div ref={ref} className={styles["load-more-container"]}>{props.children ?? <Divider>{'没有更多了'}</Divider>}</div>
    )
}