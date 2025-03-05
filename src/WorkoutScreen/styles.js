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
    paddingHorizontal: 16,
    paddingTop: 40,
    paddingBottom: 16,
    backgroundColor: '#1E1E1E',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#BB86FC",
  },
  logoutButton: {
    padding: 8,
  },
  contentContainer: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 16,
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
    fontSize: 20,
    color: "#E1E1E1",
    flex: 1,
  },
  editButton: {
    padding: 8,
    marginLeft: 16,
  },
  exerciseCard: {
    backgroundColor: "#1E1E1E",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#E1E1E1",
    marginBottom: 8,
  },
  exerciseDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  exerciseInfo: {
    fontSize: 16,
    color: "#BB86FC",
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 32,
  },
  noWorkout: {
    fontSize: 18,
    color: "#E1E1E1",
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 8,
    textAlign: "center",
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
