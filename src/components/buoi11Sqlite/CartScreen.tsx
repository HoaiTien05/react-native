import React, {useEffect, useState, useCallback} from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect} from '@react-navigation/native';

import {
  fetchCart,
  updateCartQuantity,
  removeCartItem,
  CartItem,
} from './database';

// Map ảnh từ tên file trong DB
const getImageSource = (img: string) => {
  return {uri: img};
};

const CartScreen = ({navigation}: any) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [userId, setUserId] = useState<number | null>(null);

  // ✅ Lấy user hiện tại
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

  // ✅ Load giỏ hàng theo user
  const loadCart = async (uid: number) => {
    const data = await fetchCart(uid);
    setCart(data);
  };

  // ✅ Load khi có userId
  useEffect(() => {
    if (userId) loadCart(userId);
  }, [userId]);

  // ✅ Reload khi quay lại màn hình
  useFocusEffect(
    useCallback(() => {
      if (userId) loadCart(userId);
    }, [userId]),
  );

  const increase = async (item: CartItem) => {
    await updateCartQuantity(item.id!, item.quantity + 1);
    if (userId) loadCart(userId);
  };

  const decrease = async (item: CartItem) => {
    if (item.quantity === 1) return;
    await updateCartQuantity(item.id!, item.quantity - 1);
    if (userId) loadCart(userId);
  };

  const removeItem = async (id: number) => {
    Alert.alert('Xóa sản phẩm', 'Bạn có chắc?', [
      {text: 'Hủy'},
      {
        text: 'Xóa',
        onPress: async () => {
          await removeCartItem(id);
          if (userId) loadCart(userId);
        },
      },
    ]);
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🛒 GIỎ HÀNG</Text>

      <FlatList
        data={cart}
        keyExtractor={item => item.id!.toString()}
        renderItem={({item}) => (
          <View style={styles.card}>
            <Image source={getImageSource(item.img)} style={styles.image} />

            <View style={{flex: 1}}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.price}>{item.price.toLocaleString()}đ</Text>

              <View style={styles.qtyRow}>
                <TouchableOpacity
                  onPress={() => decrease(item)}
                  style={styles.qtyBtn}>
                  <Text>-</Text>
                </TouchableOpacity>

                <Text style={styles.qty}>{item.quantity}</Text>

                <TouchableOpacity
                  onPress={() => increase(item)}
                  style={styles.qtyBtn}>
                  <Text>+</Text>
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              onPress={() => removeItem(item.id!)}
              style={styles.deleteBtn}>
              <Text style={{color: '#fff'}}>X</Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <Text style={{textAlign: 'center', marginTop: 20}}>
            Giỏ hàng trống
          </Text>
        }
      />

      <View style={styles.footer}>
        <Text style={styles.total}>Tổng: {total.toLocaleString()}đ</Text>
        <TouchableOpacity
          style={styles.checkout}
          onPress={() => navigation.navigate('Checkout')}>
          <Text style={{color: '#fff'}}>Thanh toán</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CartScreen;

const styles = StyleSheet.create({
  container: {flex: 1, padding: 10},
  title: {fontSize: 20, fontWeight: 'bold', marginBottom: 10},
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginBottom: 10,
    padding: 10,
    borderRadius: 8,
    elevation: 3,
  },
  image: {width: 80, height: 80, borderRadius: 8, marginRight: 10},
  name: {fontWeight: 'bold', fontSize: 15},
  price: {color: 'red'},
  qtyRow: {flexDirection: 'row', alignItems: 'center', marginTop: 5},
  qtyBtn: {
    borderWidth: 1,
    width: 25,
    height: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qty: {marginHorizontal: 10},
  deleteBtn: {
    backgroundColor: 'red',
    padding: 8,
    borderRadius: 20,
    alignSelf: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 10,
    borderTopWidth: 1,
  },
  total: {fontSize: 18, fontWeight: 'bold'},
  checkout: {
    backgroundColor: 'green',
    paddingHorizontal: 20,
    borderRadius: 8,
    justifyContent: 'center',
  },
});
