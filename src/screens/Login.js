// components/login.js
import React, { Component, useEffect, useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button, Alert, ActivityIndicator } from 'react-native';
import { screens } from '.';
import firebase from '../database/configDB';

export default Login = ({navigation}) => {
  const [email, setEmail] = useState("ak@dhull.com");
  const [password, setPassword] = useState("123456");
  const [loading, setLoading] = useState(false);

  userLogin = () => {
    if (email === "" && password === "") {
      Alert.alert("Enter details to signin!");
    } else {
      setLoading(true);
      firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then((res) => {
          console.log(res);
          console.log("User logged-in successfully!");
          navigation.navigate(screens.GROUPS);
        })
        .catch((error) => Alert.alert( error.message ));
    }
  };

  useEffect(()=>{
    const user = firebase.auth().currentUser;
    if(user?.uid && user?.uid != ""){
      navigation.navigate(screens.GROUPS)
    }
  },[])
  return (
    <View  style={styles.container}>

      {loading &&
        <View style={styles.preloader}>
          <ActivityIndicator size="large" color="#9E9E9E" />
        </View>
      }
      <TextInput
        style={styles.inputStyle}
        placeholder="Email"
        value={email}
        onChangeText={(val) => setEmail(val)}
      />
      <TextInput
        style={styles.inputStyle}
        placeholder="Password"
        value={password}
        onChangeText={(val) => setPassword(val)}
        maxLength={15}
        minLength={6}
        secureTextEntry={true}
      />
      <Button color="#3740FE" title="Signin" onPress={() => userLogin()} />
      <Text
        style={styles.loginText}
        onPress={() => navigation.navigate(screens.SIGNUP)}
      >
        Don't have account? Click here to signup
      </Text>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    padding: 35,
    backgroundColor: '#fff'
  },
  inputStyle: {
    width: '100%',
    marginBottom: 15,
    paddingBottom: 15,
    alignSelf: "center",
    borderColor: "#ccc",
    borderBottomWidth: 1
  },
  loginText: {
    color: '#3740FE',
    marginTop: 25,
    textAlign: 'center'
  },
  preloader: {
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff'
  }
});