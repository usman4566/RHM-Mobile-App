import React, { useEffect } from 'react';
import { Text, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as SplashScreen from 'expo-splash-screen'; 
import { faMap } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';


export default function SplashScreenComponent() {
  const navigation = useNavigation();

  useEffect(() => {
    async function hideSplashScreen() {
      await SplashScreen.hideAsync();
      setTimeout(() => {
        navigation.navigate('Signup');
      }, 3000);
    }

    hideSplashScreen();
  }, [navigation]);

  return (
    <View style={styles.container}>
      <FontAwesomeIcon icon={faMap} size={150} />
      <Text style={[styles.title, {fontFamily: 'sans-serif'}]}>Road <Text style={{color: 'white'}}>Health</Text> Map</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'lightgrey',
  },
  title: {
    fontSize: 24,
    marginTop: 20,
  },
});
