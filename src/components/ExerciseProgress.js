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
      if (response.data && response.data.weight !== undefined) {
        const lastWeight = response.data.weight.toString();
        setTargetWeight(lastWeight);
        if (!weight || weight === '0') {
          setWeight(lastWeight);
        }
      } else if (exercise.targetWeight) {
        setWeight(exercise.targetWeight.toString());
        setTargetWeight(exercise.targetWeight.toString());
      }
    } catch (error) {
      console.error('Erro ao carregar última carga:', error);
      if (exercise.targetWeight) {
        setWeight(exercise.targetWeight.toString());
        setTargetWeight(exercise.targetWeight.toString());
      }
    }
  };

  const loadProgress = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/api/progress/${exercise.id}/list`);
      setProgress(response.data);
      
      // Atualiza o currentSet baseado no progresso
      if (response.data.length >= exercise.sets) {
        setCurrentSet(exercise.sets + 1); // Todas as séries completadas
      } else {
        setCurrentSet(response.data.length + 1); // Próxima série
      }

      // Atualiza o peso baseado no último progresso
      if (response.data.length > 0) {
        const lastProgress = response.data[response.data.length - 1];
        const weightValue = lastProgress.weight;
        setWeight(weightValue > 0 ? weightValue.toString() : '');
      }
    } catch (error) {
      console.error('Erro ao carregar progresso:', error);
      Alert.alert('Erro', 'Não foi possível carregar o progresso do exercício');
    } finally {
      setLoading(false);
    }
  };

  const handleSetComplete = async () => {
    let weightValue = weight ? parseFloat(weight) : 0;
    if (isNaN(weightValue) || weightValue < 0) {
      Alert.alert('Erro', 'O peso deve ser um número válido maior ou igual a 0');
      return;
    }

    const repsToSubmit = reps || exercise.reps;
    if (!repsToSubmit || parseInt(repsToSubmit) <= 0) {
      Alert.alert('Erro', 'Por favor, insira um número válido de repetições');
      return;
    }
    
    try {
      setLoading(true);
      
      const progressData = {
        weight: weightValue,
        reps: parseInt(repsToSubmit),
        set: currentSet
      };

      console.log('Enviando dados:', progressData);
      
      const response = await api.post(`/api/progress/${exercise.id}`, progressData);

      console.log('Resposta da API:', response.data);

      if (response.data) {
        // Atualiza a lista de progresso
        if (response.data.progress) {
          setProgress(prev => [...prev, response.data.progress]);
        }

        // Mostra mensagem de sucesso se houver
        if (response.data.message) {
          Alert.alert('Sucesso', response.data.message);
        }

        // Atualiza peso sugerido se houver
        if (response.data.suggestedWeight) {
          const newWeight = response.data.suggestedWeight.toString();
          setTargetWeight(newWeight);
          setWeight(newWeight);
        }

        // Verifica se completou todas as séries
        if (response.data.isCompleted) {
          Alert.alert('Parabéns!', 'Você completou todas as séries deste exercício!');
          if (onComplete) {
            onComplete();
          }
        } else {
          // Prepara para próxima série
          if (currentSet < exercise.sets) {
            setCurrentSet(prev => prev + 1);
            setReps(exercise.reps ? exercise.reps.toString() : '');
          }
        }

        // Recarrega o progresso para garantir sincronização
        await loadProgress();
      }
    } catch (error) {
      console.error('Erro ao registrar progresso:', error);
      let errorMessage = 'Não foi possível registrar o progresso. Tente novamente.';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      Alert.alert('Erro', errorMessage);
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
    let weightValue = 0;
    if (weight && weight.trim() !== '') {
      weightValue = parseFloat(weight);
      if (isNaN(weightValue) || weightValue < 0) {
        Alert.alert('Erro', 'Se informado, o peso deve ser um número válido maior ou igual a 0');
        return;
      }
    }

    try {
      setLoading(true);
      const response = await api.put(`/api/progress/${progressId}`, {
        weight: weightValue,
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
          {currentSet <= exercise.sets ? `Série ${currentSet} de ${exercise.sets}` : `Série Extra ${currentSet - exercise.sets}`}
        </Text>
        {targetWeight && (
          <Text style={styles.targetWeight}>Meta: {targetWeight}kg x {exercise.reps} reps</Text>
        )}
      </View>

      {(currentSet <= exercise.sets || progress.length >= exercise.sets) && (
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

      {(currentSet <= exercise.sets || progress.length >= exercise.sets) && (
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#121212',
    width: '100%',
    maxWidth: 600,
    alignSelf: 'center',
    flex: 1
  },
  exerciseName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center'
  },
  headerInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    flexWrap: 'wrap',
    gap: 8,
    paddingHorizontal: 4
  },
  setInfo: {
    fontSize: 18,
    color: '#BB86FC',
    flex: 1,
    minWidth: 150,
    textAlign: 'left'
  },
  targetWeight: {
    fontSize: 16,
    color: '#03DAC6',
    flex: 1,
    textAlign: 'right'
  },
  inputContainer: {
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 12
  },
  inputWrapper: {
    flex: 1,
    minWidth: 140,
    marginBottom: 12
  },
  label: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 4
  },
  input: {
    backgroundColor: '#2C2C2C',
    borderWidth: 1,
    borderColor: '#BB86FC',
    borderRadius: 8,
    padding: 12,
    color: '#fff',
    fontSize: 16,
    width: '100%',
    minHeight: 48
  },
  button: {
    backgroundColor: '#BB86FC',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 24,
    minHeight: 52,
    justifyContent: 'center'
  },
  buttonDisabled: {
    opacity: 0.7
  },
  buttonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold'
  },
  progressContainer: {
    marginTop: 16,
    flex: 1
  },
  progressTitle: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 12,
    textAlign: 'center'
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    backgroundColor: '#2C2C2C',
    padding: 12,
    borderRadius: 8,
    flexWrap: 'wrap',
    gap: 8
  },
  progressText: {
    fontSize: 16,
    color: '#fff',
    flex: 1,
    minWidth: 200
  },
  completedSet: {
    color: '#03DAC6'
  },
  editInputContainer: {
    flex: 1,
    flexDirection: 'row',
    marginRight: 8,
    gap: 8,
    flexWrap: 'wrap'
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
    minWidth: 80,
    minHeight: 40
  },
  editButton: {
    backgroundColor: '#2C2C2C',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#BB86FC',
    minHeight: 40,
    justifyContent: 'center'
  },
  editButtonText: {
    color: '#BB86FC',
    fontSize: 14
  }
});

export default ExerciseProgress; 