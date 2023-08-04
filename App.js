import React from "react";
import Login from "./screens/Login";
import Signup from "./screens/Signup";
import HomeScreen from "./screens/HomeScreen";
import ProfileScreen from "./screens/Profile";
import Setting from "./screens/Setting";
import { MaterialIcons } from "@expo/vector-icons";
import { Provider } from "react-redux";
import { store } from "./store";

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import FeedbackPage from "./screens/Feedback";
import UpdateAcc from "./screens/UpdateAcc";
import ChangePassword from "./screens/ChangePassword";
import SplashScreenComponent from "./screens/SplashScreen";
import ResetPassword from "./screens/ResetPassword";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const App = () => {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Splash" component={SplashScreenComponent} />
          <Stack.Screen name="Signup" component={Signup} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="HomeScreen" component={HomeStack} />
          <Stack.Screen name="UpdateAcc" component={UpdateAcc} />
          <Stack.Screen name="ChangePass" component={ChangePassword} />
          <Stack.Screen name="ResetPassword" component={ResetPassword} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
};

const HomeStack = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;

        if (route.name === "Home") {
          iconName = "home";
        } else if (route.name === "Profile") {
          iconName = "person";
        } else if (route.name === "Settings") {
          iconName = "settings";
        } else if (route.name === "Feedback") {
          iconName = "feedback";
        }

        return <MaterialIcons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: "tomato",
      tabBarInactiveTintColor: "gray",
      tabBarStyle: [
        {
          display: "flex",
        },
        null,
      ],
    })}
  >
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="Profile" component={ProfileScreen} />
    <Tab.Screen name="Settings" component={Setting} />
    <Tab.Screen name="Feedback" component={FeedbackPage} />
  </Tab.Navigator>
);

export default App;
