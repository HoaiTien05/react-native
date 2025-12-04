import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {HomeStackParamList} from './types';

type AdminNav = NativeStackNavigationProp<HomeStackParamList, 'AdminDashboard'>;

const AdminDashboard = () => {
  const navigation = useNavigation<AdminNav>();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Trang Quản Trị Admin</Text>

      <Text style={styles.subTitle}>Chọn chức năng:</Text>

      <TouchableOpacity
        style={styles.menuButton}
        onPress={() => navigation.navigate('Home')}>
        <Text style={styles.menuText}>🏠 Quay về Home</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.menuButton}
        onPress={() => navigation.navigate('UserManagement')}>
        <Text style={styles.menuText}>👤 Quản lý người dùng</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.menuButton}
        onPress={() => navigation.navigate('CategoryManagement')}>
        <Text style={styles.menuText}>📂 Quản lý danh mục</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.menuButton}
        onPress={() => navigation.navigate('ProductManagement')}>
        <Text style={styles.menuText}>📦 Quản lý sản phẩm</Text>
      </TouchableOpacity>

      {/* Nút mới Quản trị đơn hàng */}
      <TouchableOpacity
        style={styles.menuButton}
        onPress={() => navigation.navigate('OrderManagement')}>
        <Text style={styles.menuText}>📋 Quản trị đơn hàng</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default AdminDashboard;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 100,
    backgroundColor: '#F8F8F8',
    flexGrow: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
  },
  subTitle: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 20,
    color: '#555',
  },
  menuButton: {
    backgroundColor: '#4A90E2',
    paddingVertical: 15,
    borderRadius: 12,
    marginVertical: 10,
    elevation: 3,
  },
  menuText: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
});
