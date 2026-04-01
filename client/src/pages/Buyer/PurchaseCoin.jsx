import { useState, useEffect } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { paymentAPI } from "@/services/api";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";

const coinPacks = [
  { coins: 10, price: 1, mostPopular: false },
  { coins: 150, price: 10, mostPopular: true },
  { coins: 500, price: 20, mostPopular: false },
  { coins: 1000, price: 35, mostPopular: false },
];

export default function PurchaseCoin() {
  const stripe = useStripe();
  const elements = useElements();
  const { user, setUser } = useAuth();
  const [selectedPack, setSelectedPack] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  const handleSelectPack = (pack) => {
    setSelectedPack(pack);
    setShowPaymentForm(true);
  };

  const handlePayment = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      toast.error("Stripe not loaded. Please refresh and try again.");
      return;
    }

    if (!selectedPack) {
      return;
    }

    setLoading(true);

    try {
      // Create payment intent on server
      const intentResponse = await paymentAPI.createPaymentIntent(
        selectedPack.coins,
        selectedPack.price,
      );
      const { clientSecret } = intentResponse.data;

      const cardElement = elements.getElement(CardElement);

      // Confirm payment with Stripe
      const { error, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: user?.name || "Anonymous",
              email: user?.email || "anonymous@example.com",
            },
          },
        },
      );

      if (error) {
        toast.error(error.message || "Payment failed");
      } else if (paymentIntent.status === "succeeded") {
        // Confirm payment on server and add coins
        await paymentAPI.confirmPayment(
          paymentIntent.id,
          selectedPack.coins,
          selectedPack.price,
        );

        // Update user context with new coin balance
        const updatedUser = {
          ...user,
          coins: (user?.coins || 0) + selectedPack.coins,
        };
        setUser(updatedUser);

        toast.success(
          `Successfully purchased ${selectedPack.coins} coins! Your new balance: ${updatedUser.coins}`,
        );
        setShowPaymentForm(false);
        setSelectedPack(null);
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast.error(
        error.response?.data?.message || "Payment failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">Purchase Coins</h1>

      {!showPaymentForm ? (
        <div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {coinPacks.map((pack, index) => (
              <div
                key={index}
                className={`card text-center cursor-pointer hover:shadow-xl transition ${
                  pack.mostPopular
                    ? "ring-2 ring-blue-600 transform scale-105"
                    : ""
                }`}
              >
                {pack.mostPopular && (
                  <div className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-bold mb-3 inline-block">
                    Most Popular
                  </div>
                )}
                <p className="text-4xl font-bold text-blue-600 mb-2">
                  {pack.coins}
                </p>
                <p className="text-gray-600 mb-4">Coins</p>
                <div className="border-t pt-4">
                  <p className="text-3xl font-bold mb-4">${pack.price}</p>
                  <button
                    onClick={() => handleSelectPack(pack)}
                    className={`btn-primary w-full ${
                      pack.mostPopular ? "bg-blue-600" : "bg-gray-600"
                    }`}
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="card bg-blue-50">
            <h3 className="text-xl font-bold mb-4">💡 Why Purchase Coins?</h3>
            <ul className="space-y-2 text-gray-700">
              <li>✓ Create more tasks and reach more workers</li>
              <li>✓ Access premium features</li>
              <li>✓ Boost your task visibility</li>
              <li>✓ Quick and secure payment</li>
              <li>✓ Coins never expire</li>
            </ul>
          </div>
        </div>
      ) : (
        <div className="max-w-md mx-auto">
          <div className="card">
            <h2 className="text-2xl font-bold mb-6">Complete Payment</h2>

            <div className="bg-blue-50 p-4 rounded-lg mb-6">
              <p className="text-gray-700 mb-2">
                <span className="font-semibold">Amount:</span> $
                {selectedPack.price}
              </p>
              <p className="text-gray-700">
                <span className="font-semibold">You'll receive:</span>{" "}
                {selectedPack.coins} coins
              </p>
            </div>

            <form onSubmit={handlePayment} className="space-y-6">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Card Details
                </label>
                <div className="border border-gray-300 p-3 rounded-lg">
                  <CardElement />
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowPaymentForm(false);
                    setSelectedPack(null);
                  }}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary flex-1 disabled:opacity-50"
                >
                  {loading ? "Processing..." : `Pay $${selectedPack.price}`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
