import React, {useEffect, useState} from 'react';
import {
  ScrollView, // Thêm ScrollView
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getUserById, updateUserProfile} from './database';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {HomeStackParamList} from './types';

type ProfileScreenNavigationProp = NativeStackNavigationProp<
  HomeStackParamList,
  'Profile'
>;

const ProfileScreen = () => {
  const [userId, setUserId] = useState<number | null>(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const navigation = useNavigation<ProfileScreenNavigationProp>();

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    const stored = await AsyncStorage.getItem('loggedInUser');
    if (!stored) return;

    const user = JSON.parse(stored);
    setUserId(user.id);

    const dbUser = await getUserById(user.id);
    if (dbUser) {
      setUsername(dbUser.username);
      setPassword(dbUser.password);
    }
  };

  const handleUpdate = async () => {
    if (!userId) return;

    if (!username.trim() || !password.trim()) {
      Alert.alert('Lỗi', 'Không được bỏ trống!');
      return;
    }

    await updateUserProfile(userId, username, password);

    await AsyncStorage.setItem(
      'loggedInUser',
      JSON.stringify({id: userId, username}),
    );

    Alert.alert('✔ Thành công', 'Cập nhật thông tin thành công!');
  };

  // console.log('Render nút Xem lịch sử mua hàng');

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{paddingBottom: 40}}>
      <Text style={styles.title}>👤 THÔNG TIN CÁ NHÂN</Text>

      {/* Username */}
      <Text style={styles.label}>Tên đăng nhập</Text>
      <TextInput
        style={styles.input}
        value={username}
        onChangeText={setUsername}
      />

      {/* Password */}
      <Text style={styles.label}>Mật khẩu</Text>
      <View style={styles.passwordRow}>
        <TextInput
          style={[styles.input, {flex: 1}]}
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
        />
        <TouchableOpacity
          onPress={() => setShowPassword(!showPassword)}
          style={styles.eyeBtn}>
          <Text style={styles.eyeIcon}>{showPassword ? '👁️' : '🙈'}</Text>
        </TouchableOpacity>
      </View>

      {/* Save button */}
      <TouchableOpacity style={styles.btn} onPress={handleUpdate}>
        <Text style={styles.btnText}>Lưu thay đổi</Text>
      </TouchableOpacity>

      {/* History button */}
      <TouchableOpacity
        style={styles.historyBtn}
        onPress={() => navigation.navigate('History')}>
        <Text style={styles.historyText}>📦 Xem lịch sử mua hàng</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {flex: 1, padding: 20, backgroundColor: '#fff'},
  title: {fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#333'},
  label: {marginTop: 10, fontSize: 14, fontWeight: 'bold', color: '#444'},
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    marginVertical: 10,
    fontSize: 16,
  },
  passwordRow: {flexDirection: 'row', alignItems: 'center'},
  eyeBtn: {padding: 10, marginLeft: 8},
  eyeIcon: {fontSize: 20},
  btn: {
    backgroundColor: '#6200ea',
    padding: 15,
    marginTop: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  btnText: {color: '#fff', fontWeight: 'bold'},
  historyBtn: {
    marginTop: 20,
    padding: 12,
    borderWidth: 1,
    borderRadius: 10,
    alignItems: 'center',
  },
  historyText: {fontWeight: 'bold'},
});
