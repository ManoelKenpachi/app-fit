import React, { useState, useContext } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native"; // 🔥 Importar a navegação aqui
import { AuthContext } from "../AuthContext";
import { styles } from "./styles";

const LoginScreen = () => {
  const { login } = useContext(AuthContext);
  const navigation = useNavigation(); // 🔥 Pegar a navegação corretamente aqui
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      await login(email, password);
      console.log("Login bem-sucedido! Redirecionando para WorkoutScreen.");
      navigation.navigate("WorkoutScreen"); // 🔥 Agora a navegação funcionará corretamente!
    } catch (error) {
      Alert.alert("Erro", "Credenciais inválidas.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TextInput
        placeholder="Email"
        placeholderTextColor="#CCC"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />

      <TextInput
        placeholder="Senha"
        placeholderTextColor="#CCC"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={styles.input}
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;
