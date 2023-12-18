import React from "react";
import { NativeBaseProvider } from "native-base";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { Provider } from "react-redux";
import Register from "./components/Register";
import Login from "./components/Login";
import store from "./src/redux/store";
import FitnessHome from "./components/FitnessHome";
import BottomTab from "./components/BottomTab";
import UserProfile from "./components/UserProfile";
import CategoryFitness from "./components/CategoryFitness";
import EditExercise from "./components/EditExercises";
import CategoryFitnessDetail from "./components/DetailFitness";

const Stack = createStackNavigator();

export default function App() {
  return (
    <Provider store={store}>
      <NativeBaseProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Login">
            <Stack.Screen
              name="Register"
              component={Register}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Login"
              component={Login}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Home"
              component={BottomTab}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="UserProfile"
              component={UserProfile}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="FitnessList"
              component={CategoryFitness}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="DetailFitness"
              component={CategoryFitnessDetail}
              options={{ headerShown: false }}
            />
            {/* <Stack.Screen
              name="EditExercise"
              component={EditExercise}
              options={{ headerShown: false }}
            /> */}
          </Stack.Navigator>
        </NavigationContainer>
      </NativeBaseProvider>
    </Provider>
  );
}
