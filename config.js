import dotenv from 'dotenv';

dotenv.config();

const {
    GITHUB_TOKEN,
    OPENAI_API_KEY,
    OPENWEATHER_API_KEY,
    PORT,
    API_KEY,
    AUTH_DOMAIN,
    PROJECT_ID,
    STORAGE_BUCKET,
    MESSAGING_SENDER_ID,
    APP_ID,
  } = process.env;
  
  
  export default {
    githubToken : GITHUB_TOKEN,
    OpenAiApiKey : OPENAI_API_KEY,
    OpenWeatherApiKey : OPENWEATHER_API_KEY,
    port: PORT,
    firebaseConfig: {
      apiKey: API_KEY,
      authDomain: AUTH_DOMAIN,
      projectId: PROJECT_ID,
      storageBucket: STORAGE_BUCKET,
      messagingSenderId: MESSAGING_SENDER_ID,
      appId: APP_ID,
    },
  };