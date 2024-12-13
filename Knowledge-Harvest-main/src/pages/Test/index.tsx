import {useStripe, useElements, Elements, PaymentElement} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { fetchCreatePaymentIntent } from '@/service';

const id = 'pk_test_51PUgkdE1Q2U4w67Q5iH9lhv7cMLNHcO4LHvwpnrtFQefi5EDKjN3AO92xWilwTAPzaUe2EeRLD8WJDv25x6f1mLR00qBPQmkwI'

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe(id);

const intentOptions = {
    amount: 1000,
    currency: 'usd'
}

export default function Test() {
    return (
        <Elements
            stripe={stripePromise}
            options={{
                mode: 'payment',
                ...intentOptions
            }}
        >
            <CheckoutForm />
        </Elements>
    )
}

const CheckoutForm = () => {
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
            ...intentOptions
        })

        const clientSecret = response.data

        const result = await stripe.confirmPayment({
            elements,
            clientSecret,
            confirmParams: {
                return_url: location.origin + '/test',
            }
        });

        if (result.error) {
            // Show error to your customer (for example, payment details incomplete)
            console.log(result.error.message);
        } else {
            // Your customer will be redirected to your `return_url`. For some payment
            // methods like iDEAL, your customer will be redirected to an intermediate
            // site first to authorize the payment, then redirected to the `return_url`.
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <PaymentElement />
            <button disabled={!stripe}>Submit</button>
        </form>
    )
};