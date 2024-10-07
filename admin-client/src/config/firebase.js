import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage"; 

const firebaseConfig = {
  apiKey: "AIzaSyAJvxJLfqDuvz1PkvS6owMnLl0CNDXf4QE",
  authDomain: "directorytesting-d3c83.firebaseapp.com",
  projectId: "directorytesting-d3c83",
  storageBucket: "directorytesting-d3c83.appspot.com",
  messagingSenderId: "712981546990",
  appId: "1:712981546990:web:5a9cc31531edc68ea970ff",
  measurementId: "G-6TB1J1D7X3"
};

const app = initializeApp(firebaseConfig);

export const storage = getStorage(app);
