import { Carousel } from 'antd';
import styles from './style.module.less';
import img1 from '@/pages/Login/assets/imgs/01.png'

const options = [
    {
        image: img1
    },
    {
        image: img1
    }
]

export default function Banner() {
    return (
        <div className={styles['banner']}>
            <Carousel>{
                options.map((option, index) => (
                    <div
                        key={index}
                        className={styles['banner-item']}
                    >
                        <img src={option.image} alt="" />
                    </div>
                ))
            }</Carousel>
        </div>
    )
}