import React, {useEffect, useState} from 'react';
import {View, Text, FlatList, StyleSheet, TouchableOpacity} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {fetchOrders, fetchOrderItems, Order} from './database';

const OrderHistoryScreen = () => {
  const [userId, setUserId] = useState<number | null>(null);
  const [orders, setOrders] = useState<(Order & {items?: any[]})[]>([]);
  const [expandedOrderIds, setExpandedOrderIds] = useState<number[]>([]);

  useEffect(() => {
    const loadUser = async () => {
      const stored = await AsyncStorage.getItem('loggedInUser');
      if (stored) {
        const user = JSON.parse(stored);
        setUserId(user.id);
      }
    };
    loadUser();
  }, []);

  useEffect(() => {
    if (userId) loadOrders();
  }, [userId]);

  const loadOrders = async () => {
    if (!userId) return;
    const data = await fetchOrders(userId);

    const fullOrders = [];
    for (const order of data) {
      const items = await fetchOrderItems(order.id);
      fullOrders.push({...order, items});
    }

    setOrders(fullOrders);
  };

  // 🔥 Toggle mở/đóng một đơn
  const toggleExpand = (orderId: number) => {
    setExpandedOrderIds(prev =>
      prev.includes(orderId)
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId],
    );
  };

  const renderOrder = ({item}: {item: Order & {items?: any[]}}) => {
    const isExpanded = expandedOrderIds.includes(item.id);

    return (
      <View style={styles.orderCard}>
        {/* Header của mỗi đơn */}
        <TouchableOpacity onPress={() => toggleExpand(item.id)}>
          <View style={styles.headerRow}>
            <Text style={styles.orderId}>📦 Đơn hàng #{item.id}</Text>
            <Text style={styles.toggleText}>{isExpanded ? '▲' : '▼'}</Text>
          </View>

          <Text style={styles.orderDate}>Ngày đặt: {item.created_at}</Text>
          <Text style={styles.orderStatus}>Trạng thái: {item.status}</Text>
        </TouchableOpacity>

        {/* Hiển thị chi tiết nếu mở */}
        {isExpanded && (
          <>
            <Text style={styles.sectionTitle}>🛍 SẢN PHẨM</Text>
            {item.items?.map((it, index) => (
              <View key={index} style={styles.productRow}>
                <Text style={styles.productName}>{it.name}</Text>
                <Text>Số lượng: {it.quantity}</Text>
                <Text>Giá: {it.price.toLocaleString()}đ</Text>
              </View>
            ))}

            <Text style={styles.sectionTitle}>🚚 THÔNG TIN GIAO HÀNG</Text>
            <Text>Họ tên: {item.fullname}</Text>
            <Text>Email: {item.email}</Text>
            <Text>Điện thoại: {item.phone}</Text>
            <Text>Địa chỉ: {item.address}</Text>
            <Text>Thanh toán: {item.payment_method}</Text>

            <Text style={styles.totalMoney}>
              💰 Tổng tiền: {item.total.toLocaleString()}đ
            </Text>
          </>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📦 LỊCH SỬ ĐƠN HÀNG</Text>

      <FlatList
        data={orders}
        keyExtractor={item => item.id.toString()}
        renderItem={renderOrder}
        ListEmptyComponent={
          <Text style={{textAlign: 'center', marginTop: 20}}>
            Bạn chưa có đơn hàng nào!
          </Text>
        }
      />
    </View>
  );
};

export default OrderHistoryScreen;

// ------------------------ STYLES ------------------------
const styles = StyleSheet.create({
  container: {flex: 1, padding: 15, backgroundColor: '#fff'},
  title: {fontSize: 22, fontWeight: 'bold', marginBottom: 10},

  orderCard: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 15,
    borderRadius: 10,
    marginBottom: 12,
    backgroundColor: '#fafafa',
  },

  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  orderId: {
    fontSize: 17,
    fontWeight: 'bold',
  },

  toggleText: {
    fontSize: 18,
    fontWeight: 'bold',
  },

  orderDate: {color: '#555', marginTop: 5},
  orderStatus: {marginBottom: 10, color: '#222'},

  sectionTitle: {
    marginTop: 12,
    fontWeight: 'bold',
    fontSize: 16,
  },

  productRow: {
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },

  productName: {fontWeight: 'bold'},

  totalMoney: {
    marginTop: 10,
    fontWeight: 'bold',
    fontSize: 16,
    color: '#000',
  },
});
