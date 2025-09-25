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
  FULL: height * 0.1,   // expandido (90% pantalla)
  HALF: height * 0.5,   // mitad
  CLOSED: height,       // cerrado (fuera de vista)
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

  const filteredOrders = selectedCategory
    ? orders.filter(o => o.categoryId?.category === selectedCategory)
    : orders;

  const openOrderDetail = (order) => {
    setSelectedOrder(order);
    Animated.spring(sheetAnim, {
      toValue: SNAP_POINTS.HALF, // abre en mitad
      useNativeDriver: true,
    }).start();
  };

  const closeOrderDetail = () => {
    Animated.spring(sheetAnim, {
      toValue: SNAP_POINTS.CLOSED,
      useNativeDriver: true,
    }).start(() => setSelectedOrder(null));
  };

  // PanResponder con 3 estados (FULL, HALF, CLOSED)
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
          newPos = SNAP_POINTS.CLOSED; // bajó suficiente → cerrar
        } else if (gestureState.dy < -100) {
          newPos = SNAP_POINTS.FULL; // subió suficiente → expandir
        } else {
          // el más cercano
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
        }).start();
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

        {/* Search */}
        <View style={styles.searchContainer}>
          <FontAwesome name="search" size={18} color="#000" style={{ marginRight: 10 }} />
          <TextInput placeholder="Buscar" style={styles.searchInput} />
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

        {/* Categories */}
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

        {/* Recent Orders */}
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
              <Image
                source={
                  selectedOrder?.categoryId?.image
                    ? { uri: selectedOrder.categoryId.image }
                    : require('../../assets/rinconcitoDeSharpays.png')
                }
                style={{ width: 100, height: 100, borderRadius: 50 }}
              />
              <Text style={{ fontSize: 20, fontWeight: "bold", marginTop: 10, textAlign: "center"}}>
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
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginVertical: 5
                  }}
                >
                  <Text style={{ flex: 1 }}>
                    {item.quantity} x {item.productName}
                  </Text>
                </View>
              ))}
            </View>

            <View
              style={{
                borderTopWidth: 1,
                borderTopColor: "#ddd",
                paddingTop: 10,
                flexDirection: "row",
                justifyContent: "space-between"
              }}
            >
              <Text style={{ fontWeight: "bold", fontSize: 16 }}>Total:</Text>
              <Text style={{ fontWeight: "bold", fontSize: 16 }}>
                ${(selectedOrder?.total ?? 0).toFixed(2)}
              </Text>
            </View>

            {selectedOrder?.status !== "completado" && (
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginTop: 20
                }}
              >
                <TouchableOpacity
                  style={{
                    flex: 1,
                    marginRight: 10,
                    backgroundColor: "#FF6961",
                    padding: 12,
                    borderRadius: 10,
                    alignItems: "center"
                  }}
                  onPress={() => Alert.alert("Cancelar pedido")}
                >
                  <Text style={{ color: "#fff", fontWeight: "bold", textAlign: "center" }}>
                    Cancelar Pedido
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{
                    flex: 1,
                    marginLeft: 10,
                    backgroundColor: "#4CAF50",
                    padding: 12,
                    borderRadius: 10,
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
              </View>
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
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 12, padding: 10, marginBottom: 20, elevation: 2 },
  searchInput: { flex: 1, fontSize: 14 },
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
    height: height, // ocupa toda la pantalla
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    elevation: 10,
  },
  categoryImage: {
    width: 20,
    height: 20,
    borderRadius: 5,
    marginRight: 6
  }
});
