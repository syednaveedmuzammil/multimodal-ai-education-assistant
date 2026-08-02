const APP_CONFIG = {
  appName: "LearnMate AI",

  tagline: "AI Education Assistant",

  version: "1.0.0",

  logo: "/logo.png",

  favicon: "/favicon.ico",

  author: "Team 23PWCS-B05",

  supportEmail: "team.learnmate@gmail.com",

  apiBaseUrl: import.meta.env.VITE_API_BASE_URL,

  environment: import.meta.env.MODE,

};

export default Object.freeze(APP_CONFIG);