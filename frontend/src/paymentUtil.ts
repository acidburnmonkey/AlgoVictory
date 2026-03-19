import api from './api';

export async function payStripe() {
    try {
        const response = await api.post('/payments/stripe-pay/');

        if (response.status === 200) {
            console.log('Stripe url :', response.data.url);
            window.location.href = response.data.url;
        }
    } catch (error) {
        console.error('Buy error:', error);
    }
}
