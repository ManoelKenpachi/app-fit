import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 40,
    paddingBottom: 16,
    backgroundColor: '#1E1E1E',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#BB86FC',
  },
  content: {
    flex: 1,
  },
  scrollViewContent: {
    padding: 16,
  },
  input: {
    backgroundColor: '#1E1E1E',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    color: '#FFFFFF',
    fontSize: 16,
  },
  exercisesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  exercisesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#BB86FC',
  },
  addExerciseButton: {
    padding: 8,
  },
  exerciseCard: {
    backgroundColor: '#1E1E1E',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  exerciseDetails: {
    fontSize: 14,
    color: '#BB86FC',
  },
  removeExerciseButton: {
    padding: 8,
  },
  saveButton: {
    backgroundColor: '#BB86FC',
    padding: 16,
    borderRadius: 8,
    margin: 16,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#121212',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#1E1E1E',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#BB86FC',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalInput: {
    backgroundColor: '#121212',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    color: '#FFFFFF',
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    gap: 10,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#2C2C2C',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#BB86FC',
  },
  addButton: {
    flex: 1,
    backgroundColor: '#BB86FC',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  inputText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  placeholderText: {
    color: '#666',
  },
  dayOption: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  selectedDayOption: {
    backgroundColor: '#BB86FC20',
  },
  dayOptionText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  selectedDayOptionText: {
    color: '#BB86FC',
    fontWeight: 'bold',
  },
  existingWorkoutsSection: {
    marginBottom: 24,
  },
  existingWorkoutsTitle: {
    fontSize: 16,
    color: '#BB86FC',
    marginBottom: 12,
  },
  existingWorkoutCard: {
    backgroundColor: '#1E1E1E',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  existingWorkoutName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  exercisesList: {
    marginLeft: 8,
  },
  existingExerciseText: {
    fontSize: 14,
    color: '#E1E1E1',
    marginBottom: 4,
  },
  noWorkoutsText: {
    color: '#666',
    fontSize: 14,
    textAlign: 'center',
    marginVertical: 12,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  workoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  workoutActions: {
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 1,
  },
  actionButton: {
    padding: 10,
    marginLeft: 8,
    backgroundColor: 'transparent',
    borderRadius: 20,
    zIndex: 1,
  },
}); 