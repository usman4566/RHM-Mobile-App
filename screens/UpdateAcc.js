import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Input, NativeBaseProvider, Button, Icon, Image } from "native-base";
import { FontAwesome5 } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import FoodIcon from "react-native-vector-icons/FontAwesome";
import AsyncStorage from "@react-native-async-storage/async-storage";

const UpdateAcc = () => {
  const navigation = useNavigation();

  const [name, setname] = useState("");
  const [number, setnumber] = useState("");
  const [image, setImage] = useState(null);
  const [errormsg, setErrormsg] = useState(null);

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

  const Sendtobackend = async () => {
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("number", number);
      if (image) {
        formData.append("image", {
          uri: image,
          type: "image/jpeg",
          name: "profile.jpg",
        });
      }

      const token = await AsyncStorage.getItem("token");
      const response = await axios.put(
        "http://192.168.43.146:3000/updateProfile",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response.data);
      alert("Account Updated!");
      navigation.navigate("HomeScreen");
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

  return (
    <View style={styles.container}>
      <View style={styles.Middle}>
        <Text style={styles.LoginText}>Update Profile</Text>
      </View>

      <View style={{ alignItems: "center", paddingTop: 50 }}>
        <TouchableOpacity onPress={pickImage} style={styles.avatarPlaceholder}>
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
        <Button
          style={styles.buttonDesign}
          onPress={() => {
            Sendtobackend();
          }}
        >
          SUBMIT
        </Button>
      </View>
    </View>
  );
};

export default () => {
  return (
    <NativeBaseProvider>
      <UpdateAcc />
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
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 70,
    backgroundColor: "#E1E2E6",
    justifyContent: "center",
    alignItems: "center",
  },
});
