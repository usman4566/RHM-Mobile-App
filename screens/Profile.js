import { useNavigation, useIsFocused } from "@react-navigation/native";
import axios from "axios";
import React from "react";
import { useEffect, useState } from "react";
import {
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  Button,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ProfileScreen = () => {
  const Navigation = useNavigation();
  const isFocused = useIsFocused();
  const [userData, setUserData] = useState(null);

  const fetchData = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const userDataResponse = await axios.post(
        "http://192.168.43.146:3000/userdata",
        null,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUserData(userDataResponse.data.user);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          console.log("User authentication token is invalid or expired.");
        } else {
          console.log("An error occurred with the request:", error.message);
        }
      } else {
        console.log("An error occurred:", error.message);
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, [isFocused]);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("token");
      alert("Session Expired!");
      Navigation.navigate("Login");
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <View style={{ backgroundColor: "lightgrey", height: "100%" }}>
      <ScrollView>
        <View style={{ alignItems: "center", paddingTop: 50 }}>
          <Image
            source={{ uri: userData?.image }}
            style={{ width: 150, height: 150, borderRadius: 75 }}
          ></Image>
          <Text style={{ fontSize: 25, fontWeight: "bold", padding: 10 }}>
            {userData?.name}
          </Text>
        </View>
        <View
          style={{
            alignSelf: "center",
            flexDirection: "row",
            justifyContent: "center",
            width: "90%",
            padding: 20,
            paddingBottom: 22,
            marginBottom: 20,
            borderRadius: 10,
            elevation: 5,
            marginTop: 20,
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
            {userData?.email}
          </Text>
        </View>

        <View
          style={{
            alignSelf: "center",
            flexDirection: "row",
            justifyContent: "center",
            width: "90%",
            padding: 20,
            paddingBottom: 22,
            borderRadius: 10,
            elevation: 5,
            marginTop: 20,
            marginBottom: 10,
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
            {userData?.number}
          </Text>
        </View>

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
          onPress={handleLogout}
        >
          <Text
            style={{
              fontSize: 15,
              color: "#818181",
              fontWeight: "bold",
              marginLeft: 10,
            }}
          >
            LOGOUT
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default ProfileScreen;
