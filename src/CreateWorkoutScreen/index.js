import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Modal,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { api } from '../api';
import { styles } from './styles';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DIAS_SEMANA = [
  'Domingo',
  'Segunda',
  'Terça',
  'Quarta',
  'Quinta',
  'Sexta',
  'Sábado'
];

const CreateWorkoutScreen = ({ route }) => {
  const navigation = useNavigation();
  const workoutToEdit = route.params?.workoutToEdit;
  const [workoutName, setWorkoutName] = useState(workoutToEdit?.name || '');
  const [workoutDay, setWorkoutDay] = useState(workoutToEdit?.day || DIAS_SEMANA[new Date().getDay()]);
  const [exercises, setExercises] = useState(
    workoutToEdit?.exercises.map(ex => ({
      name: ex.name,
      sets: ex.sets.toString(),
      reps: ex.reps ? ex.reps.toString() : '',
      targetWeight: ex.targetWeight ? ex.targetWeight.toString() : ''
    })) || []
  );
  const [showExerciseModal, setShowExerciseModal] = useState(false);
  const [showDayPicker, setShowDayPicker] = useState(false);
  const [existingWorkouts, setExistingWorkouts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentExercise, setCurrentExercise] = useState({
    name: '',
    sets: '',
    reps: '',
    targetWeight: ''
  });
  const [exerciseName, setExerciseName] = useState('');
  const [sets, setSets] = useState('');
  const [reps, setReps] = useState('');
  const [targetWeight, setTargetWeight] = useState('');

  const fetchWorkoutsForDay = async (day) => {
    try {
      setLoading(true);
      const response = await api.get('/api/workouts');
      
      if (response.data && Array.isArray(response.data)) {
        const workoutsForDay = response.data.filter(workout => workout.day === day);
        setExistingWorkouts(workoutsForDay);
      } else {
        console.error('Resposta inválida da API:', response.data);
        setExistingWorkouts([]);
      }
    } catch (error) {
      console.error('Erro ao buscar treinos:', error);
      setExistingWorkouts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkoutsForDay(workoutDay);
  }, [workoutDay]);

  const handleDaySelect = (day) => {
    setWorkoutDay(day);
    setShowDayPicker(false);
  };

  const handleAddExercise = () => {
    if (!exerciseName || !sets || !reps) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos');
      return;
    }

    const newExercise = {
      name: exerciseName,
      sets: parseInt(sets),
      reps: parseInt(reps),
      targetWeight: targetWeight ? parseFloat(targetWeight) : 0
    };

    setExercises([...exercises, newExercise]);
    setExerciseName('');
    setSets('');
    setReps('');
    setTargetWeight('');
    setShowExerciseModal(false);
  };

  const handleRemoveExercise = (index) => {
    const newExercises = exercises.filter((_, i) => i !== index);
    setExercises(newExercises);
  };

  const handleSaveWorkout = async () => {
    if (!workoutName || !workoutDay || exercises.length === 0) {
      Alert.alert('Erro', 'Por favor, preencha o nome do treino, selecione um dia e adicione pelo menos um exercício');
      return;
    }

    try {
      const workoutData = {
        name: workoutName,
        day: workoutDay,
        exercises: exercises.map(exercise => ({
          name: exercise.name,
          sets: parseInt(exercise.sets),
          reps: parseInt(exercise.reps),
          targetWeight: parseFloat(exercise.targetWeight) || 0
        }))
      };

      if (workoutToEdit) {
        await api.put(`/api/workouts/${workoutToEdit.id}`, workoutData);
        Alert.alert('Sucesso', 'Treino atualizado com sucesso!');
      } else {
        await api.post('/api/workouts', workoutData);
        Alert.alert('Sucesso', 'Treino criado com sucesso!');
      }

      await fetchWorkoutsForDay(workoutDay);
      navigation.goBack();
    } catch (error) {
      console.error('Erro ao salvar treino:', error);
      Alert.alert('Erro', 'Não foi possível salvar o treino. Tente novamente.');
    }
  };

  const handleDeleteWorkout = async (workoutId) => {
    try {
      await api.delete(`/api/workouts/${workoutId}`);
      setExistingWorkouts(prevWorkouts => prevWorkouts.filter(w => w.id !== workoutId));
      await fetchWorkoutsForDay(workoutDay);
    } catch (error) {
      console.error('Erro ao excluir treino:', error);
    }
  };

  const handleEditWorkout = (workout) => {
    // Atualiza o estado com os dados do treino selecionado
    setWorkoutName(workout.name);
    setWorkoutDay(workout.day);
    setExercises(workout.exercises.map(ex => ({
      name: ex.name,
      sets: ex.sets.toString(),
      reps: ex.reps ? ex.reps.toString() : '',
      targetWeight: ex.targetWeight ? ex.targetWeight.toString() : ''
    })));
    // Define o treino atual como o treino sendo editado
    route.params = { workoutToEdit: workout };
    // Atualiza o título da tela
    if (navigation.setOptions) {
      navigation.setOptions({
        title: 'Editar Treino'
      });
    }
    // Rola a tela para o topo
    if (scrollViewRef && scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ y: 0, animated: true });
    }
  };

  // Adiciona uma ref para o ScrollView
  const scrollViewRef = React.useRef(null);

  const renderExistingWorkouts = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#BB86FC" />
        </View>
      );
    }

    if (existingWorkouts.length === 0) {
      return (
        <Text style={styles.noWorkoutsText}>
          Nenhum treino cadastrado para {workoutDay}
        </Text>
      );
    }

    return existingWorkouts.map((workout, index) => (
      <View key={index} style={styles.existingWorkoutCard}>
        <View style={styles.workoutHeader}>
          <Text style={styles.existingWorkoutName}>{workout.name}</Text>
          <View style={styles.workoutActions}>
            <TouchableOpacity
              onPress={() => handleEditWorkout(workout)}
              style={styles.actionButton}
            >
              <Ionicons name="create-outline" size={20} color="#BB86FC" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleDeleteWorkout(workout.id)}
              style={styles.actionButton}
            >
              <Ionicons name="trash-outline" size={20} color="#FF4444" />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.exercisesList}>
          {workout.exercises.map((exercise, exerciseIndex) => (
            <Text key={exerciseIndex} style={styles.existingExerciseText}>
              • {exercise.name} ({exercise.sets} séries x {exercise.reps} reps)
            </Text>
          ))}
        </View>
      </View>
    ));
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#BB86FC" />
        </TouchableOpacity>
        <Text style={styles.title}>{workoutToEdit ? 'Editar Treino' : 'Criar Treino'}</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView 
        ref={scrollViewRef}
        style={styles.content}
        contentContainerStyle={styles.scrollViewContent}
      >
        <TextInput
          style={styles.input}
          placeholder="Nome do Treino"
          placeholderTextColor="#666"
          value={workoutName}
          onChangeText={setWorkoutName}
        />

        <TouchableOpacity
          style={styles.input}
          onPress={() => setShowDayPicker(true)}
        >
          <Text style={[styles.inputText, !workoutDay && styles.placeholderText]}>
            {workoutDay || "Selecione o dia da semana"}
          </Text>
        </TouchableOpacity>

        <View style={styles.existingWorkoutsSection}>
          <Text style={styles.existingWorkoutsTitle}>Treinos existentes para {workoutDay}:</Text>
          {renderExistingWorkouts()}
        </View>

        <View style={styles.exercisesHeader}>
          <Text style={styles.exercisesTitle}>Novo Treino - Exercícios</Text>
          <TouchableOpacity 
            style={styles.addExerciseButton}
            onPress={() => setShowExerciseModal(true)}
          >
            <Ionicons name="add" size={24} color="#BB86FC" />
          </TouchableOpacity>
        </View>

        {exercises.map((exercise, index) => (
          <View key={index} style={styles.exerciseItem}>
            <View style={styles.exerciseInfo}>
              <Text style={styles.exerciseName}>{exercise.name}</Text>
              <Text style={styles.exerciseDetails}>
                {exercise.sets} séries x {exercise.reps} reps
                {exercise.targetWeight > 0 ? ` • ${exercise.targetWeight}kg` : ''}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => {
                const newExercises = exercises.filter((_, i) => i !== index);
                setExercises(newExercises);
              }}
            >
              <Ionicons name="trash" size={24} color="#FF6B6B" />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      <TouchableOpacity 
        style={styles.saveButton}
        onPress={handleSaveWorkout}
      >
        <Text style={styles.saveButtonText}>Salvar Treino</Text>
      </TouchableOpacity>

      <Modal
        visible={showDayPicker}
        transparent
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Selecione o Dia</Text>
            
            <ScrollView>
              {DIAS_SEMANA.map((dia, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.dayOption,
                    workoutDay === dia && styles.selectedDayOption
                  ]}
                  onPress={() => {
                    setWorkoutDay(dia);
                    setShowDayPicker(false);
                  }}
                >
                  <Text style={[
                    styles.dayOptionText,
                    workoutDay === dia && styles.selectedDayOptionText
                  ]}>
                    {dia}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <TouchableOpacity 
              style={[styles.modalButton, styles.cancelButton]}
              onPress={() => setShowDayPicker(false)}
            >
              <Text style={styles.modalButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showExerciseModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowExerciseModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Adicionar Exercício</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Nome do Exercício"
              value={exerciseName}
              onChangeText={setExerciseName}
            />
            
            <TextInput
              style={styles.input}
              placeholder="Número de Séries"
              value={sets}
              onChangeText={setSets}
              keyboardType="numeric"
            />
            
            <TextInput
              style={styles.input}
              placeholder="Repetições por Série"
              value={reps}
              onChangeText={setReps}
              keyboardType="numeric"
            />

            <TextInput
              style={styles.input}
              placeholder="Peso (kg)"
              value={targetWeight}
              onChangeText={setTargetWeight}
              keyboardType="numeric"
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={styles.cancelButton} 
                onPress={() => {
                  setShowExerciseModal(false);
                  setExerciseName('');
                  setSets('');
                  setReps('');
                  setTargetWeight('');
                }}
              >
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.addButton} 
                onPress={handleAddExercise}
              >
                <Text style={styles.buttonText}>Adicionar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default CreateWorkoutScreen; 