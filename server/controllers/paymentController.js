const Razorpay = require('razorpay');
const crypto = require('crypto');
const Coupon = require('../models/Coupon');

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Create Order
exports.createOrder = async (req, res) => {
  try {
    const { amount, couponCode } = req.body; // Amount in smallest currency unit (paise for INR)
    
    let finalAmount = amount;

    // Apply Coupon Logic
    if (couponCode) {
        const coupon = await Coupon.findOne({ code: couponCode.toUpperCase() });
        if (coupon && coupon.isActive && new Date() < new Date(coupon.expirationDate)) {
             if (!coupon.usageLimit || coupon.usedCount < coupon.usageLimit) {
                 if (coupon.discountType === 'percentage') {
                     finalAmount = amount - (amount * coupon.value / 100);
                 } else if (coupon.discountType === 'fixed') {
                     finalAmount = amount - coupon.value;
                 }
                 

             }
        }
    }


    if (finalAmount < 1) finalAmount = 1; // Ensure amount is at least 1 rupee to avoid errors

    const options = {
      amount: Math.round(finalAmount * 100), // Convert to paise and ensure integer
      currency: "INR",
      receipt: `receipt_${Date.now()}`
    };

    const order = await razorpay.orders.create(options);

    if (!order) {
      return res.status(500).json({ message: "Some error occured" });
    }
    
    // Note: Here we just create the order. Notification should be sent upon payment CONFIRMATION (webhook or verify step).
    // However, verifyPayment is client-side trigger confirmation mostly.
    // The createAppointment controller handles the final confirmation if payment is passed.
    // So notification logic is better placed in createAppointment (already added) or a webhook handler.
    // For 'payment_success' specifically, we can add it in verifyPayment if that's used for standalone payments,
    // or rely on createAppointment which handles the logic "if payment: confirmed".
    
    // Let's check verifyPayment usage. It seems to just verify signature. 
    // If appointment is created AFTER this verification on client side calling createAppointment, then createAppointment covers it.
    // IF createAppointment is called with payment details, we added logic there.
    
    res.json(order);
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    res.status(500).json({ message: "Server Error", error });
  }
};

// Verify Payment Signature
exports.verifyPayment = (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        const sign = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSign = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(sign.toString())
            .digest("hex");

        if (razorpay_signature === expectedSign) {
            return res.status(200).json({ message: "Payment verified successfully" });
        } else {
            return res.status(400).json({ message: "Invalid signature sent!" });
        }
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
}

// Get Expert Payments
exports.getExpertPayments = async (req, res) => {
    try {
        const expertId = req.user.id;

        // Find appointments for this expert with successful payments
        // Assuming 'captured' means success. You might also want to check if payment field exists.
        const appointments = await require('../models/Appointment').find({
            expert: expertId,
            'payment.status': 'captured'
        })
        .populate('customer', 'name email profileImage') // Populate customer details
        .sort({ date: -1 }); // Sort by date descending

        const payments = appointments.map(appt => ({
            _id: appt._id,
            paymentId: appt.payment.razorpayPaymentId,
            amount: appt.payment.amount,
            date: appt.createdAt,
            customer: appt.customer,
            status: appt.payment.status
        }));

        res.json(payments);
    } catch (error) {
        console.error("Error fetching expert payments:", error);
        res.status(500).json({ message: "Server Error" });
    }
};
