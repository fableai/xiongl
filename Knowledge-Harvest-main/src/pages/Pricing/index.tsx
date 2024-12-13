import { Button, Card, Layout, List, message } from "antd";
import styles from './style.module.less'
import { CheckCircleFilled } from "@ant-design/icons";
import usePricingStore, { Price } from "./store";
import { useEffect } from "react";
import usePayModal from "./PayModal";
import { useNavigate } from "react-router-dom";
import { RouteNames } from "../../router";

const { Header, Content } = Layout;

export default function Pricing() {
    const store = usePricingStore()

    console.log(store)

    useEffect(() => {
        store.fetchPricingList()
    }, [])

    return (
        <Layout className={styles['pricing-layout']}>
            <Header
                className={styles['pricing-header']}
            >
                <h1 className={styles['pricing-header-title']}>Get Started</h1>
                <p>30 days money-back guarantee</p>
            </Header>
            <Content
                className={styles['pricing-content']}
            >
                <div className={styles['pricing-list']}>
                    <List
                        grid={{
                            gutter: [24, 8],
                            xs: 1,
                            sm: 1,
                            md: 1,
                            lg: 2,
                            xl: 3,
                            xxl: 3,
                        }}
                        dataSource={store.pricingList}
                        renderItem={(item) => (
                            <List.Item key={item.priceSetGuid}>
                                <PricingCard item={item} />
                            </List.Item>
                        )}
                    />
                </div>
            </Content>
        </Layout>
    )
}

function PricingCard(props: { item: Price }) {
    const { item } = props;

    const navigator = useNavigate()
    const { placeholder, showPayModal } = usePayModal()

    const onGetStart = () => {
        if (item.priceAmount === 0) {
            navigator(RouteNames.KnowledgeLib)
            message.success('您已成功订阅免费版本 ~ ')
            return
        }

        showPayModal({
            price: item
        })
    }

    return (
        <Card
            className={styles['pricing-card']}
            title={
                <div className={styles['pricing-card-header']}>
                    <h2>{item.priceTitle}</h2>
                    <div className={styles['pricing-card-header-desc']}>{item.priceRemark}</div>

                    <div className={styles['pricing-card-price']}>
                        <div className={styles['pricing-card-price-number']}>{item.priceCurrency}{item.priceAmount}</div>
                        {
                            item.priceUnit &&
                            <span className={styles['pricing-card-price-unit']}>{item.priceUnit}</span>
                        }
                    </div>
                    
                    <Button
                        type="primary"
                        size="large"
                        className={styles['pricing-card-button']}
                        onClick={onGetStart}
                    >
                        Get Started
                    </Button>
                </div>
            }
            hoverable
        >
            <div className={styles['pricing-card-features']}>
                {item.priceItems.map((feature, index) => (
                    <div
                        key={index}
                        className={styles['pricing-card-feature']}
                    >
                        <CheckCircleFilled
                            className={styles['pricing-card-feature-icon']}
                        />
                        <div>{feature}</div>
                    </div>
                ))}
            </div>

            {placeholder}
        </Card>
    )
}