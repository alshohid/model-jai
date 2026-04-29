import { IPaymentStatusResponse, PaymentMethodId } from "@/types/user/point";

export type PaymentMethodConfig = {
  id: PaymentMethodId;
  name: string;
  logo: string;
  description: string;
  connectLabel: string;
  connectPlaceholder: string;
  connectField?: "paypal_email" | "moncash_number" | "bitpay_wallet";
  inputType?: "text" | "email" | "tel";
  identifierLabel: string;
  identifierKeys: Array<keyof IPaymentStatusResponse>;
};

export const PAYMENT_METHODS: PaymentMethodConfig[] = [
  {
    id: "paypal",
    name: "PayPal",
    logo: "/payments/paypal.svg",
    description:
      "Use your PayPal account for point checkout and withdrawal requests.",
    connectLabel: "PayPal Email",
    connectPlaceholder: "name@example.com",
    connectField: "paypal_email",
    inputType: "email",
    identifierLabel: "PayPal Email",
    identifierKeys: ["paypal_email", "email"],
  },
  {
    id: "moncash",
    name: "MonCash",
    logo: "/payments/moncash.jpeg",
    description: "Route withdrawals and payments through your MonCash number.",
    connectLabel: "MonCash Number",
    connectPlaceholder: "Enter MonCash number",
    connectField: "moncash_number",
    inputType: "tel",
    identifierLabel: "MonCash Number",
    identifierKeys: ["moncash_number"],
  },
  {
    id: "bitpay",
    name: "BitPay",
    logo: "/payments/bitpay.svg",
    description:
      "Connect your BitPay wallet and use it across checkout and withdrawals.",
    connectLabel: "BitPay Wallet",
    connectPlaceholder: "Enter BitPay wallet",
    connectField: "bitpay_wallet",
    inputType: "text",
    identifierLabel: "BitPay Wallet",
    identifierKeys: ["bitpay_wallet"],
  },
  {
    id: "stripe",
    name: "Stripe",
    logo: "/payments/stripe.png",
    description:
      "Continue with Stripe checkout and manage payouts from your Stripe account.",
    connectLabel: "Stripe Account",
    connectPlaceholder: "",
    identifierLabel: "Stripe Account",
    identifierKeys: [
      "stripe_account_email",
      "stripe_email",
      "email",
      "stripe_account_id",
      "account_id",
    ],
  },
];

export const PAYMENT_METHOD_MAP = PAYMENT_METHODS.reduce<
  Record<PaymentMethodId, PaymentMethodConfig>
>(
  (accumulator, method) => {
    accumulator[method.id] = method;
    return accumulator;
  },
  {} as Record<PaymentMethodId, PaymentMethodConfig>,
);

export const getPaymentMethodConfig = (methodId: PaymentMethodId) =>
  PAYMENT_METHOD_MAP[methodId];

export const getPaymentMethodIdentifier = (
  methodId: PaymentMethodId,
  status?: IPaymentStatusResponse | null,
) => {
  if (!status) return null;

  const method = getPaymentMethodConfig(methodId);

  for (const key of method.identifierKeys) {
    const value = status[key];
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }

  return null;
};
