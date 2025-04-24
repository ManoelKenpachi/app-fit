import React, { useState, useContext } from "react";
import { View, Text, ActivityIndicator, RefreshControl, ScrollView, TouchableOpacity, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthContext } from "../AuthContext";
import { api } from "../api";
import { styles } from "./styles";
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import ExerciseProgress from "../components/ExerciseProgress";

const WorkoutScreen = ({ route }) => {
  const navigation = useNavigation();
  const { logout } = useContext(AuthContext);
  const [workout, setWorkout] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showProgress, setShowProgress] = useState(false);

  const fetchWorkout = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        console.error("❌ Token não encontrado no AsyncStorage!");
        return;
      }

      const today = new Date();
      const weekdays = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
      const currentDay = weekdays[today.getDay()];
      
      // Primeiro busca todos os treinos do dia
      const allWorkouts = await api.get("/api/workouts");
      const todaysWorkouts = allWorkouts.data.filter(w => w.day === currentDay);
      
      if (todaysWorkouts.length === 0) {
        setWorkout(null);
        return;
      }

      // Se recebeu um novo ID de treino selecionado via navegação
      if (route.params?.selectedWorkoutId) {
        const selectedWorkout = todaysWorkouts.find(w => w.id === route.params.selectedWorkoutId);
        if (selectedWorkout) {
          setWorkout(selectedWorkout);
          // Salva o ID do treino selecionado
          await AsyncStorage.setItem(`selectedWorkout_${currentDay}`, selectedWorkout.id.toString());
        }
        // Limpa o parâmetro da rota após usar
        navigation.setParams({ selectedWorkoutId: undefined });
      } else {
        // Tenta pegar o ID do treino selecionado para o dia atual
        const selectedWorkoutId = await AsyncStorage.getItem(`selectedWorkout_${currentDay}`);
        
        if (selectedWorkoutId) {
          const selectedWorkout = todaysWorkouts.find(w => w.id === parseInt(selectedWorkoutId));
          if (selectedWorkout) {
            setWorkout(selectedWorkout);
          } else {
            // Se não encontrar o treino selecionado, usa o primeiro da lista
            setWorkout(todaysWorkouts[0]);
            await AsyncStorage.setItem(`selectedWorkout_${currentDay}`, todaysWorkouts[0].id.toString());
          }
        } else {
          // Se não houver treino selecionado, usa o primeiro da lista
          setWorkout(todaysWorkouts[0]);
          await AsyncStorage.setItem(`selectedWorkout_${currentDay}`, todaysWorkouts[0].id.toString());
        }
      }
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
    }, [route.params?.selectedWorkoutId])
  );

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchWorkout();
  }, []);

  const handleAddWorkout = () => {
    navigation.navigate('CreateWorkout');
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("token");
      await AsyncStorage.clear();
      logout();
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      Alert.alert("Erro", "Não foi possível fazer logout. Tente novamente.");
    }
  };

  const handleStartWorkout = () => {
    setShowProgress(true);
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Treino do Dia</Text>
      <View style={styles.headerButtons}>
        <TouchableOpacity 
          style={styles.headerButton} 
          onPress={handleAddWorkout}
        >
          <Ionicons name="add-outline" size={24} color="#BB86FC" />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.headerButton} 
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={24} color="#BB86FC" />
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#BB86FC" />
        <Text style={styles.loadingText}>Carregando seu treino...</Text>
      </View>
    );
  }

  if (!workout) {
    return (
      <View style={styles.container}>
        {renderHeader()}
        <View style={styles.emptyContainer}>
          <Text style={styles.noWorkoutText}>Nenhum treino encontrado para hoje</Text>
          <TouchableOpacity 
            style={styles.addWorkoutButton}
            onPress={() => navigation.navigate('CreateWorkout')}
          >
            <Ionicons name="add-circle-outline" size={48} color="#BB86FC" />
            <Text style={styles.addWorkoutText}>Adicionar Treino</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {renderHeader()}
      <ScrollView 
        contentContainerStyle={styles.contentContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.content}>
          <View style={styles.workoutHeader}>
            <Text style={styles.workoutName}>{workout.name}</Text>
          </View>

          {!showProgress ? (
            <>
              {workout.exercises.map((exercise) => (
                <View key={exercise.id} style={styles.exerciseCard}>
                  <Text style={styles.exerciseName}>{exercise.name}</Text>
                  <View style={styles.exerciseDetails}>
                    <Text style={styles.exerciseInfo}>
                      {exercise.sets} séries x {exercise.reps} reps
                    </Text>
                    {exercise.targetWeight && (
                      <Text style={styles.exerciseInfo}>
                        Meta: {exercise.targetWeight}kg
                      </Text>
                    )}
                  </View>
                </View>
              ))}
              <TouchableOpacity 
                style={styles.startButton}
                onPress={handleStartWorkout}
              >
                <Text style={styles.startButtonText}>Iniciar Treino</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              {workout.exercises.map((exercise) => (
                <ExerciseProgress 
                  key={exercise.id} 
                  exercise={exercise}
                  onComplete={() => {
                    if (exercise === workout.exercises[workout.exercises.length - 1]) {
                      Alert.alert(
                        "Parabéns!",
                        "Você completou o treino de hoje!"
                      );
                    }
                  }}
                />
              ))}
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default WorkoutScreen;
