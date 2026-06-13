const razorpay = require('../config/razorpay');
const crypto = require('crypto');

// CREATE ORDER
exports.createOrder = async (req, res) => {
  const { amount } = req.body; // amount in rupees

  try {
    const order = await razorpay.orders.create({
      amount: amount * 100, // convert to paise
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
    });
    res.json(order);
  } catch (err) {
    res.status(500).send(err);
  }
};

// VERIFY PAYMENT
exports.verifyPayment = (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const body = razorpay_order_id + '|' + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest('hex');

  if (expectedSignature === razorpay_signature) {
    res.json({ success: true, payment_id: razorpay_payment_id });
  } else {
    res.status(400).json({ success: false, message: 'Invalid signature' });
  }
};