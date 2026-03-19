type Status = {
    status: 'success' | 'cancel';
};

function PaymentResponse({ status }: Status) {
    if (status === 'success') {
        return (
            <>
                <p>ok</p>
            </>
        );
    }

    if (status === 'cancel') {
        return (
            <>
                <p>Payment cancelled</p>
            </>
        );
    }
}

export default PaymentResponse;
