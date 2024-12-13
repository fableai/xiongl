import { Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { Button, Modal, message } from "antd";
import { fetchCreatePaymentIntent, fetchPaymentConfirm } from "@/service";
import { RouteNames } from "../../../router";
import { useState } from "react";
import styles from './style.module.less'
import useGlobalStore from "@/store";
import { Price } from "../store";

type PaymentIntent = {
    amount: number,
    currency: string
}

type Props = {
    open?: boolean,
    price?: Price,
    onClose?: () => void
}

/**
 * 支付弹窗 hook
 * @param props
 * @returns 
 */
export default function usePayModal(props: Props = {}) {
    const [state, _setState] = useState(props)

    const setState = (newState: Props) => {
        _setState(prevState => ({ ...prevState, ...newState }))
    }

    const showPayModal = (props: Props) => {
        setState({
            ...props,
            open: true
        })
    }

    const closePayModal = () => {
        setState({ open: false })
        props.onClose && props.onClose()
    }

    const placeholder = (
        <PayModal
            {...state}
            open={state.open}
            onClose={closePayModal}
        />
    )

    return {
        placeholder,
        showPayModal
    }
}

/**
 * 支付弹窗
 * @param props 
 * @returns 
 */
function PayModal(props: Props) {
    const { stripePromise } = useGlobalStore((state) => ({
        stripePromise: state.stripePromise
    }))

    const paymentIntent = {
        amount: props.price?.priceAmount! * 100,
        currency: 'usd',
    }

    return (
        props.price &&
        <Modal
            open={props.open}
            onCancel={props.onClose}
            footer={null}
        >
            <div className={styles['pay-modal-main']}>
                <Elements
                    stripe={stripePromise}
                    options={{
                        mode: 'payment',
                        ...paymentIntent
                    }}
                >
                    <CheckoutForm
                        price={props.price!}
                        paymentIntent={paymentIntent!}
                    />
                </Elements>
            </div>
        </Modal>
    )
}

/**
 * 支付表单
 * @param props 
 * @returns 
 */
const CheckoutForm = (props: {
    price: Price,
    paymentIntent: PaymentIntent
}) => {
    const stripe = useStripe();
    const elements = useElements();

    const handleSubmit = async (event: any) => {
        // We don't want to let default form submission happen here,
        // which would refresh the page.
        event.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        const params = await elements.submit()

        if (params.error) {
            return
        }

        const response = await fetchCreatePaymentIntent({
            ...props.paymentIntent
        })

        const clientSecret = response.data

        if (clientSecret) {
            message.success('订单创建成功，正在支付...')
        }

        const result = await stripe.confirmPayment({
            elements,
            clientSecret,
            confirmParams: {
                return_url: location.origin + RouteNames.KnowledgeLib,
            }
        });

        if (result.error) {
            // Show error to your customer (for example, payment details incomplete)
            message.error(result.error.message);
        } else {
            fetchPaymentConfirm({
                priceSetGuid: props.price.priceSetGuid,
                clientSecret
            })
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className={styles['pay-modal-content']}>
                <PaymentElement />
            </div>
            
            <Button
                htmlType="submit"
                type="primary"
                disabled={!stripe}
                className={styles['pay-modal-submit']}
            >
                {'确认'}
            </Button>
        </form>
    )
};