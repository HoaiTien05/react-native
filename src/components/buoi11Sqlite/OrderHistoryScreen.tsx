import React, {useEffect, useState} from 'react';
import {View, Text, FlatList, StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {fetchOrders, Order} from './database';

const OrderHistoryScreen = () => {
  const [userId, setUserId] = useState<number | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);

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
    setOrders(data);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📦 LỊCH SỬ ĐƠN HÀNG</Text>

      <FlatList
        data={orders}
        keyExtractor={item => item.id.toString()}
        renderItem={({item}) => (
          <View style={styles.orderCard}>
            <Text style={styles.orderId}>Đơn hàng #{item.id}</Text>
            <Text>Tổng tiền: {item.total.toLocaleString()}đ</Text>
            <Text>Ngày đặt: {item.created_at}</Text>
          </View>
        )}
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

const styles = StyleSheet.create({
  container: {flex: 1, padding: 15, backgroundColor: '#fff'},
  title: {fontSize: 22, fontWeight: 'bold', marginBottom: 10},
  orderCard: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  orderId: {fontWeight: 'bold', marginBottom: 5},
});
