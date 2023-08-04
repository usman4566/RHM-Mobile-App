import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
} from "react-native";
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
import * as ImagePicker from "expo-image-picker";
import FoodIcon from "react-native-vector-icons/FontAwesome";

const Signup = () => {
  const navigation = useNavigation();

  const [showModal, setShowModal] = useState(false);
  const [otp, setOtp] = useState("");
  const [name, setname] = useState("");
  const [email, setEmail] = useState("");
  const [number, setnumber] = useState("");
  const [password, setPassword] = useState("");
  const [image, setImage] = useState(null);
  const [errormsg, setErrormsg] = useState(null);
  const [formData, setFormData] = useState(null);

  const Sendtobackend = async () => {
    try {
      await axios.post("http://192.168.43.146:3000/send-otp", {
        email: email,
      });

      setShowModal(true);
    } catch (error) {
      if (error.response) {
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
        setErrormsg(error.response.data);
      } else if (error.request) {
        console.log(error.request);
        setErrormsg("Network error. Please check your internet connection.");
      } else {
        console.log("Error", error.message);
        setErrormsg(error.message);
      }
      console.log(error.config);
    }
  };

  const handleVerifyOtp = async () => {
    if (name === "" || email === "" || number === "" || password === "") {
      setErrormsg("All fields are required!");
      return;
    } else {
      try {
        const formData = new FormData();
        formData.append("name", name);
        formData.append("email", email);
        formData.append("number", number);
        formData.append("password", password);
        formData.append("image", {
          uri: image,
          type: "image/jpeg",
          name: "profile.jpg",
        });
        formData.append("otp", otp);
        const verifyResponse = await axios.post(
          "http://192.168.43.146:3000/verify-otp",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        console.log(verifyResponse.data);
        alert("Account Created!");
        navigation.navigate("Login");

        setOtp("");
        setname("");
        setEmail("");
        setnumber("");
        setPassword("");
        setImage(null);
        setErrormsg(null);
        setShowModal(false);
      } catch (error) {
        console.error(error);
        alert("An error occurred. Account creation failed.");
      }
    }
  };

  useEffect(() => {
    navigation.addListener("focus", resetForm);

    return () => {
      navigation.removeListener("focus", resetForm);
    };
  }, []);

  useEffect(() => {
    (async () => {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        alert("Sorry, we need camera roll permissions to make this work!");
      }
    })();
  }, []);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const resetForm = () => {
    setOtp("");
    setname("");
    setEmail("");
    setnumber("");
    setPassword("");
    setImage(null);
    setErrormsg(null);
    setShowModal(false);
  };

  useEffect(() => {
    navigation.addListener("focus", resetForm);

    return () => {
      navigation.removeListener("focus", resetForm);
    };
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.scrollView}>
      <View style={styles.container}>
        <View style={styles.Middle}>
          <Text style={styles.LoginText}>Sign Up</Text>
        </View>
        <View style={styles.text2}>
          <Text>Already have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={styles.SignupText}>Log In</Text>
          </TouchableOpacity>
        </View>

        <View style={{ alignItems: "center", paddingTop: 50 }}>
          <TouchableOpacity
            onPress={pickImage}
            style={styles.avatarPlaceholder}
          >
            {image && (
              <Image
                source={{ uri: image }}
                style={{ width: 100, height: 100, borderRadius: 70 }}
                alt="Profile Image"
              />
            )}
            {!image && <FoodIcon name="camera" size={48} color="#fff" />}
          </TouchableOpacity>
        </View>

        <View style={styles.buttonStyle}>
          <View style={styles.emailInput}>
            <Input
              value={name}
              InputLeftElement={
                <Icon
                  as={<FontAwesome5 name="user" />}
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
              variant="outline"
              placeholder="Username"
              onChangeText={(text) => setname(text)}
              onPressIn={() => setErrormsg(null)}
              _light={{
                placeholderTextColor: "blueGray.400",
              }}
              _dark={{
                placeholderTextColor: "blueGray.50",
              }}
            />
          </View>
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
              variant="outline"
              placeholder="Email"
              onChangeText={(text) => setEmail(text)}
              onPressIn={() => setErrormsg(null)}
              _light={{
                placeholderTextColor: "blueGray.400",
              }}
              _dark={{
                placeholderTextColor: "blueGray.50",
              }}
            />
          </View>
        </View>

        <View style={styles.buttonStyle}>
          <View style={styles.emailInput}>
            <Input
              value={number}
              InputLeftElement={
                <Icon
                  as={<FontAwesome5 name="comments" />}
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
              variant="outline"
              placeholder="Phone Number"
              onChangeText={(text) => setnumber(text)}
              onPressIn={() => setErrormsg(null)}
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
              variant="outline"
              secureTextEntry={true}
              placeholder="Password"
              onChangeText={(text) => setPassword(text)}
              onPressIn={() => setErrormsg(null)}
              _light={{
                placeholderTextColorL: "blueGray.400",
              }}
              _dark={{
                placeholderTextColor: "blueGray.50",
              }}
            />
          </View>
        </View>

        <View style={styles.buttonStyle}>
          <Button
            style={styles.buttonDesign}
            onPress={() => {
              Sendtobackend();
            }}
          >
            SIGNUP
          </Button>
        </View>

        <Modal
          transparent={true}
          visible={showModal}
          animationType="slide"
          onRequestClose={() => {
            setShowModal(false);
          }}
        >
          <View style={styles.container}>
            <View style={styles.Middle}>
              <Text style={styles.LoginText}>O T P</Text>
            </View>
            <View>
              <Text style={[styles.SignupText, { textAlign: "center" }]}>
                Please enter your verification code
              </Text>
            </View>

            <View style={styles.buttonStyle}>
              <View style={styles.emailInput}>
                <Input
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
                  variant="outline"
                  placeholder="Enter OTP"
                  onChangeText={(text) => setOtp(text)}
                  onPressIn={() => setErrormsg(null)}
                  value={otp}
                  _light={{
                    placeholderTextColor: "blueGray.400",
                  }}
                  _dark={{
                    placeholderTextColor: "blueGray.50",
                  }}
                />
              </View>
            </View>

            <View style={styles.buttonStyle}>
              <Button style={styles.buttonDesign} onPress={handleVerifyOtp}>
                SUBMIT
              </Button>
            </View>
          </View>
        </Modal>

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
                alt="Facebook Login"
              />
            </Box>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default () => {
  return (
    <NativeBaseProvider>
      <Signup />
    </NativeBaseProvider>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 1,
    justifyContent: "center",
  },
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
    borderRadius: 10,
    elevation: 5,
    backgroundColor: "#000",
  },
  buttonDesignX: {
    alignSelf: "center",
    flexDirection: "row",
    justifyContent: "center",
    width: "90%",
    padding: 20,
    borderRadius: 10,
    elevation: 5,
    backgroundColor: "#808080",
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
    marginTop: 30,
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
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 70,
    backgroundColor: "#E1E2E6",
    justifyContent: "center",
    alignItems: "center",
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
