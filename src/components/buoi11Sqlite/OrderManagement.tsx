import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import {fetchAllOrders, updateOrderStatus, Order} from './database'; // giả sử có các hàm này

const OrderManagement = () => {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    const data = await fetchAllOrders();
    setOrders(data);
  };

  const changeStatus = async (orderId: number, newStatus: string) => {
    await updateOrderStatus(orderId, newStatus);
    Alert.alert('✔ Thành công', `Cập nhật trạng thái thành ${newStatus}`);
    loadOrders(); // reload lại đơn
  };

  const renderItem = ({item}: {item: Order}) => (
    <View style={styles.orderCard}>
      <Text style={styles.orderId}>Đơn hàng #{item.id}</Text>
      <Text>Tổng tiền: {item.total.toLocaleString()}đ</Text>
      <Text>Ngày đặt: {item.created_at}</Text>
      <Text>Trạng thái: {item.status}</Text>
      <Text>Họ tên: {item.fullname}</Text>
      <Text>Email: {item.email}</Text>
      <Text>Điện thoại: {item.phone}</Text>
      <Text>Địa chỉ: {item.address}</Text>
      <Text>Phương thức thanh toán: {item.payment_method}</Text>

      <View style={styles.buttonsRow}>
        <TouchableOpacity
          style={[styles.statusBtn, {backgroundColor: '#4CAF50'}]}
          onPress={() => changeStatus(item.id, 'Đã duyệt')}>
          <Text style={styles.statusText}>Đã duyệt</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.statusBtn, {backgroundColor: '#f44336'}]}
          onPress={() => changeStatus(item.id, 'Đã hủy')}>
          <Text style={styles.statusText}>Đã hủy</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📋 Quản trị Đơn hàng</Text>

      <FlatList
        data={orders}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={{textAlign: 'center', marginTop: 20}}>
            Không có đơn hàng nào.
          </Text>
        }
      />
    </View>
  );
};

export default OrderManagement;

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
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  statusBtn: {
    padding: 10,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  statusText: {color: '#fff', fontWeight: 'bold'},
});
