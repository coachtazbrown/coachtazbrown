// Seeded support inbox for the Pip demo. Each ticket is hand-crafted to
// exercise one of Pip's three actions: auto_resolve (within policy),
// draft_reply (needs operator approval), and escalate_to_human (out of
// policy, defective item, or low-confidence).

export type Ticket = {
  id: string;
  subject: string;
  body: string;
  customerName: string;
  customerEmail: string;
  orderNumber: string | null;
  channel: "email" | "chat" | "instagram";
  receivedAt: string;
  expectedAction: "auto_resolve" | "draft_reply" | "escalate_to_human";
};

export const TICKETS: Ticket[] = [
  {
    id: "tk_001",
    subject: "Where is my order?",
    body:
      "Hi — I ordered the Lila Solitaire on Friday and haven't gotten a shipping notice yet. Order number is 1001, email demo@retail-agent.co. Just want to know if it's on the way. Thanks!",
    customerName: "Alex Chen",
    customerEmail: "demo@retail-agent.co",
    orderNumber: "1001",
    channel: "email",
    receivedAt: "2026-05-13 09:14",
    expectedAction: "auto_resolve"
  },
  {
    id: "tk_002",
    subject: "Return — pearls don't fit",
    body:
      "I got the June pearl studs (order 1002) for my mom and the posts are too thick for her ears. Can I exchange them for the silver version? Email is demo@retail-agent.co.",
    customerName: "Alex Chen",
    customerEmail: "demo@retail-agent.co",
    orderNumber: "1002",
    channel: "email",
    receivedAt: "2026-05-13 08:47",
    expectedAction: "draft_reply"
  },
  {
    id: "tk_003",
    subject: "Chip in the diamond??",
    body:
      "Hi, I just got my Lila Solitaire and there's what looks like a chip on the edge of the stone. Pictures attached. This was supposed to be the engagement ring this weekend. Help.",
    customerName: "Jordan W.",
    customerEmail: "jw@example.com",
    orderNumber: null,
    channel: "email",
    receivedAt: "2026-05-13 07:22",
    expectedAction: "escalate_to_human"
  },
  {
    id: "tk_004",
    subject: "Address change",
    body:
      "I moved on the 1st. Can you update the shipping address on order 1003 to 88 Federal Street, Providence RI 02903? Email is returner@retail-agent.co.",
    customerName: "Sam Rivera",
    customerEmail: "returner@retail-agent.co",
    orderNumber: "1003",
    channel: "email",
    receivedAt: "2026-05-13 06:58",
    expectedAction: "auto_resolve"
  },
  {
    id: "tk_005",
    subject: "Engraving in Mandarin?",
    body:
      "Hello — looking at the Hart Signet for a gift. Can you engrave a Mandarin character (诚) instead of three Latin initials? Is that something your atelier handles?",
    customerName: "Wei L.",
    customerEmail: "wei@example.com",
    orderNumber: null,
    channel: "chat",
    receivedAt: "2026-05-12 21:03",
    expectedAction: "escalate_to_human"
  },
  {
    id: "tk_006",
    subject: "Tracking says delivered, never arrived",
    body:
      "USPS says my order was delivered yesterday but it's not at my door, not with neighbors, nothing. Order 1002, demo@retail-agent.co. What's the next step?",
    customerName: "Alex Chen",
    customerEmail: "demo@retail-agent.co",
    orderNumber: "1002",
    channel: "email",
    receivedAt: "2026-05-12 19:41",
    expectedAction: "draft_reply"
  },
  {
    id: "tk_007",
    subject: "Ring sizing question",
    body:
      "How does your sizing work for the Lila? I'm a 6.5 in most brands but read online your bands run a quarter-size small. Want to make sure I order right.",
    customerName: "Priya M.",
    customerEmail: "pm@example.com",
    orderNumber: null,
    channel: "instagram",
    receivedAt: "2026-05-12 16:30",
    expectedAction: "draft_reply"
  },
  {
    id: "tk_008",
    subject: "Cancel order please",
    body:
      "I ordered the wrong ring (order 1003 - meant the white gold version). Can you cancel and refund so I can re-order? Email returner@retail-agent.co. Order is from a few days ago.",
    customerName: "Sam Rivera",
    customerEmail: "returner@retail-agent.co",
    orderNumber: "1003",
    channel: "email",
    receivedAt: "2026-05-12 14:12",
    expectedAction: "escalate_to_human"
  }
];

export function getTicket(id: string) {
  return TICKETS.find((t) => t.id === id);
}
