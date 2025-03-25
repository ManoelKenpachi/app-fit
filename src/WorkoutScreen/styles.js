import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 40,
    borderBottomWidth: 1,
    borderBottomColor: '#2C2C2C',
    backgroundColor: '#1E1E1E',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#BB86FC',
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    padding: 8,
    marginLeft: 16,
  },
  contentContainer: {
    flexGrow: 1,
    padding: 20,
  },
  content: {
    flex: 1,
  },
  workoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  workoutName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  editButton: {
    padding: 8,
  },
  startButton: {
    backgroundColor: "#BB86FC",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 24,
  },
  startButtonText: {
    color: "#000",
    fontSize: 18,
    fontWeight: "bold",
  },
  noWorkoutText: {
    color: '#FFFFFF',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 8,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  emptySubtitle: {
    color: '#666',
    fontSize: 14,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: "#121212",
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    color: "#BB86FC",
    marginTop: 16,
    fontSize: 16,
  },
  exerciseContainer: {
    padding: 20,
  },
  exerciseName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  setInfo: {
    fontSize: 16,
    color: '#BB86FC',
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#2C2C2C',
    borderRadius: 8,
    padding: 15,
    color: '#FFFFFF',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#BB86FC',
  },
  registerButton: {
    backgroundColor: '#BB86FC',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  registerButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  exerciseCard: {
    backgroundColor: "#1E1E1E",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  exerciseDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  exerciseInfo: {
    fontSize: 16,
    color: "#BB86FC",
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#BB86FC',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
});
