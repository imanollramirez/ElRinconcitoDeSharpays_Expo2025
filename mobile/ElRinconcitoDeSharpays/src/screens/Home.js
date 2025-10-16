import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
  Alert,
  Animated,
  Dimensions,
  PanResponder
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { AuthContext } from '../context/AuthContext';
import { useEmployee } from '../hooks/profile/useEmployee';
import useOrders from '../hooks/orders/useOrders';
import { API_URL } from '../config';

const { height } = Dimensions.get("window");

// Puntos fijos del BottomSheet
const SNAP_POINTS = {
  FULL: height * 0.1,
  HALF: height * 0.5,
  CLOSED: height + 30,
};

export default function Home() {
  const { logout } = React.useContext(AuthContext);
  const { employee, getEmployee } = useEmployee();
  const { orders, loading, getOrders, updateOrder } = useOrders();
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const navigation = useNavigation();

  // BottomSheet state
  const [selectedOrder, setSelectedOrder] = useState(null);
  const sheetAnim = useRef(new Animated.Value(SNAP_POINTS.CLOSED)).current;

  // 🔍 Estado para zoom de imagen
  const [zoomImage, setZoomImage] = useState(null);

  useFocusEffect(
    React.useCallback(() => {
      getEmployee();
      getOrders();
      fetchCategories();
    }, [getEmployee, getOrders])
  );

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API_URL}/categories`);
      if (!res.ok) throw new Error('Error al obtener categorías');
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      "Cerrar sesión",
      "¿Seguro que quieres cerrar sesión?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Sí",
          onPress: async () => {
            await logout();
            navigation.replace("Login");
          }
        }
      ]
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pendiente": return "#FFD93D";
      case "pagado": return "#77DD77";
      case "entregado": return "#87CEEB";
      case "completado": return "#4CAF50";
      case "cancelado": return "#FF6961";
      default: return "#ccc";
    }
  };

  // Ordenar: pendientes primero, luego por fecha descendente
  const filteredOrders = (selectedCategory
    ? orders.filter(o => o.categoryId?.category === selectedCategory)
    : orders
  ).slice().sort((a, b) => {
    // Pendientes primero
    if (a.status === "pendiente" && b.status !== "pendiente") return -1;
    if (a.status !== "pendiente" && b.status === "pendiente") return 1;
    // Si ambos son del mismo grupo, ordenar por fecha descendente
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  const openOrderDetail = (order) => {
    setSelectedOrder(order);
    Animated.spring(sheetAnim, {
      toValue: SNAP_POINTS.HALF,
      useNativeDriver: true,
    }).start();
  };

  const closeOrderDetail = () => {
    Animated.spring(sheetAnim, {
      toValue: SNAP_POINTS.CLOSED,
      useNativeDriver: true,
    }).start(() => setSelectedOrder(null));
  };

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) =>
        Math.abs(gestureState.dy) > 5,
      onPanResponderMove: (_, gestureState) => {
        const newPos = Math.max(
          SNAP_POINTS.FULL,
          Math.min(SNAP_POINTS.CLOSED, sheetAnim._value + gestureState.dy)
        );
        sheetAnim.setValue(newPos);
      },
      onPanResponderRelease: (_, gestureState) => {
        let newPos = SNAP_POINTS.HALF;
        if (gestureState.dy > 100) {
          newPos = SNAP_POINTS.CLOSED;
        } else if (gestureState.dy < -100) {
          newPos = SNAP_POINTS.FULL;
        } else {
          const distances = [
            { point: SNAP_POINTS.FULL, dist: Math.abs(sheetAnim._value - SNAP_POINTS.FULL) },
            { point: SNAP_POINTS.HALF, dist: Math.abs(sheetAnim._value - SNAP_POINTS.HALF) },
            { point: SNAP_POINTS.CLOSED, dist: Math.abs(sheetAnim._value - SNAP_POINTS.CLOSED) },
          ];
          distances.sort((a, b) => a.dist - b.dist);
          newPos = distances[0].point;
        }

        Animated.spring(sheetAnim, {
          toValue: newPos,
          useNativeDriver: true,
        }).start(() => {
          if (newPos === SNAP_POINTS.CLOSED) setSelectedOrder(null);
        });
      },
    })
  ).current;

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        <StatusBar barStyle="dark-content" />

        {/* Top Bar */}
        <View style={styles.topBar}>
          <TouchableOpacity onPress={handleLogout} style={{ padding: 5 }}>
            <FontAwesome name="sign-out" size={26} color="#FE3F8D" />
          </TouchableOpacity>

          <View style={{ flex: 1, alignItems: 'center' }}>
            <Image
              source={require('../../assets/SharpayLogo.png')}
              style={styles.appLogo}
              resizeMode="contain"
            />
          </View>

          <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
            <Image
              source={{ uri: employee?.image || 'https://via.placeholder.com/150' }}
              style={styles.topProfileImage}
              defaultSource={require('../../assets/placeholder.png')}
            />
          </TouchableOpacity>
        </View>

        {/* Greeting Card */}
        <View style={styles.greetingCard}>
          <View style={{ flex: 1 }}>
            <Text style={styles.greetingText}>
              <Text style={styles.bold}>Buenos días! </Text>
              <Text style={styles.highlight}>{employee?.name || 'Usuario'}</Text>
            </Text>
            <Text style={styles.subText}>Gestiona tus ordenes con confianza y claridad</Text>
            <Text style={styles.pending}>
              {orders?.filter(o => o.status === "pendiente").length || 0} ordenes pendientes el día de hoy
            </Text>
          </View>
          <Image
            source={require('../../assets/SharpayLogoWhite.png')}
            style={styles.greetingImage}
          />
        </View>

        {/* Categorías */}
        <ScrollView horizontal style={styles.categoryContainer} showsHorizontalScrollIndicator={false}>
          <TouchableOpacity
            style={[styles.categoryButton, selectedCategory === null && styles.selectedCategory]}
            onPress={() => setSelectedCategory(null)}
          >
            <Text style={[styles.categoryText, selectedCategory === null && styles.selectedCategoryText]}>
              Todo
            </Text>
          </TouchableOpacity>

          {categories.map((cat) => (
            <TouchableOpacity
              key={cat._id}
              style={[styles.categoryButton, selectedCategory === cat.category && styles.selectedCategory]}
              onPress={() => setSelectedCategory(cat.category)}
            >
              {cat.image && (
                <Image
                  source={{ uri: cat.image }}
                  style={styles.categoryImage}
                />
              )}
              <Text style={[styles.categoryText, selectedCategory === cat.category && styles.selectedCategoryText]}>
                {cat.category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.divider} />

        {/* Pedidos recientes */}
        <Text style={styles.sectionTitle}>Pedidos recientes</Text>
        <View style={styles.orderList}>
          {loading ? (
            <Text>Cargando órdenes...</Text>
          ) : filteredOrders.length === 0 ? (
            <Text>No hay órdenes recientes</Text>
          ) : (
            filteredOrders.map((order, i) => (
              <TouchableOpacity key={order._id || i} style={styles.orderItem} onPress={() => openOrderDetail(order)}>
                <Image
                  source={
                    order.categoryId?.image
                      ? { uri: order.categoryId.image }
                      : require('../../assets/rinconcitoDeSharpays.png')
                  }
                  style={styles.orderLogo}
                />
                <View style={{ flex: 1 }}>
                  <Text style={styles.orderTitle}>
                    {order.categoryId?.category || "Producto Personalizado"}
                  </Text>
                  {/* Estado en texto */}
                  <Text style={styles.orderStatusText}>
                    {order.status?.charAt(0).toUpperCase() + order.status?.slice(1) || "Pendiente"}
                  </Text>
                  <Text style={styles.orderInfo}>
                    {new Date(order.createdAt).toLocaleDateString()} · ${(order.total || 0).toFixed(2)} · {order.orderDetails.length} items
                  </Text>
                  <Text style={styles.orderSub}>
                    {order.orderDetails.map(p => p.productName).join(", ")}
                  </Text>
                </View>
                <View style={[styles.dot, { backgroundColor: getStatusColor(order.status) }]} />
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>

      {/* BottomSheet */}
      {selectedOrder && (
        <Animated.View
          style={[
            styles.bottomSheet,
            { transform: [{ translateY: sheetAnim }] }
          ]}
          {...panResponder.panHandlers}
        >
          <ScrollView>
            <View style={{ alignItems: "center", marginBottom: 20 }}>
              <View style={styles.handleBar} />
              <Image
                source={
                  selectedOrder?.categoryId?.image
                    ? { uri: selectedOrder.categoryId.image }
                    : require('../../assets/rinconcitoDeSharpays.png')
                }
                style={{ width: 100, height: 100, borderRadius: 50 }}
              />
              <Text style={{ fontSize: 20, fontWeight: "bold", marginTop: 1, textAlign: "center"}}>
                {selectedOrder?.categoryId?.category || "Camisa personalizada o Dua"}
              </Text>
              <Text style={{ color: "#555" }}>
                {selectedOrder?.customerId?.name || "Cliente desconocido"}
              </Text>
              <Text style={{ fontSize: 12, color: "#999" }}>
                {new Date(selectedOrder?.createdAt).toLocaleString()}
              </Text>
            </View>

            <View style={{ marginBottom: 15 }}>
              <Text style={{ fontWeight: "bold", marginBottom: 8 }}>
                Estado: {selectedOrder?.status || "Pendiente"}
              </Text>
              {selectedOrder?.orderDetails.map((item, idx) => (
                <View
                  key={idx}
                  style={{
                    backgroundColor: "#f9f9f9",
                    padding: 10,
                    borderRadius: 8,
                    marginBottom: 8,
                  }}
                >
                  <Text style={{ flex: 1 }}>
                    {item.quantity} x {item.productName}
                  </Text>

                  {/* Imagen con zoom modal */}
                  {item.customDesign && (
                    <View style={{ marginTop: 10, alignItems: "center" }}>
                      <TouchableOpacity onPress={() => setZoomImage(item.customDesign)}>
                        <Image
                          source={{ uri: item.customDesign }}
                          style={{
                            width: 150,
                            height: 150,
                            borderRadius: 10,
                            borderWidth: 1,
                            borderColor: "#ddd",
                          }}
                        />
                      </TouchableOpacity>

                      {zoomImage === item.customDesign && (
                        <TouchableOpacity
                          activeOpacity={1}
                          onPress={() => setZoomImage(null)}
                          style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: "rgba(0,0,0,0.9)",
                            justifyContent: "center",
                            alignItems: "center",
                            zIndex: 999,
                          }}
                        >
                          <TouchableOpacity
                            style={{
                              position: "absolute",
                              top: 40,
                              right: 20,
                              padding: 10,
                              zIndex: 1000,
                            }}
                            onPress={() => setZoomImage(null)}
                          >
                            <Text style={{ color: "#fff", fontSize: 18 }}>✕</Text>
                          </TouchableOpacity>

                          <Image
                            source={{ uri: item.customDesign }}
                            style={{
                              width: "90%",
                              height: "70%",
                              borderRadius: 10,
                              resizeMode: "contain",
                            }}
                          />
                        </TouchableOpacity>
                      )}
                    </View>
                  )}
                </View>
              ))}
            </View>

            <View style={{ height: 100 }} />

            {selectedOrder?.shippingAddress && (
              <TouchableOpacity
                style={{
                  backgroundColor: "#636361",
                  padding: 12,
                  borderRadius: 10,
                  marginTop: 20
                }}
                onPress={() => {
                  const { address, city } = selectedOrder.shippingAddress;
                  Alert.alert(
                    "Datos de envío",
                    ` Dirección: ${address || "No especificada"}\n Ciudad: ${city || "No especificada"}`,
                    [{ text: "Cerrar", style: "cancel" }]
                  );
                }}
              >
                <Text style={{ color: "#fff", fontWeight: "bold", textAlign: "center" }}>
                  Ver datos de envío
                </Text>
              </TouchableOpacity>
            )}

            {selectedOrder?.status !== "completado" && (
              <TouchableOpacity
                style={{
                  marginTop: 20,
                  backgroundColor: "#4CAF50",
                  padding: 12,
                  borderRadius: 10,
                  marginBottom: 40,
                }}
                onPress={() =>
                  Alert.alert(
                    "Confirmación",
                    "¿Deseas marcar la orden como entregada?",
                    [
                      { text: "Cancelar", style: "cancel" },
                      {
                        text: "Sí",
                        onPress: () => {
                          updateOrder(selectedOrder._id, { status: "completado" });
                          closeOrderDetail();
                        }
                      }
                    ]
                  )
                }
              >
                <Text style={{ color: "#fff", fontWeight: "bold", textAlign: "center" }}>
                  Marcar como completado
                </Text>
              </TouchableOpacity>
            )}
          </ScrollView>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: '#F4F4F4', paddingHorizontal: 20, paddingTop: 40 },
  appLogo: { width: 100, height: 50, marginHorizontal: 10 },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 15, paddingHorizontal: 5 },
  topProfileImage: { width: 50, height: 50, borderRadius: 25 },
  greetingCard: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 20, elevation: 3, alignItems: 'center' },
  greetingText: { fontSize: 16 },
  bold: { fontWeight: 'bold' },
  highlight: { color: '#FE3F8D', fontWeight: 'bold' },
  subText: { fontSize: 13, marginTop: 4, color: '#444' },
  pending: { fontSize: 12, color: '#999', marginTop: 6 },
  greetingImage: { width: 60, height: 60, marginLeft: 10 },
  categoryContainer: { flexDirection: 'row', marginBottom: 20 },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderColor: '#ccc',
    borderWidth: 1,
    marginRight: 8,
    backgroundColor: '#fff'
  },
  selectedCategory: { borderColor: '#FE3F8D' },
  categoryText: { fontSize: 14, color: '#333' },
  selectedCategoryText: { color: '#FE3F8D' },
  divider: { height: 1, backgroundColor: '#ccc', marginVertical: 10, width: '100%' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  orderList: { marginBottom: 30 },
  orderItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 14, borderRadius: 12, marginBottom: 12, elevation: 2 },
  orderLogo: { width: 50, height: 50, marginRight: 14, borderRadius: 10 },
  orderTitle: { fontWeight: 'bold', fontSize: 14 },
  orderInfo: { fontSize: 12, color: '#555', marginTop: 2 },
  orderSub: { fontSize: 11, color: '#aaa', marginTop: 2 },
  dot: { width: 10, height: 10, borderRadius: 50, marginLeft: 10 },
  bottomSheet: {
    position: "absolute",
    left: 0,
    right: 0,
    height,
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    elevation: 10,
  },
  handleBar: {
    width: 50,
    height: 5,
    borderRadius: 5,
    backgroundColor: "#ccc",
    alignSelf: "center",
    marginBottom: 10,
  },
  categoryImage: {
    width: 20,
    height: 20,
    borderRadius: 5,
    marginRight: 6
  },
  orderStatusText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FE3F8D',
    marginTop: 2,
  },
});
