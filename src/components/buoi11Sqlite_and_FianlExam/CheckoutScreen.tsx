import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {fetchCart, checkout, CartItem} from './database';

const CheckoutScreen = ({navigation}: any) => {
  const [userId, setUserId] = useState<number | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState(
    'Thanh toán khi nhận hàng',
  );

  // Lấy user hiện tại từ AsyncStorage
  useEffect(() => {
    const loadUser = async () => {
      const storedUser = await AsyncStorage.getItem('loggedInUser');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        setUserId(user.id);
      }
    };
    loadUser();
  }, []);

  // Load giỏ hàng
  const loadCart = async () => {
    if (!userId) return;
    const data = await fetchCart(userId);
    setCart(data);
  };

  useEffect(() => {
    loadCart();
  }, [userId]);

  const total = cart.reduce(
    (sum, item) => sum + item.price! * item.quantity,
    0,
  );

  // Xác nhận đặt hàng
  const handleCheckout = async () => {
    if (!fullname || !email || !phone || !address) {
      Alert.alert('❌ Lỗi', 'Vui lòng điền đầy đủ thông tin');
      return;
    }

    try {
      if (!userId) return;
      await checkout(userId, {fullname, email, phone, address}, paymentMethod);
      Alert.alert('✅ Thành công', 'Đặt hàng thành công', [
        {text: 'OK', onPress: () => navigation.goBack()},
      ]);
    } catch (error) {
      console.error(error);
      Alert.alert('❌ Lỗi', 'Không thể đặt hàng');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>✅ XÁC NHẬN ĐƠN HÀNG</Text>

      {/* Danh sách sản phẩm */}
      <FlatList
        data={cart}
        keyExtractor={item => item.id!.toString()}
        renderItem={({item}) => (
          <View style={styles.row}>
            <Image
              source={{uri: item.img}} // item.image phải là URL hoặc base64
              style={styles.productImage}
            />
            <View style={styles.productInfo}>
              <Text style={styles.productName}>{item.name}</Text>
              <Text>
                {item.quantity} x {item.price?.toLocaleString()}đ
              </Text>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <Text style={{textAlign: 'center', marginTop: 10}}>
            Giỏ hàng trống
          </Text>
        }
      />

      <Text style={styles.total}>
        Tổng thanh toán: {total.toLocaleString()}đ
      </Text>

      {/* Form thông tin người mua */}
      <View style={styles.form}>
        <Text>Họ và tên</Text>
        <TextInput
          style={styles.input}
          value={fullname}
          onChangeText={setFullname}
          placeholder="Nhập họ và tên"
        />

        <Text>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="Nhập email"
          keyboardType="email-address"
        />

        <Text>Số điện thoại</Text>
        <TextInput
          style={styles.input}
          value={phone}
          onChangeText={setPhone}
          placeholder="Nhập số điện thoại"
          keyboardType="phone-pad"
        />

        <Text>Địa chỉ</Text>
        <TextInput
          style={styles.input}
          value={address}
          onChangeText={setAddress}
          placeholder="Nhập địa chỉ"
        />
      </View>

      {/* Phương thức thanh toán */}
      <View style={{marginVertical: 10}}>
        <Text style={{fontWeight: 'bold'}}>Phương thức thanh toán</Text>
        <TouchableOpacity
          onPress={() => setPaymentMethod('Thanh toán khi nhận hàng')}
          style={styles.radioRow}>
          <Text>
            {paymentMethod === 'Thanh toán khi nhận hàng' ? '🔘' : '⚪️'} Thanh
            toán khi nhận hàng
          </Text>
        </TouchableOpacity>
      </View>

      {/* Nút xác nhận */}
      <TouchableOpacity style={styles.btn} onPress={handleCheckout}>
        <Text style={{color: '#fff'}}>XÁC NHẬN ĐẶT HÀNG</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default CheckoutScreen;

const styles = StyleSheet.create({
  container: {flex: 1, padding: 15, backgroundColor: '#fff'},
  title: {fontSize: 20, fontWeight: 'bold', marginBottom: 10},
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  productImage: {width: 60, height: 60, borderRadius: 8, marginRight: 10},
  productInfo: {flex: 1},
  productName: {fontWeight: 'bold', marginBottom: 3},
  total: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'right',
    marginVertical: 10,
  },
  form: {marginVertical: 10},
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginVertical: 5,
  },
  btn: {
    backgroundColor: 'green',
    padding: 15,
    alignItems: 'center',
    borderRadius: 10,
    marginVertical: 20,
  },
  radioRow: {flexDirection: 'row', alignItems: 'center', marginVertical: 5},
});
