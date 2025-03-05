import React, { useState, useContext } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native"; // 🔥 Importar a navegação aqui
import { AuthContext } from "../AuthContext";
import { styles } from "./styles";

const LoginScreen = () => {
  const { login, register } = useContext(AuthContext);
  const navigation = useNavigation(); // 🔥 Pegar a navegação corretamente aqui
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);

  const handleLogin = async () => {
    try {
      await login(email, password);
      console.log("Login bem-sucedido! Redirecionando para WorkoutScreen.");
      navigation.navigate("WorkoutScreen"); // 🔥 Agora a navegação funcionará corretamente!
    } catch (error) {
      Alert.alert("Erro", "Credenciais inválidas.");
    }
  };

  const handleRegister = async () => {
    try {
      if (!name || !email || !password) {
        Alert.alert("Erro", "Por favor, preencha todos os campos.");
        return;
      }

      await register(name, email, password);
      Alert.alert("Sucesso", "Usuário registrado com sucesso! Faça login para continuar.");
      setIsRegistering(false);
      setName("");
    } catch (error) {
      Alert.alert("Erro", "Erro ao criar usuário. Tente novamente.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{isRegistering ? "Criar Conta" : "Login"}</Text>

      {isRegistering && (
        <TextInput
          placeholder="Nome"
          placeholderTextColor="#CCC"
          value={name}
          onChangeText={setName}
          style={styles.input}
        />
      )}

      <TextInput
        placeholder="Email"
        placeholderTextColor="#CCC"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        placeholder="Senha"
        placeholderTextColor="#CCC"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={styles.input}
      />

      <TouchableOpacity 
        style={styles.button} 
        onPress={isRegistering ? handleRegister : handleLogin}
      >
        <Text style={styles.buttonText}>
          {isRegistering ? "Criar Conta" : "Entrar"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.linkButton}
        onPress={() => setIsRegistering(!isRegistering)}
      >
        <Text style={styles.linkText}>
          {isRegistering 
            ? "Já tem uma conta? Faça login" 
            : "Não tem uma conta? Registre-se"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;
