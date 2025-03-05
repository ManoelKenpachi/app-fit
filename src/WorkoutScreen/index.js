import React, { useState, useEffect, useContext } from "react";
import { View, Text, FlatList, ActivityIndicator, RefreshControl, ScrollView, TouchableOpacity, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthContext } from "../AuthContext";
import { api } from "../api";
import { styles } from "./styles";
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from "@react-navigation/native";

const WorkoutScreen = () => {
  const navigation = useNavigation();
  const { logout } = useContext(AuthContext);
  const [workout, setWorkout] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchWorkout = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        console.error("❌ Token não encontrado no AsyncStorage!");
        return;
      }

      const response = await api.get("/api/workouts/workout-today");
      console.log("Resposta do servidor:", response.data);
      setWorkout(response.data);
    } catch (error) {
      console.error("❌ Erro ao buscar treino:", error.response ? error.response.data : error.message);
      Alert.alert("Erro", "Não foi possível carregar o treino. Tente novamente.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchWorkout();
    }, [])
  );

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchWorkout();
  }, []);

  const handleAddWorkout = () => {
    navigation.navigate('CreateWorkout');
  };

  const handleEditWorkout = () => {
    if (workout && workout.id) {
      navigation.navigate('CreateWorkout', { workoutToEdit: workout });
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("token");
      await AsyncStorage.clear();
      logout();
      navigation.reset({
        index: 0,
        routes: [{ name: 'LoginScreen' }]
      });
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      Alert.alert("Erro", "Não foi possível fazer logout. Tente novamente.");
    }
  };

  const handleDeleteWorkout = async () => {
    if (!workout || !workout.id) return;

    Alert.alert(
      "Confirmar exclusão",
      "Tem certeza que deseja excluir este treino?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              await api.delete(`/api/workouts/${workout.id}`);
              Alert.alert("Sucesso", "Treino excluído com sucesso!");
              fetchWorkout();
            } catch (error) {
              console.error("Erro ao excluir treino:", error);
              Alert.alert("Erro", "Não foi possível excluir o treino. Tente novamente.");
            }
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#BB86FC" />
        <Text style={styles.loadingText}>Carregando seu treino...</Text>
      </View>
    );
  }

  const renderExerciseItem = ({ item }) => (
    <View style={styles.exerciseCard}>
      <Text style={styles.exerciseName}>{item.name}</Text>
      <View style={styles.exerciseDetails}>
        <Text style={styles.exerciseInfo}>Séries: {item.sets}</Text>
        {item.reps && (
          <Text style={styles.exerciseInfo}>Reps: {item.reps}</Text>
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Treino do Dia</Text>
        <TouchableOpacity 
          style={styles.logoutButton} 
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={24} color="#BB86FC" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        contentContainerStyle={styles.contentContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {workout ? (
          <View style={styles.content}>
            <View style={styles.workoutHeader}>
              <Text style={styles.workoutName}>{workout.name}</Text>
              {workout.id && (
                <TouchableOpacity 
                  style={styles.editButton}
                  onPress={handleEditWorkout}
                >
                  <Ionicons name="create-outline" size={24} color="#BB86FC" />
                </TouchableOpacity>
              )}
            </View>

            {workout.exercises && workout.exercises.length > 0 ? (
              <FlatList
                data={workout.exercises}
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderExerciseItem}
                scrollEnabled={false}
              />
            ) : (
              <View style={styles.emptyContainer}>
                <Text style={styles.noWorkout}>{workout.message || "Nenhum exercício para hoje."}</Text>
                <Text style={styles.emptySubtitle}>Puxe para baixo para atualizar</Text>
              </View>
            )}
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.noWorkout}>Erro ao carregar o treino</Text>
            <Text style={styles.emptySubtitle}>Puxe para baixo para tentar novamente</Text>
          </View>
        )}
      </ScrollView>
      
      <TouchableOpacity 
        style={styles.fab}
        onPress={handleAddWorkout}
      >
        <Ionicons name="add" size={30} color="#121212" />
      </TouchableOpacity>
    </View>
  );
};

export default WorkoutScreen;
