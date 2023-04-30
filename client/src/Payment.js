import { useEffect, useState } from "react";
import CheckoutForm from "./CheckoutForm";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

function Payment(props) {
  const [stripePromise, setStripePromise] = useState(null);
  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    fetchStripePromise();
    fetchPaymentIntents();
    fetchPaymentIntentPromise();
  }, []);

  async function fetchStripePromise() {
    fetch("/config").then(async (res) => {
      const { publishableKey } = await res.json();
      console.log("Stripe Key: ", publishableKey);
      setStripePromise(loadStripe(publishableKey));
    });
  }

  async function fetchPaymentIntents() {
    fetch("/payment-intents").then(async (res) => {
      const { paymentIntents } = await res.json();
      console.log("Payment Intents: ", paymentIntents);
    });
  }

  async function fetchPaymentIntentPromise() {
    fetch("/create-payment-intent", {
      method: "POST",
      body: JSON.stringify({}),
    }).then(async (res) => {
      const { clientSecret } = await res.json();
      console.log("Payment Intent Key: ", clientSecret);
      setClientSecret(clientSecret);
    });
  }

  return (
    <>
      <h1>React Stripe Example</h1>
      {stripePromise && clientSecret && (
        <Elements
          stripe={stripePromise}
          options={{
            clientSecret,
          }}
        >
          <CheckoutForm />
        </Elements>
      )}
    </>
  );
}

export default Payment;
