import React from "react";
import LoginScreen from "./src/LoginScreen/index.js";
import { AuthProvider } from "./src/AuthContext/index.js";

const App = () => (
  <AuthProvider>
    <LoginScreen />
  </AuthProvider>
);

export default App;
