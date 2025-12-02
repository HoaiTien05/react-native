import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {BottomTabParamList} from './AppTabs';
import {getUserByCredentials} from './database';

const LoginSqlite = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const navigation =
    useNavigation<NativeStackNavigationProp<BottomTabParamList>>();

  const route = useRoute();
  const prefilledUsername = route.params?.username; // nhận username từ signup

  useEffect(() => {
    if (prefilledUsername) setUsername(prefilledUsername);
  }, [prefilledUsername]);

  const handleLogin = async () => {
    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();

    if (!trimmedUsername || !trimmedPassword) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin!');
      return;
    }

    try {
      const user = await getUserByCredentials(trimmedUsername, trimmedPassword);

      if (user) {
        // Lưu thông tin user vào AsyncStorage
        await AsyncStorage.setItem(
          'loggedInUser',
          JSON.stringify({
            id: user.id,
            username: user.username,
            role: user.role,
          }),
        );

        Alert.alert('Thành công', 'Đăng nhập thành công!', [
          {
            text: 'OK',
            onPress: () => {
              if (user.role === 'admin') {
                // Reset navigation tới Tab HomeTab và mở AdminDashboard trong Stack
                navigation.reset({
                  index: 0,
                  routes: [
                    {
                      name: 'HomeTab',
                      state: {
                        routes: [{name: 'AdminDashboard'}],
                      },
                    },
                  ],
                });
              } else {
                // Reset navigation tới HomeTab
                navigation.reset({
                  index: 0,
                  routes: [{name: 'HomeTab'}],
                });
              }
            },
          },
        ]);
      } else {
        Alert.alert('Lỗi', 'Sai tên đăng nhập hoặc mật khẩu!');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Lỗi', 'Có lỗi xảy ra khi đăng nhập');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Đăng Nhập</Text>

      <TextInput
        placeholder="Tên đăng nhập"
        style={styles.input}
        onChangeText={setUsername}
        value={username}
      />

      <TextInput
        placeholder="Mật khẩu"
        style={styles.input}
        secureTextEntry
        onChangeText={setPassword}
        value={password}
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Đăng Nhập</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('SignupSqlite')}>
        <Text style={styles.switchText}>Chưa có tài khoản? Đăng ký ngay</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {fontSize: 24, fontWeight: 'bold', marginBottom: 20},
  input: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
  },
  button: {
    width: '100%',
    backgroundColor: '#6200ea',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  buttonText: {color: 'white', fontWeight: 'bold'},
  switchText: {marginTop: 15, color: '#6200ea'},
});

export default LoginSqlite;
