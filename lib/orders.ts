export type Order = {
  number: string;
  email: string;
  customerName: string;
  placedAt: string;
  status: "processing" | "shipped" | "delivered" | "returned";
  carrier: "USPS" | "FedEx" | "UPS" | null;
  trackingNumber: string | null;
  expectedDelivery: string | null;
  items: { title: string; quantity: number; price: number }[];
  total: number;
};

// Fake order book for the Maya demo. The numbers are designed to be easy to
// remember during a live sales demo: 1001 is in transit, 1002 is delivered,
// 1003 is a return scenario.
export const ORDERS: Order[] = [
  {
    number: "1001",
    email: "demo@retail-agent.co",
    customerName: "Alex Chen",
    placedAt: "2026-05-08",
    status: "shipped",
    carrier: "FedEx",
    trackingNumber: "788912340012",
    expectedDelivery: "2026-05-15",
    items: [{ title: "Lila Solitaire — 0.5ct lab diamond", quantity: 1, price: 1480 }],
    total: 1480
  },
  {
    number: "1002",
    email: "demo@retail-agent.co",
    customerName: "Alex Chen",
    placedAt: "2026-04-22",
    status: "delivered",
    carrier: "USPS",
    trackingNumber: "9400111202557812345678",
    expectedDelivery: "2026-04-28",
    items: [
      { title: "June Pearl Studs", quantity: 1, price: 220 },
      { title: "Drift Cable Bracelet", quantity: 1, price: 410 }
    ],
    total: 630
  },
  {
    number: "1003",
    email: "returner@retail-agent.co",
    customerName: "Sam Rivera",
    placedAt: "2026-04-30",
    status: "delivered",
    carrier: "UPS",
    trackingNumber: "1Z999AA10123456784",
    expectedDelivery: "2026-05-04",
    items: [{ title: "Hart Signet Ring", quantity: 1, price: 640 }],
    total: 640
  }
];

export function findOrder(opts: { number?: string; email?: string }) {
  return ORDERS.find((o) => {
    if (opts.number && o.number !== opts.number.replace(/[^0-9]/g, "")) return false;
    if (opts.email && o.email.toLowerCase() !== opts.email.toLowerCase()) return false;
    return true;
  });
}
