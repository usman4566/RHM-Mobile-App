import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Input, NativeBaseProvider, Button, Icon } from "native-base";
import { FontAwesome5 } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";

const ResetPassword = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const sendResetCode = async () => {
    try {
      const response = await axios.post(
        "http://192.168.43.146:3000/send-reset-code",
        {
          email: email,
        }
      );

      setResetCode(response.data.resetCode);
    } catch (error) {
      console.error(error);
      setErrorMessage("Failed to send reset code. Please try again.");
    }
  };

  const handleResetPassword = async () => {
    try {
      const response = await axios.post(
        "http://192.168.43.146:3000/reset-password",
        {
          email: email,
          resetCode: resetCode,
          newPassword: newPassword,
          confirmPassword: confirmPassword,
        }
      );

      console.log(response.data);
      alert("Password reset successful.");
      navigation.navigate("Login");
    } catch (error) {
      console.error(error);
      if (error.response) {
        console.log(error.response.data);
        setErrorMessage(error.response.data.error);
      } else {
        setErrorMessage("An error occurred while resetting the password.");
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.Middle}>
        <Text style={styles.LoginText}>Sign Up</Text>
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
            placeholder="Enter email"
            onChangeText={(text) => setEmail(text)}
            onPressIn={() => setErrorMessage(null)}
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
        <Button style={styles.buttonDesign} onPress={sendResetCode}>
          Get Reset Code
        </Button>
      </View>

      <View style={styles.buttonStyle}>
        <View style={styles.emailInput}>
          <Input
            InputLeftElement={
              <Icon
                as={<FontAwesome5 name="unlock" />}
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
            placeholder="Enter Code"
            onChangeText={(text) => setResetCode(text)}
            onPressIn={() => setErrorMessage(null)}
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
            placeholder="Enter New Password"
            onChangeText={(text) => setNewPassword(text)}
            secureTextEntry={true}
            onPressIn={() => setErrorMessage(null)}
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
            placeholder="Confirm New Password"
            onChangeText={(text) => setConfirmPassword(text)}
            secureTextEntry={true}
            onPressIn={() => setErrorMessage(null)}
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
        <Button style={styles.buttonDesign} onPress={handleResetPassword}>
          SUBMIT
        </Button>
      </View>
    </View>
  );
};

export default () => {
  return (
    <NativeBaseProvider>
      <ResetPassword />
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
