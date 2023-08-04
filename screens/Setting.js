import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, Text, StyleSheet, Switch, Alert } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

const Setting = () => {
  const navigation = useNavigation();

  const [notificationsEnabled, setNotificationsEnabled] = React.useState(false);
  const [darkModeEnabled, setDarkModeEnabled] = React.useState(false);

  const handleNotificationsToggle = () => {
    setNotificationsEnabled(!notificationsEnabled);
  };

  const handleDarkModeToggle = () => {
    setDarkModeEnabled(!darkModeEnabled);
  };

  const handleAccountSettingPress = () => {
    Alert.alert(
      'Account Settings',
      'Choose an option',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Change Password',
          onPress: () => navigation.navigate('ChangePass'),
        },
        {
          text: 'Update Account',
          onPress: () => navigation.navigate('UpdateAcc'),
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notifications</Text>
        <Switch
          value={notificationsEnabled}
          onValueChange={handleNotificationsToggle}
        />
      </View>
      <View style={styles.separator} />
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Appearance</Text>
        <Switch
          value={darkModeEnabled}
          onValueChange={handleDarkModeToggle}
        />
        <Text style={styles.sectionSubtitle}>Dark mode</Text>
      </View>
      <View style={styles.separator} />
      <TouchableOpacity onPress={handleAccountSettingPress}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <Text style={styles.sectionSubtitle}>Manage your account settings</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'lightgrey',
    padding: 16,
  },
  section: {
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 5
  },
  sectionSubtitle: {
    color: 'gray',
  },
  separator: {
    height: 1,
    backgroundColor: 'gray',
    marginTop: 5
  },
});

export default Setting;
