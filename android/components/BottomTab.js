import React from "react";
import { Text } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AddExercises from "./AddExercises";
import MyExercises from "./MyExercises";
import FitnessHome from "./FitnessHome";

const Tab = createBottomTabNavigator();

function BottomTab() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === "HomeFitness") {
            iconName = "home";
          } else if (route.name === "AddExercise") {
            iconName = "plus-box-outline";
          } else if (route.name === "MyExercises") {
            iconName = "format-list-bulleted";
          }

          return (
            <MaterialCommunityIcons name={iconName} size={size} color={color} />
          );
        },  
      })}
      tabBarOptions={{
        activeTintColor: "tomato",
        inactiveTintColor: "gray",
      }}
    >
      <Tab.Screen
        name="HomeFitness"
        component={FitnessHome}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="AddExercise"
        component={AddExercises}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="MyExercises"
        component={MyExercises}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
}

export default BottomTab;
