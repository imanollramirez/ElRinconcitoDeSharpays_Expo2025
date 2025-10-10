import React, { useState, useContext, useEffect } from "react";
import { Alert } from "react-native";
import {
  View, StatusBar, StyleSheet, Image, Text, TextInput,
  TouchableOpacity, KeyboardAvoidingView, Platform,
  TouchableWithoutFeedback, Keyboard, ScrollView
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useFonts } from "expo-font";
import { useNavigation } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";

import { AuthContext } from "../context/AuthContext";
import Typical from 'react-native-typical';

export default function Login() {
  const [fonts] = useFonts({
    Poppins: require("../../assets/fonts/Poppins.ttf"),
    PoppinsBold: require("../../assets/fonts/Poppins-Bold.ttf")
  });

  const navigation = useNavigation();
  const { login, authToken, biometricLogin } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showBioButton, setShowBioButton] = useState(false);

  useEffect(() => {
    // Revisar si ya hay datos biométricos guardados
    const checkBiometricData = async () => {
      const token = await SecureStore.getItemAsync("bioToken");
      const userId = await SecureStore.getItemAsync("bioUserId");
      const enabled = await SecureStore.getItemAsync("biometricEnabled");
      if (token && userId && enabled === "true") setShowBioButton(true);
    };
    checkBiometricData();
  }, []);

  useEffect(() => {
    if (authToken) {
      navigation.replace("Home");
    }
  }, [authToken]);

  if (!fonts) return null;

  const handleLogin = async () => {
    const cleanedEmail = email.trim().toLowerCase();
    if(!cleanedEmail || !password) {
      Alert.alert("Complete los campos");
      return;
    }

    const success = await login(cleanedEmail, password);
    if (success) {
      // 🔹 Guardamos que hay datos biométricos y activamos el botón
      const compatible = await SecureStore.getItemAsync("biometricEnabled");
      if (compatible === "true") {
        setShowBioButton(true);
      }
      navigation.replace("Home");
    }
  };

  const handleBiometricLogin = async () => {
    const success = await biometricLogin();
    if (success) navigation.replace("Home");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <StatusBar hidden />
      <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row', height: 135 }}>
        <Image source={require('../../assets/SharpayLogoWhite.png')} style={styles.logo} resizeMode="contain" />
        <Typical steps={['El Rinconcito de\nSharpays']} loop={1} wrapper="Text" style={{
          color: 'white', fontFamily: 'PoppinsBold', fontSize: 16, textAlign: 'start', paddingLeft: 10
        }}/>
      </View>

      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.box}>
          <Text style={styles.title}>Iniciar Sesión</Text>
          <Text style={styles.info}>Complete los campos</Text>
          <ScrollView contentContainerStyle={{ alignItems: 'center' }} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>

            <View style={styles.fields}>
              <FontAwesome name='envelope' size={17} style={styles.icons} />
              <TextInput placeholder='Correo electrónico' value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" style={styles.inputs} />
            </View>

            <View style={styles.fields}>
              <FontAwesome name='lock' size={22} style={styles.icons} />
              <TextInput placeholder="Contraseña" value={password} onChangeText={setPassword} secureTextEntry style={styles.inputs} />
            </View>

            <TouchableOpacity style={styles.button} onPress={handleLogin}>
              <Text style={styles.buttonText}>Ingresar</Text>
            </TouchableOpacity>

            {showBioButton && (
              <TouchableOpacity style={styles.bioButton} onPress={handleBiometricLogin}>
                
                <Text style={styles.bioText}>Iniciar con huella o Face ID</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity onPress={() => navigation.navigate("RecoveryPassword")}>
              <Text style={styles.forgettenPassword}>Olvidé mi contraseña</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FE3F8D', position: 'relative', alignItems: 'center' },
  logo: { width: 60, height: 60 },
  title: { fontFamily: "PoppinsBold", color: '#636361ff', fontSize: 26, marginTop: 100 },
  box: { flex: 1, width: '100%', height: '60%', marginBottom: 0, backgroundColor: 'white', borderTopRightRadius: 30, borderTopLeftRadius: 30, justifyContent: 'center', alignItems: 'center' },
  info: { color: "#636361ff", fontSize: 14, fontFamily: "Poppins", marginBottom: 60 },
  fields: { flexDirection: 'row', alignItems: 'center', marginVertical: 8, width: 280, height: 60, borderRadius: 15, padding: 5, backgroundColor: '#eeeeeee5', color: "#7A7A73" },
  inputs: { flex: 1, fontSize: 14, paddingLeft: 10, fontFamily: "Poppins" },
  icons: { color: "#7A7A73" },
  button: { backgroundColor: "#FE3F8D", borderRadius: 15, width: 180, height: 50, justifyContent: 'center', alignItems: 'center', marginBottom: 20, marginTop: 50 },
  buttonText: { color: 'white', fontFamily: "PoppinsBold" },

  
  bioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent', // sin fondo
    borderWidth: 0,                 // sin borde
    width: 'auto',
    height: 'auto',
    marginBottom: 30,
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  bioText: {
    color: '#FE3F8D',
    fontFamily: "PoppinsBold",
    textDecorationLine: 'underline', // se ve como link
    fontSize: 14,
  },

  forgettenPassword: { color: '#4e4e4eff', textDecorationLine: 'underline', fontFamily: "Poppins", marginTop: 20 }
});

