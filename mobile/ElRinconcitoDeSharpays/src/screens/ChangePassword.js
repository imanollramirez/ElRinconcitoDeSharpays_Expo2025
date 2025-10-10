import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CustomButton from '../components/CustomButton';
import PasswordTextBox from '../components/PasswordTextBox'; 
import useRecoveryPassword from '../hooks/useRecoveryPassword';

const ChangePasswordScreen = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(false);
  
  const { 
    newPassword, 
    setNewPassword, 
    confirmPassword, 
    setConfirmPassword, 
    resetPassword 
  } = useRecoveryPassword();

  const validatePassword = (password) => {
    // Validación: 8 caracteres mínimo, al menos 1 letra, 1 número, 1 carácter especial
    const minLength = password.length >= 8;
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>_\-]/.test(password);
    
    return minLength && hasLetter && hasNumber && hasSpecialChar;
  };

  const handleChangePassword = async () => {
    // Validaciones
    if (!newPassword || !confirmPassword) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    if (!validatePassword(newPassword)) {
      Alert.alert(
        'Contraseña inválida', 
        '8 caracteres (1 mínimo):\n1 letra, 1 número, 1 carácter especial (!@#$%...)'
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return;
    }

    setIsLoading(true);
    
    try {
      const success = await resetPassword();
      if (success) {
        Alert.alert(
          'Éxito', 
          'Tu contraseña ha sido cambiada exitosamente',
          [
            {
              text: 'OK',
              onPress: () => {
                navigation.reset({
                  index: 0,
                  routes: [{ name: 'Login' }],
                });
              }
            }
          ]
        );
      }
      // Si no fue exitoso, el hook ya mostró el error
    } catch (error) {
      console.error('Error cambiando contraseña:', error);
      Alert.alert('Error', 'Hubo un problema al cambiar la contraseña');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header con botón de regreso */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
            <Ionicons name="chevron-back" size={24} color="#333" />
          </TouchableOpacity>
        </View>

        {/* Contenido principal */}
        <View style={styles.content}>
          <Text style={styles.title}>
            Crea una{'\n'}
            <Text style={styles.titlePink}>contraseña</Text>
          </Text>

          {/* Campos de contraseña */}
          <View style={styles.formContainer}>
            <PasswordTextBox
              placeholder="Contraseña"
              value={newPassword}
              onChangeText={setNewPassword}
              editable={!isLoading}
            />

            <PasswordTextBox
              placeholder="Confirmar contraseña"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              editable={!isLoading}
            />
          </View>

          {/* Información de validación */}
          <Text style={styles.validationText}>
            8 caracteres (1o máximo){'\n'}
            1 letra, 1 número, 1 carácter especial (!@#$...)
          </Text>

          {/* Botón de cambiar contraseña */}
          <CustomButton
            title={isLoading ? "Cambiando..." : "Cambiar contraseña"}
            onPress={handleChangePassword}
            disabled={isLoading || !newPassword || !confirmPassword}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 30,
    paddingTop: 20,
  },
  title: {
    fontSize: 38,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 40,
    lineHeight: 46,
  },
  titlePink: {
    color: '#ff4081',
  },
  formContainer: {
    marginBottom: 20,
  },
  validationText: {
    fontSize: 12,
    color: '#999',
    marginBottom: 40,
    lineHeight: 16,
  },
});

export default ChangePasswordScreen;