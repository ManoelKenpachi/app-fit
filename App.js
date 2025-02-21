import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import WorkoutScreen from "./src/WorkoutScreen/index.js";

import LoginScreen from "./src/LoginScreen/index.js";
import { AuthProvider } from "./src/AuthContext/index.js";

const Stack = createStackNavigator();

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="LoginScreen">
          <Stack.Screen name="LoginScreen" component={LoginScreen} options={{ title: "Login" }} />
          <Stack.Screen name="WorkoutScreen" component={WorkoutScreen} options={{ title: "Meu Treino" }} />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}
