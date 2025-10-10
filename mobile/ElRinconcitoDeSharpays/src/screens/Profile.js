import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Alert, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { useEmployee } from '../hooks/profile/useEmployee';

export default function Profile() {
  const navigation = useNavigation();
  const { employee, updateEmployee } = useEmployee();

  const [isEditing, setIsEditing] = useState(false);
  const [tempData, setTempData] = useState({
    name: '',
    email: '',
    image: ''
  });

  useEffect(() => {
    if (employee) {
      setTempData({
        name: employee.name || '',
        email: employee.email || '',
        image: employee.image || 'https://via.placeholder.com/150'
      });
    }
  }, [employee]);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso denegado', 'Necesitas dar permisos para acceder a tus fotos.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setTempData({ ...tempData, image: result.assets[0].uri });
    }
  };

  const handleSave = async () => {
    try {
      await updateEmployee(tempData);
      setIsEditing(false);
    } catch (error) {
      Alert.alert('Error', 'No se pudo actualizar el perfil.');
    }
  };

  const handleCancel = () => {
    setTempData({
      name: employee.name || '',
      email: employee.email || '',
      image: employee.image || 'https://via.placeholder.com/150'
    });
    setIsEditing(false);
  };

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>

      <Text style={styles.title}>Perfil</Text>

      <View style={styles.profileContainer}>
        <Image
          source={{ uri: tempData.image || 'https://via.placeholder.com/150' }}
          style={styles.profileImage}
        />
        {isEditing && (
          <TouchableOpacity style={styles.editIcon} onPress={pickImage}>
            <Ionicons name="pencil" size={16} color="white" />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Nombre</Text>
        {isEditing ? (
          <TextInput
            style={styles.input}
            value={tempData.name}
            onChangeText={(text) => setTempData({ ...tempData, name: text })}
          />
        ) : (
          <Text style={styles.placeholder}>{employee?.name || 'Nombre'}</Text>
        )}
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Correo electrónico</Text>
        {isEditing ? (
          <TextInput
            style={styles.input}
            value={tempData.email}
            onChangeText={(text) => setTempData({ ...tempData, email: text })}
          />
        ) : (
          <Text style={styles.placeholder}>{employee?.email || 'Correo electrónico'}</Text>
        )}
      </View>

      <View style={styles.buttonsRow}>
        {isEditing ? (
          <>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.buttonText}>Guardar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity style={styles.editButton} onPress={() => setIsEditing(true)}>
            <Text style={styles.buttonText}>Editar perfil</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#fff', 
    paddingHorizontal: 20 
  },
  backButton: { 
    marginTop: 40, 
    marginBottom: 10 
  },
  title: { 
    fontSize: 22, 
    fontWeight: 'bold' 
  },
  profileContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginVertical: 20, 
    position: 'relative' 
  },
  profileImage: { 
    width: 100, 
    height: 100, 
    borderRadius: 50 
  },
  editIcon: { 
    position: 'absolute', 
    bottom: 0, 
    left: 90, 
    backgroundColor: '#000', 
    borderRadius: 20, 
    padding: 6 
  },
  field: { 
    borderBottomWidth: 1, 
    borderBottomColor: '#eee', 
    paddingVertical: 10 
  },
  label: { 
    fontWeight: 'bold', 
    marginBottom: 5 
  },
  placeholder: { 
    color: '#999' 
  },
  input: { 
    borderBottomWidth: 1, 
    borderColor: '#ccc', 
    paddingVertical: 5, 
    fontSize: 16 
  },
  buttonsRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-around', 
    marginTop: 20 
  },
  editButton: { 
    backgroundColor: '#FE3F8D', // Rosa principal de la app
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 25,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#FE3F8D',
    marginHorizontal: 5
  },
  saveButton: { 
    backgroundColor: '#28a745', // Verde éxito
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 25,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#28a745',
    marginHorizontal: 5
  },
  cancelButton: { 
    backgroundColor: '#fff', // Fondo blanco para cancelar
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 25,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#dc3545', // Borde rojo
    marginHorizontal: 5,
  },
  buttonText: { 
    color: '#fff', 
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 1
  },
  cancelButtonText: { 
    color: '#dc3545', 
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 1
  },
  // Texto especial para cancelar (rojo)
  cancelButtonText: {
    color: '#dc3545',
    fontWeight: 'bold',
    fontSize: 16,
    letterSpacing: 1
  },
});
