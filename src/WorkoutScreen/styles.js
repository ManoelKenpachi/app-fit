import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#121212", // Fundo escuro por padrão
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#FFFFFF",
  },
  subtitle: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    color: "#BB86FC",
  },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: "#1E1E1E",
    borderRadius: 8,
    paddingHorizontal: 10,
    color: "#FFFFFF",
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#BB86FC",
  },
  button: {
    backgroundColor: "#BB86FC",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    width: "100%",
    marginTop: 10,
  },
  buttonText: {
    color: "#121212",
    fontSize: 18,
    fontWeight: "bold",
  },
  exerciseCard: {
    backgroundColor: "#1E1E1E",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    width: "100%",
    borderWidth: 1,
    borderColor: "#BB86FC",
  },
  exerciseName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#BB86FC",
  },
  exerciseInfo: {
    fontSize: 16,
    color: "#CCC",
  },
  noWorkout: {
    fontSize: 18,
    textAlign: "center",
    marginTop: 50,
    color: "#FFFFFF",
  },
});
