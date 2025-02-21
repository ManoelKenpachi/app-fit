import React, { useState, useEffect, useContext } from "react";
import { View, Text, FlatList, ActivityIndicator, Button } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthContext } from "../AuthContext";
import { api } from "../api";
import { styles } from "./styles";

const WorkoutScreen = ({ navigation }) => {
  const { logout } = useContext(AuthContext);
  const [workout, setWorkout] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWorkout = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        console.log("Token JWT armazenado:", token); // 🔥 Verifique se o token foi salvo corretamente
    
        if (!token) {
          console.error("❌ Token não encontrado no AsyncStorage!");
          return;
        }
    
        const response = await api.get("/api/workout-today", {
          headers: {
            Authorization: `Bearer ${token}`, // 🔥 O token precisa estar aqui
          },
        });
    
        setWorkout(response.data);
      } catch (error) {
        console.error("❌ Erro ao buscar treino:", error.response ? error.response.data : error.message);
      } finally {
        setLoading(false);
      }
    };
      

    fetchWorkout();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Treino do Dia</Text>

      {workout && workout.name ? (
        <>
          <Text style={styles.subtitle}>{workout.name}</Text>
          <FlatList
            data={workout.exercises}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.exerciseCard}>
                <Text style={styles.exerciseName}>{item.name}</Text>
                <Text style={styles.exerciseInfo}>Séries: {item.sets}</Text>
              </View>
            )}
          />
        </>
      ) : (
        <Text style={styles.noWorkout}>Nenhum treino planejado para hoje.</Text>
      )}

      <Button title="Sair" onPress={logout} />
    </View>
  );
};

export default WorkoutScreen;
