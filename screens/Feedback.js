import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

const FeedbackPage = () => {
  const Navigation = useNavigation();
  const [feedback, setfeedback] = useState("");

  const handleSubmit = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      console.log(token);
      const response = await fetch("http://192.168.43.146:3000/addReview", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({ feedback }),
      });
      const data = await response.json();
      console.log(data);
      alert("Feedback Submitted Successfully!");
      setfeedback("");
      Navigation.navigate("HomeScreen");
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <View style={styles.inputView}>
      <Text style={{ fontWeight: "bold", fontSize: 20, marginLeft: 2 }}>
        How could we improve our services?
      </Text>
      <TextInput
        multiline
        style={styles.inputStyle}
        value={feedback}
        onChangeText={(text) => setfeedback(text)}
      />
      <Text style={styles.textStyle}>Characters limit 1200</Text>
      <TouchableOpacity
        style={{
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
        }}
        onPress={() => {
          handleSubmit();
        }}
      >
        <Text
          style={{
            fontSize: 15,
            color: "#818181",
            fontWeight: "bold",
            marginLeft: 10,
          }}
        >
          GIVE FEEDBACK
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default FeedbackPage;

const styles = StyleSheet.create({
  inputView: {
    width: "100%",
    paddingTop: 20,
    height: "100%",
    backgroundColor: "lightgrey",
  },
  inputStyle: {
    width: "99%",
    height: "50%",
    textAlignVertical: "top",
    borderWidth: 1,
    marginLeft: 2,
    marginTop: 20,
    borderColor: "#808080",
  },
  textStyle: {
    fontSize: 15,
    fontWeight: "bold",
    marginLeft: 2,
  },
});
