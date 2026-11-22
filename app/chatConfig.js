// Settings for the chat assistant. Edit the two lines marked (optional) to unlock more features.
const base = process.env.NEXT_PUBLIC_BASE_PATH || '';

export const chat = {
  assistantName: "Shohagh's AI assistant",
  whatsapp: '8801875601397',
  phoneDisplay: '+880 1875 601397',
  email: 'Shahedur6@gmail.com',
  timezoneNote: 'Shohagh is based in Bangladesh (GMT+6).',

  // (optional) Paste a Calendly / Cal.com / Google Calendar booking link to show an "Open calendar" button.
  bookingUrl: '',

  // (optional) Paste your AI backend URL (see AI-AGENT-GUIDE.md) to switch from scripted answers to a real AI agent.
  apiUrl: '',

  links: {
    linkedin: 'https://www.linkedin.com/in/md-shahedur-rahman98/',
    github: 'https://github.com/srshohagh',
    youtube: 'https://www.youtube.com/@shahedurrahman4909',
    resume: `${base}/resume.pdf`,
  },
};
