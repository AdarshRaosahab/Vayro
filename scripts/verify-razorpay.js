const Razorpay = require('razorpay');

const key_id = 'rzp_test_RmoZbMadBAmN5z';
const key_secret = 'VLQnLYlzgwvUXeJ72JSSPGdp';

console.log('Testing Razorpay keys...');
console.log('Key ID:', key_id);

const razorpay = new Razorpay({
    key_id: key_id,
    key_secret: key_secret,
});

async function test() {
    try {
        const order = await razorpay.orders.create({
            amount: 50000, // 500 INR
            currency: 'INR',
            receipt: 'test_receipt_1',
        });
        console.log('✅ Success! Order created.');
        console.log('Order ID:', order.id);
        console.log('Status:', order.status);
    } catch (error) {
        console.error('❌ Error creating order:');
        console.error(error);
    }
}

test();
