import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { URL_BASE } from "@env";
import { useDispatch } from "react-redux";
import { setAccessToken } from "../src/redux/actions/tokenActions";

const Login = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();

  console.log(URL_BASE);

  const handleLogin = async () => {
    // Check if all inputs are filled
    if (!username || !password) {
      Alert.alert("Error: ","Please fill in all fields");
      return;
    }

    const loginData = {
      username: username,
      password: password,
    };

    try {
      const response = await fetch(`${URL_BASE}/login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 400 && errorData) {
          const errors = Object.entries(errorData).map(
            // @ts-ignore
            ([key, value]) => `${key}: ${value.join(", ")}`
          );
          Alert.alert("Login Failed", errors.join("\n"));
        } else {
          throw new Error(errorData.detail || "An error occurred");
        }
      } else {
        const data = await response.json();
        dispatch(setAccessToken(data.tokens.access));
        console.log(data.tokens.access)
        navigation.navigate('Home')
      }
    } catch (error) {
      console.error("Login error:", error.message);
    }
  };

  return (
    <ImageBackground
      source={require("../assets/bg2.jpg")}
      style={styles.container}
    >
      <View style={styles.content}>
        <Text style={styles.title}>Login</Text>
        <TextInput
          style={styles.input}
          placeholder="Username"
          placeholderTextColor="#fff"
          value={username}
          onChangeText={(text) => setUsername(text)}
        />  
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#fff"
          secureTextEntry
          value={password}
          onChangeText={(text) => setPassword(text)}
        />
        <Button title="Login" onPress={handleLogin} />
        <TouchableOpacity onPress={() => navigation.navigate("Register")}>
          <Text style={styles.linkText}>
            Don't have an account? Register here
          </Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  //   content: {
  //     backgroundColor: 'rgba(255, 255, 255, 0.5)', // Semi-transparent background
  //     padding: 50,
  //     borderRadius: 10,
  //   },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
  },
  input: {
    height: 40,
    width: 220,
    borderColor: "white",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
    color: "#fff",
  },
  linkText: {
    color: "#fff",
    marginTop: 10,
  },
});

export default Login;
