import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { ThemeProvider, Button, createTheme } from "@rneui/themed";
import firebase from "./src/database/configDB";
import { createStackNavigator } from "@react-navigation/stack";
import { screens } from "./src/screens";
import { NavigationContainer } from "@react-navigation/native";
import Login from "./src/screens/Login";
import Dashboard from "./src/screens/Dashboard";
import Signup from "./src/screens/Signup";
import Group from "./src/screens/Group";
import Groups from "./src/screens/Groups";

const Stack = createStackNavigator();

export default function App() {
  const dbRef = firebase.firestore().collection("users");


  const theme = createTheme({
    components: {
      Button: {
        raised: true,
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerStyle: {
              backgroundColor: "#621FF7",
            },
            headerTintColor: "#fff",
            headerTitleStyle: {
              fontWeight: "bold",
            },
          }}
        >
           <Stack.Screen
            name={screens.LOGIN}
            component={Login}
          />
          <Stack.Screen
            name={screens.GROUPS}
            component={Groups}
          />
         
          <Stack.Screen
            name={screens.SIGNUP}
            component={Signup}
          />
          <Stack.Screen
            name={screens.GROUP}
            component={Group}
          />
          <Stack.Screen
            name={screens.DASHBOARD}
            component={Dashboard}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
