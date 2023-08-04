import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import {
  Input,
  NativeBaseProvider,
  Button,
  Icon,
  Box,
  Image,
  AspectRatio,
} from "native-base";
import { FontAwesome5 } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Login = () => {
  const navigation = useNavigation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errormsg, setErrormsg] = useState(null);

  const Sendtobackend = () => {
    if (email === "" || password === "") {
      setErrormsg("All fields are required!");
      return;
    } else {
      console.log(email, password);
      axios
        .post("http://192.168.43.146:3000/login", {
          email,
          password,
        })
        .then((response) => {
          console.log(response.data);
          AsyncStorage.setItem("token", response.data.token);
          alert("Login Successfully!");
          navigation.navigate("HomeScreen");
          setEmail("");
          setPassword("");
          setErrormsg(null);
        })
        .catch((error) => {
          if (error.response) {
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);
            setErrormsg(error.response.data);
            alert("Invalid Credentials!");
          } else if (error.request) {
            console.log(error.request);
            setErrormsg(
              "Network error. Please check your internet connection."
            );
          } else {
            console.log("Error", error.message);
            setErrormsg(error.message);
          }
          console.log(error.config);
        });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.Middle}>
        <Text style={styles.LoginText}>Login</Text>
      </View>

      <View style={styles.text2}>
        <Text>Don't have an account?</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
          <Text style={styles.SignupText}>Sign up</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.buttonStyle}>
        <View style={styles.emailInput}>
          <Input
            value={email}
            InputLeftElement={
              <Icon
                as={<FontAwesome5 name="user-secret" />}
                size="sm"
                m={2}
                _light={{
                  color: "black",
                }}
                _dark={{
                  color: "gray.300",
                }}
              />
            }
            onChangeText={(text) => setEmail(text)}
            onPressIn={() => setErrormsg(null)}
            variant="outline"
            placeholder="Username or Email"
            _light={{
              placeholderTextColor: "blueGray.400",
            }}
            _dark={{
              placeholderTextColor: "blueGray.50",
            }}
          />
        </View>
      </View>

      <View style={styles.buttonStyleX}>
        <View style={styles.emailInput}>
          <Input
            value={password}
            InputLeftElement={
              <Icon
                as={<FontAwesome5 name="key" />}
                size="sm"
                m={2}
                _light={{
                  color: "black",
                }}
                _dark={{
                  color: "gray.300",
                }}
              />
            }
            onChangeText={(text) => setPassword(text)}
            onPressIn={() => setErrormsg(null)}
            variant="outline"
            secureTextEntry={true}
            placeholder="Password"
            _light={{
              placeholderTextColorL: "blueGray.400",
            }}
            _dark={{
              placeholderTextColor: "blueGray.50",
            }}
          />
        </View>
      </View>

      <View style={styles.text2}>
        <Text>Forgot Password?</Text>
        <TouchableOpacity onPress={() => navigation.navigate("ResetPassword")}>
          <Text style={styles.SignupText}>Click here to reset</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.buttonStyle}>
        <Button
          style={styles.buttonDesign}
          onPress={() => {
            Sendtobackend();
          }}
        >
          LOGIN
        </Button>
      </View>

      <View style={styles.lineStyle}>
        <View style={{ flex: 1, height: 1, backgroundColor: "black" }} />
        <View>
          <Text style={{ width: 50, textAlign: "center" }}>Or</Text>
        </View>
        <View style={{ flex: 1, height: 1, backgroundColor: "black" }} />
      </View>

      <View style={styles.boxStyle}>
        <TouchableOpacity onPress={() => navigation.navigate("m")}>
          <Box
            style={styles.iconContainer}
            shadow={3}
            _light={{
              backgroundColor: "gray.50",
            }}
            _dark={{
              backgroundColor: "gray.700",
            }}
          >
            <Image
              source={require("../assets/Google.png")}
              style={styles.icon}
              alt="Google Login"
            />
          </Box>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("m")}>
          <Box
            style={styles.iconContainer}
            shadow={3}
            _light={{
              backgroundColor: "gray.50",
            }}
            _dark={{
              backgroundColor: "gray.700",
            }}
          >
            <Image
              source={require("../assets/Facebook.png")}
              style={styles.icon}
              alt="Facebbok Login"
            />
          </Box>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default () => {
  return (
    <NativeBaseProvider>
      <Login />
    </NativeBaseProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "lightgrey",
  },
  Heading: {
    fontStyle: "normal",
    fontWeight: "bold",
    fontSize: 24,
    color: "#fff",
  },
  LoginText: {
    marginTop: 100,
    fontSize: 30,
    fontWeight: "bold",
  },
  Middle: {
    alignItems: "center",
    justifyContent: "center",
  },
  text2: {
    flexDirection: "row",
    justifyContent: "center",
    paddingTop: 5,
  },
  SignupText: {
    fontWeight: "bold",
  },
  emailInput: {
    marginTop: 10,
    marginRight: 5,
    borderColor: "black",
    borderWidth: 1,
  },
  buttonStyle: {
    marginTop: 30,
    marginLeft: 15,
    marginRight: 15,
  },
  buttonStyleX: {
    marginTop: 12,
    marginLeft: 15,
    marginRight: 15,
  },
  buttonDesign: {
    alignSelf: "center",
    flexDirection: "row",
    justifyContent: "center",
    width: "90%",
    padding: 20,
    paddingBottom: 22,
    borderRadius: 10,
    elevation: 5,
    marginTop: 30,
    marginBottom: 20,
    backgroundColor: "#000",
  },
  lineStyle: {
    flexDirection: "row",
    marginTop: 30,
    marginLeft: 15,
    marginRight: 15,
    alignItems: "center",
  },
  boxStyle: {
    flexDirection: "row",
    marginTopL: 30,
    marginLeft: 15,
    marginRight: 15,
    justifyContent: "space-around",
  },
  errormessage: {
    color: "white",
    fontSize: 15,
    textAlign: "center",
    backgroundColor: "#026efd",
    padding: 5,
  },
  iconContainer: {
    height: 80,
    width: 80,
    borderWidth: 2,
    borderRadius: 10,
    borderColor: "black",
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    width: 50,
    height: 50,
    resizeMode: "contain",
  },
});
