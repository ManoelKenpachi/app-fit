import React, { useEffect } from 'react';
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { initDatabase } from './src/services/database';
import WorkoutScreen from "./src/WorkoutScreen/index.js";
import LoginScreen from "./src/LoginScreen/index.js";
import CreateWorkoutScreen from "./src/CreateWorkoutScreen/index.js";
import { AuthProvider } from "./src/AuthContext/index.js";

const Stack = createStackNavigator();

export default function App() {
  useEffect(() => {
    // Inicializa o banco de dados quando o app inicia
    initDatabase()
      .then(() => console.log('Database initialized'))
      .catch(error => console.error('Database init error:', error));
  }, []);

  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator 
          initialRouteName="LoginScreen"
          screenOptions={{
            headerStyle: {
              backgroundColor: '#121212',
            },
            headerTintColor: '#BB86FC',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
            headerShown: false
          }}
        >
          <Stack.Screen 
            name="LoginScreen" 
            component={LoginScreen}
            options={{ title: 'Login' }}
          />
          <Stack.Screen 
            name="WorkoutScreen" 
            component={WorkoutScreen}
            options={{ title: 'Meus Treinos' }}
          />
          <Stack.Screen 
            name="CreateWorkout" 
            component={CreateWorkoutScreen}
            options={{ title: 'Criar Treino' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}
