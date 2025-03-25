import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { api } from '../api';

const ExerciseProgress = ({ exercise, onComplete }) => {
  const [currentSet, setCurrentSet] = useState(1);
  const [weight, setWeight] = useState(exercise.targetWeight ? exercise.targetWeight.toString() : '0');
  const [reps, setReps] = useState(exercise.reps ? exercise.reps.toString() : '');
  const [progress, setProgress] = useState([]);
  const [editingSet, setEditingSet] = useState(null);
  const [targetWeight, setTargetWeight] = useState(exercise.targetWeight ? exercise.targetWeight.toString() : '0');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadProgress();
    loadLastWeight();
  }, [exercise]);

  const loadLastWeight = async () => {
    try {
      const response = await api.get(`/api/progress/${exercise.id}/last-weight`);
      if (response.data && response.data.weight) {
        const lastWeight = response.data.weight.toString();
        setTargetWeight(lastWeight);
        if (!weight || weight === '0') {
          setWeight(lastWeight);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar última carga:', error);
    }
  };

  const loadProgress = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/api/progress/${exercise.id}`);
      setProgress(response.data);
      if (response.data.length < exercise.sets) {
        setCurrentSet(response.data.length + 1);
        if (response.data.length > 0) {
          const lastProgress = response.data[response.data.length - 1];
          setWeight(lastProgress.weight.toString());
        }
      }
    } catch (error) {
      console.error('Erro ao carregar progresso:', error);
      Alert.alert('Erro', 'Não foi possível carregar o progresso do exercício');
    } finally {
      setLoading(false);
    }
  };

  const handleSetComplete = async () => {
    if (!weight) {
      Alert.alert('Erro', 'Por favor, preencha o peso');
      return;
    }

    const repsToSubmit = reps || exercise.reps;

    try {
      setLoading(true);
      const response = await api.post(`/api/progress/${exercise.id}`, {
        weight: parseFloat(weight),
        reps: parseInt(repsToSubmit),
        set: currentSet
      });

      if (response.data && response.data.progress) {
        const updatedProgress = [...progress, response.data.progress];
        setProgress(updatedProgress);

        if (response.data.message) {
          Alert.alert('Sucesso', response.data.message);
        }

        if (response.data.suggestedWeight) {
          setTargetWeight(response.data.suggestedWeight.toString());
        }

        if (response.data.isCompleted) {
          if (onComplete) {
            onComplete();
          }
        } else if (currentSet < exercise.sets) {
          setCurrentSet(currentSet + 1);
          setReps(exercise.reps ? exercise.reps.toString() : '');
        }
      }
    } catch (error) {
      console.error('Erro ao registrar progresso:', error);
      Alert.alert('Erro', 'Não foi possível registrar o progresso');
    } finally {
      setLoading(false);
    }
  };

  const handleEditSet = (p, index) => {
    setEditingSet(index);
    setWeight(p.weight.toString());
    setReps(p.reps.toString());
  };

  const handleUpdateSet = async (progressId) => {
    if (!weight) {
      Alert.alert('Erro', 'Por favor, preencha o peso');
      return;
    }

    try {
      setLoading(true);
      const response = await api.put(`/api/progress/${progressId}`, {
        weight: parseFloat(weight),
        reps: parseInt(reps || exercise.reps)
      });

      if (response.data) {
        const updatedProgress = progress.map(p => 
          p.id === progressId ? response.data : p
        );
        
        setProgress(updatedProgress);
        setEditingSet(null);
        setReps(exercise.reps ? exercise.reps.toString() : '');
        
        // Recarrega o progresso para garantir que está sincronizado
        await loadProgress();
      }
    } catch (error) {
      console.error('Erro ao atualizar série:', error);
      Alert.alert('Erro', 'Não foi possível atualizar a série');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.exerciseName}>{exercise.name}</Text>
      <View style={styles.headerInfo}>
        <Text style={styles.setInfo}>
          {currentSet <= exercise.sets ? `Série ${currentSet} de ${exercise.sets}` : 'Séries Completadas'}
        </Text>
        {targetWeight && (
          <Text style={styles.targetWeight}>Meta: {targetWeight}kg x {exercise.reps} reps</Text>
        )}
      </View>

      {currentSet <= exercise.sets && (
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Peso (kg)</Text>
            <TextInput
              style={styles.input}
              value={weight}
              onChangeText={setWeight}
              keyboardType="numeric"
              placeholder={targetWeight || "0.0"}
              placeholderTextColor="#666"
              editable={!loading}
            />
          </View>

          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Repetições (opcional)</Text>
            <TextInput
              style={styles.input}
              value={reps}
              onChangeText={setReps}
              keyboardType="numeric"
              placeholder={exercise.reps ? exercise.reps.toString() : "0"}
              placeholderTextColor="#666"
              editable={!loading}
            />
          </View>
        </View>
      )}

      {currentSet <= exercise.sets && (
        <TouchableOpacity 
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleSetComplete}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Registrando...' : 'Registrar Série'}
          </Text>
        </TouchableOpacity>
      )}

      <View style={styles.progressContainer}>
        <Text style={styles.progressTitle}>Séries Completadas:</Text>
        {progress.map((p, index) => (
          <View key={index} style={styles.progressRow}>
            {editingSet === index ? (
              <>
                <View style={styles.editInputContainer}>
                  <TextInput
                    style={styles.editInput}
                    value={weight}
                    onChangeText={setWeight}
                    keyboardType="numeric"
                    placeholder={p.weight.toString()}
                    placeholderTextColor="#666"
                    editable={!loading}
                  />
                  <TextInput
                    style={styles.editInput}
                    value={reps}
                    onChangeText={setReps}
                    keyboardType="numeric"
                    placeholder={p.reps.toString()}
                    placeholderTextColor="#666"
                    editable={!loading}
                  />
                </View>
                <TouchableOpacity 
                  style={[styles.editButton, loading && styles.buttonDisabled]}
                  onPress={() => handleUpdateSet(p.id)}
                  disabled={loading}
                >
                  <Text style={styles.editButtonText}>
                    {loading ? 'Salvando...' : 'Salvar'}
                  </Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Text style={[
                  styles.progressText,
                  p.reps >= exercise.reps && p.weight >= parseFloat(targetWeight) && styles.completedSet
                ]}>
                  Série {p.set}: {p.weight}kg x {p.reps} reps
                </Text>
                <TouchableOpacity 
                  style={styles.editButton}
                  onPress={() => handleEditSet(p, index)}
                  disabled={loading}
                >
                  <Text style={styles.editButtonText}>Editar</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        ))}
      </View>

      {progress.length >= exercise.sets && (
        <TouchableOpacity 
          style={[styles.addSetButton, loading && styles.buttonDisabled]}
          onPress={() => {
            setCurrentSet(progress.length + 1);
          }}
          disabled={loading}
        >
          <Text style={styles.addSetButtonText}>+ Adicionar Série Extra</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#121212',
  },
  exerciseName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  headerInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  setInfo: {
    fontSize: 18,
    color: '#BB86FC',
  },
  targetWeight: {
    fontSize: 16,
    color: '#03DAC6',
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputWrapper: {
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 4,
  },
  input: {
    backgroundColor: '#2C2C2C',
    borderWidth: 1,
    borderColor: '#BB86FC',
    borderRadius: 8,
    padding: 12,
    color: '#fff',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#BB86FC',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 24,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
  },
  progressContainer: {
    marginTop: 16,
  },
  progressTitle: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 12,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    backgroundColor: '#2C2C2C',
    padding: 12,
    borderRadius: 8,
  },
  progressText: {
    fontSize: 16,
    color: '#fff',
    flex: 1,
  },
  completedSet: {
    color: '#03DAC6',
  },
  editInputContainer: {
    flex: 1,
    flexDirection: 'row',
    marginRight: 8,
  },
  editInput: {
    flex: 1,
    backgroundColor: '#1C1C1C',
    borderWidth: 1,
    borderColor: '#BB86FC',
    borderRadius: 4,
    padding: 8,
    marginRight: 8,
    color: '#fff',
  },
  editButton: {
    backgroundColor: '#2C2C2C',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#BB86FC',
  },
  editButtonText: {
    color: '#BB86FC',
    fontSize: 14,
  },
  addSetButton: {
    backgroundColor: '#2C2C2C',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#BB86FC',
  },
  addSetButtonText: {
    color: '#BB86FC',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ExerciseProgress; 