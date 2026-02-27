export interface Message {
  id: string;
  channel: "sms" | "email";
  direction: "outbound" | "inbound";
  subject?: string;
  body: string;
  timestamp: string;
  status: "Sent" | "Delivered" | "Opened" | "Replied" | "Failed";
}

export const dummyMessages: Message[] = [
  {
    id: "msg-1",
    channel: "email",
    direction: "outbound",
    subject: "Your quote from Spark Electrical is ready",
    body: "Hi Sarah,\n\nThanks for getting in touch. Please find your quote for $4,200 attached.\n\nLet us know if you have any questions.\n\nCheers,\nSpark Electrical",
    timestamp: "2026-02-20 09:15",
    status: "Opened",
  },
  {
    id: "msg-2",
    channel: "sms",
    direction: "outbound",
    body: "Hi Sarah, your quote for $4,200 from Spark Electrical is ready. Check your email for details!",
    timestamp: "2026-02-20 09:16",
    status: "Delivered",
  },
  {
    id: "msg-3",
    channel: "sms",
    direction: "inbound",
    body: "Thanks! Will have a look tonight and get back to you 👍",
    timestamp: "2026-02-20 12:43",
    status: "Replied",
  },
  {
    id: "msg-4",
    channel: "email",
    direction: "outbound",
    subject: "Following up on your quote",
    body: "Hi Sarah,\n\nJust checking in to see if you had any questions about the quote we sent through.\n\nHappy to chat anytime.\n\nCheers,\nSpark Electrical",
    timestamp: "2026-02-23 08:00",
    status: "Opened",
  },
  {
    id: "msg-5",
    channel: "sms",
    direction: "outbound",
    body: "Hi Sarah, just following up on the quote we sent. Any questions? Reply or call us anytime. — Spark Electrical",
    timestamp: "2026-02-25 09:00",
    status: "Delivered",
  },
  {
    id: "msg-6",
    channel: "sms",
    direction: "inbound",
    body: "Hey, looks good! Can you start next week?",
    timestamp: "2026-02-25 17:22",
    status: "Replied",
  },
  {
    id: "msg-7",
    channel: "email",
    direction: "inbound",
    subject: "Re: Following up on your quote",
    body: "Hi,\n\nYep all good to go ahead. Can you confirm a start date?\n\nThanks,\nSarah",
    timestamp: "2026-02-25 17:30",
    status: "Replied",
  },
  {
    id: "msg-8",
    channel: "sms",
    direction: "outbound",
    body: "Awesome! We'll schedule you in for Monday. See you then! — Spark Electrical",
    timestamp: "2026-02-26 08:45",
    status: "Delivered",
  },
];
