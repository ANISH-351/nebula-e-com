import React from "react";
import { FiCheckCircle, FiShoppingBag, FiHome } from "react-icons/fi";
import { useLocation, useNavigate, Link } from "react-router-dom";

export default function OrderSuccess() {
  const navigate = useNavigate();
  const { state } = useLocation();

  const paymentId = state?.paymentId || "—";
  const orderId   = state?.orderId   || "—";
  const amount    = state?.amount    || 0;

  return (
    <section className="w-full min-h-screen bg-white flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-lg text-center">

        {/* Animated check */}
        <div className="relative w-28 h-28 mx-auto mb-8">
          <div className="absolute inset-0 rounded-full bg-[#b89552]/10 animate-ping" />
          <div className="relative w-28 h-28 rounded-full bg-[#faf7f2] flex items-center justify-center">
            <FiCheckCircle size={52} className="text-[#b89552]" strokeWidth={1.5} />
          </div>
        </div>

        {/* Text */}
        <p className="text-[11px] tracking-[3px] uppercase text-[#b89552] font-medium">
          Payment Successful
        </p>
        <h1 className="mt-3 text-[2.2rem] sm:text-[2.8rem] font-serif text-gray-900 leading-tight">
          Order Confirmed!
        </h1>
        <p className="mt-3 text-sm text-gray-400 max-w-sm mx-auto leading-relaxed">
          Thank you for shopping with Nebula. Your order has been placed and will be delivered soon.
        </p>

        {/* Payment details card */}
        <div className="mt-10 bg-[#faf7f2] rounded-3xl p-6 text-left space-y-4">
          <h2 className="text-base font-serif text-gray-900 mb-2">Payment Details</h2>

          {[
            ["Payment ID",  paymentId],
            ["Order ID",    orderId],
            ["Amount Paid", `₹${amount}`],
            ["Status",      "Confirmed"],
          ].map(([label, value]) => (
            <div key={label} className="flex items-center justify-between text-sm border-b border-[#eddfc8] pb-3 last:border-0 last:pb-0">
              <span className="text-gray-400">{label}</span>
              <span className={`font-medium ${label === "Status" ? "text-green-600" : "text-gray-800"} max-w-[55%] truncate text-right`}>
                {value}
              </span>
            </div>
          ))}
        </div>

        {/* What's next */}
        {/* <div className="mt-6 bg-[#faf7f2] rounded-3xl p-6 text-left">
          <h2 className="text-base font-serif text-gray-900 mb-4">What's Next?</h2>
          <div className="space-y-3">
            {[
              ["1", "You'll receive a confirmation email shortly."],
              ["2", "Your order will be packed within 24 hours."],
              ["3", "Track your shipment from your profile."],
            ].map(([step, text]) => (
              <div key={step} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#b89552]/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-[10px] font-semibold text-[#b89552]">{step}</span>
                </div>
                <p className="text-sm text-gray-500 leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        </div> */}

        {/* CTAs */}
        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => navigate("/")}
            className="flex-1 flex items-center justify-center gap-2 bg-[#b89552] hover:bg-[#9e7f3e] active:scale-[0.98] text-white py-4 rounded-full text-sm font-medium transition-all"
          >
            <FiHome size={15} />
            Back to Home
          </button>
          <Link to="/orders" className="flex-1">
            <button className="w-full flex items-center justify-center gap-2 border border-[#d9c4a0] hover:bg-[#faf7f2] text-[#b89552] py-4 rounded-full text-sm font-medium transition-all">
              <FiShoppingBag size={15} />
              View Orders
            </button>
          </Link>
        </div>

      </div>
    </section>
  );
}