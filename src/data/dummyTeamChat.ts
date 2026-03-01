export interface Channel {
  id: string;
  name: string;
  type: "general" | "job";
  jobId?: string;
  icon: string;
  unread: number;
}

export interface ChatMessage {
  id: string;
  channelId: string;
  author: string;
  avatar: string;
  text: string;
  timestamp: string;
  mentions?: string[];
  isManagement?: boolean;
}

export const CHANNELS: Channel[] = [
  { id: "general", name: "General", type: "general", icon: "📢", unread: 2 },
  { id: "announcements", name: "Announcements", type: "general", icon: "📋", unread: 1 },
  { id: "job-tb0501", name: "#kitchen-plumbing", type: "job", jobId: "TB-0501", icon: "🔧", unread: 0 },
  { id: "job-tb0503", name: "#bathroom-reno", type: "job", jobId: "TB-0503", icon: "🚿", unread: 3 },
  { id: "job-tb0505", name: "#deck-lighting", type: "job", jobId: "TB-0505", icon: "💡", unread: 0 },
  { id: "job-tb0502", name: "#roof-repair", type: "job", jobId: "TB-0502", icon: "🏠", unread: 1 },
];

export const STAFF_LIST = [
  { name: "Jake Turner", avatar: "JT" },
  { name: "Ben Kowalski", avatar: "BK" },
  { name: "Maia Johnson", avatar: "MJ" },
  { name: "Craig Foster", avatar: "CF" },
  { name: "Sam Te Reo", avatar: "ST" },
  { name: "Dave", avatar: "DV" },
  { name: "Mike", avatar: "MK" },
  { name: "Tama", avatar: "TM" },
  { name: "Lisa", avatar: "LS" },
  { name: "Hemi", avatar: "HM" },
];

export const INITIAL_MESSAGES: ChatMessage[] = [
  // General
  { id: "m1", channelId: "general", author: "Management", avatar: "🏢", text: "Morning team — toolbox talk at 7:15am Monday. Don't forget your PPE.", timestamp: "Today 6:45am", isManagement: true },
  { id: "m2", channelId: "general", author: "Jake Turner", avatar: "JT", text: "Copy that 👍", timestamp: "Today 6:50am" },
  { id: "m3", channelId: "general", author: "Tama", avatar: "TM", text: "Running 10 mins late, traffic on the motorway", timestamp: "Today 7:02am" },
  { id: "m4", channelId: "general", author: "Management", avatar: "🏢", text: "No worries @Tama. @Dave can you grab the extra fittings from the van?", timestamp: "Today 7:05am", mentions: ["Tama", "Dave"], isManagement: true },

  // Announcements
  { id: "m5", channelId: "announcements", author: "Management", avatar: "🏢", text: "New H&S policy update — all staff must read the updated manual on the Hub by Friday.", timestamp: "Yesterday 4:30pm", isManagement: true },
  { id: "m6", channelId: "announcements", author: "Management", avatar: "🏢", text: "Reminder: timesheets due by 5pm Friday. Late submissions delay pay run.", timestamp: "Mon 9:00am", isManagement: true },

  // #kitchen-plumbing
  { id: "m7", channelId: "job-tb0501", author: "Dave", avatar: "DV", text: "Started demo on the kitchen. Old pipes are copper — will need adapters for the new PEX.", timestamp: "Today 8:30am" },
  { id: "m8", channelId: "job-tb0501", author: "Jake Turner", avatar: "JT", text: "I've got spare adapters in the van, will drop them over at smoko", timestamp: "Today 9:15am" },

  // #bathroom-reno
  { id: "m9", channelId: "job-tb0503", author: "Tama", avatar: "TM", text: "Waterproofing done on day 1. Tiler can come Thursday.", timestamp: "Today 3:00pm" },
  { id: "m10", channelId: "job-tb0503", author: "Management", avatar: "🏢", text: "@Tama great progress. Client confirmed they want the grey tiles not white — updated on the quote.", timestamp: "Today 3:20pm", mentions: ["Tama"], isManagement: true },
  { id: "m11", channelId: "job-tb0503", author: "Maia Johnson", avatar: "MJ", text: "Plumbing rough-in complete. Ready for gib stopping.", timestamp: "Today 4:00pm" },

  // #roof-repair
  { id: "m12", channelId: "job-tb0502", author: "Mike", avatar: "MK", text: "Found extra damage on the south side. Will need another day. @Management can you let the client know?", timestamp: "Today 11:00am", mentions: ["Management"] },
];

export interface QuickNote {
  id: string;
  text: string;
  author: string;
  timestamp: string;
  jobId?: string;
  jobName?: string;
  isVoice?: boolean;
  voiceDuration?: string;
  assignedTo?: string;
  alertType?: "none" | "alert" | "timer";
  timerMinutes?: number;
  priority?: "normal" | "urgent";
}

export const INITIAL_NOTES: QuickNote[] = [
  { id: "qn1", text: "Client wants work done before Christmas. Confirmed access via side gate — code is 4821.", author: "Jake Turner", timestamp: "2 hours ago", jobId: "TB-0501", jobName: "Kitchen Plumbing" },
  { id: "qn2", text: "Customer needs another heat pump quote — rang while you were on site.", author: "Management", timestamp: "2 hours ago", assignedTo: "Dave", alertType: "alert", priority: "urgent", jobId: "TB-0511", jobName: "Heat Pump Install" },
  { id: "qn3", text: "Left materials in garage. Client happy for us to come and go.", author: "Ben Kowalski", timestamp: "Yesterday", jobId: "TB-0503", jobName: "Bathroom Reno" },
  { id: "qn4", text: "Chase up tile supplier — they said samples arrive by 2pm.", author: "Tama", timestamp: "Yesterday", assignedTo: "Tama", alertType: "timer", timerMinutes: 45 },
  { id: "qn5", text: "Site walkthrough complete — all good to proceed. Measured up for the vanity unit.", author: "Jake Turner", timestamp: "Yesterday", isVoice: true, voiceDuration: "0:42", jobId: "TB-0503", jobName: "Bathroom Reno" },
  { id: "qn6", text: "Need to order more 15mm copper pipe — supplier out of stock until Thursday.", author: "Dave", timestamp: "2 days ago" },
  { id: "qn7", text: "Ring back Mrs Mitchell about the quote revision — she wants to add a second bathroom.", author: "Management", timestamp: "3 hours ago", assignedTo: "Mike", alertType: "alert", priority: "normal" },
];
