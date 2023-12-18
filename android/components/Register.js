import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  // Button,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { SelectList } from "react-native-dropdown-select-list";
import { Button } from "native-base";
import { URL_BASE } from "@env";

const genderOptions = [
  { label: "Male", value: "male" },
  { label: "Female", value: "female" },
];

const Register = ({ navigation }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("");  

  const handleRegister = async () => {
    if (!username || !password || !email || !gender) {
      Alert.alert("Error: ","Please fill in all fields");
      return;
    }

    const registrationData = {
      username: username,
      password: password,
      email: email,
      gender: gender.toUpperCase()[0],
    };

    console.log(registrationData)

    try {
      const response = await fetch(`${URL_BASE}/register/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(registrationData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 400 && errorData) {
          const errors = Object.entries(errorData).map(
            // @ts-ignore
            ([key, value]) => `${key}: ${value.join(", ")}`
          );
          Alert.alert("Registration Failed", errors.join("\n"));
        } else {
          throw new Error(errorData.detail || "An error occurred");
        }
      } else {
        const data = await response.json();
        Alert.alert("Success: ","User Created");
        navigation.navigate("Login");
      }
    } catch (error) {
      console.error("Registration error:", error.message);
    }
  };

  return (
    <ImageBackground
      source={require("../assets/bg1.jpg")}
      style={styles.container}
    >
      <View style={styles.content}>
        <Text style={styles.title}>Register</Text>
        <TextInput
          style={styles.input}
          placeholder="Username"
          value={username}
          onChangeText={(text) => setUsername(text)}
          placeholderTextColor="#fff"
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          value={email}
          onChangeText={(text) => setEmail(text)}
          placeholderTextColor="#fff"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={(text) => setPassword(text)}
          placeholderTextColor="#fff"
        />
        <SelectList
          boxStyles={{ borderColor: "white" }}
          inputStyles={{ color: "white" }}
          dropdownStyles={{ borderColor: "white" }}
          dropdownTextStyles={{ color: "white" }}
          search={false}
          setSelected={(val) => setGender(val)}
          data={genderOptions.map((option) => ({
            key: option.value,
            value: option.label,
          }))}
          save="key"
          placeholder="Select Gender"
        />
        <Button style={styles.registerButton} onPress={handleRegister}>
          <Text style={styles.buttonText}>Register</Text>
        </Button>
        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={styles.linkText}>
            Already have an account? Login here
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
  //     backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  //     padding: 20,
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
  registerButton: {
    marginTop: 10,
    backgroundColor: "#3498db",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
  },
});

export default Register;
