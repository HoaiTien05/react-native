import React, {useCallback, useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Alert} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {BottomTabParamList} from './AppTabs';

const Header = () => {
  const [user, setUser] = useState<{username: string; role: string} | null>(
    null,
  );

  const navigation =
    useNavigation<NativeStackNavigationProp<BottomTabParamList>>();

  // Load user khi vào màn hình
  useFocusEffect(
    useCallback(() => {
      const loadUser = async () => {
        const loggedInUser = await AsyncStorage.getItem('loggedInUser');
        setUser(loggedInUser ? JSON.parse(loggedInUser) : null);
      };
      loadUser();
    }, []),
  );

  const handleLogout = () => {
    Alert.alert('Đăng xuất', 'Bạn có chắc muốn đăng xuất?', [
      {text: 'Hủy', style: 'cancel'},
      {
        text: 'Đăng xuất',
        style: 'destructive',
        onPress: async () => {
          await AsyncStorage.removeItem('loggedInUser');
          setUser(null);
          navigation.navigate('LoginSqlite');
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      {/* 👋 Chào user */}
      {user ? (
        <Text style={styles.username}>
          👋 Xin chào {user.username} • {user.role}
        </Text>
      ) : (
        <TouchableOpacity onPress={() => navigation.navigate('LoginSqlite')}>
          <Text style={styles.username}>Đăng nhập</Text>
        </TouchableOpacity>
      )}

      {/* 👉 ICON PROFILE + LOGOUT */}
      <View style={{flexDirection: 'row', alignItems: 'center', gap: 15}}>
        {/* 🔥 Icon Profile */}
        <TouchableOpacity
          onPress={
            () =>
              user
                ? navigation.navigate('Profile') // đã login → vào profile
                : navigation.navigate('LoginSqlite') // chưa login → login
          }>
          <Text style={styles.icon}>👤</Text>
        </TouchableOpacity>

        {/* ❌ Nút Đăng xuất */}
        {user && (
          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
            <Text style={styles.logoutText}>Đăng xuất</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    height: 70,
    backgroundColor: '#6200ea',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    paddingHorizontal: 15,
    marginBottom: 12,

    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,

    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 4,
    shadowOffset: {width: 0, height: 3},
  },

  username: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  icon: {
    fontSize: 28,
    color: '#fff',
  },

  logoutBtn: {
    backgroundColor: '#ff5252',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },

  logoutText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
