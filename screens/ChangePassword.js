import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Input, NativeBaseProvider, Button, Icon } from "native-base";
import { FontAwesome5 } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ChangePassword = () => {
  const navigation = useNavigation();

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await axios.put(
        "http://192.168.43.146:3000/change-password",
        {
          oldPassword: oldPassword,
          newPassword: newPassword,
          confirmPassword: confirmPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data);
      alert("Password updated successfully.");
      navigation.navigate("HomeScreen");
    } catch (error) {
      console.error(error);
      if (error.response) {
        console.log(error.response.data);
        setErrorMessage(error.response.data.error);
      } else {
        setErrorMessage("An error occurred while updating the password.");
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.Middle}>
        <Text style={styles.LoginText}>Change Password</Text>
      </View>
      <View style={styles.buttonStyleX}>
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
            onChangeText={(text) => setOldPassword(text)}
            variant="outline"
            secureTextEntry={true}
            placeholder="Old Password"
            _light={{
              placeholderTextColorL: "blueGray.400",
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
            onChangeText={(text) => setNewPassword(text)}
            variant="outline"
            secureTextEntry={true}
            placeholder="New Password"
            _light={{
              placeholderTextColorL: "blueGray.400",
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
            onChangeText={(text) => setConfirmPassword(text)}
            variant="outline"
            secureTextEntry={true}
            placeholder="Confirm Password"
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
            handleSubmit();
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
      <ChangePassword />
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
});
