import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  Button,
  Alert,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {Picker} from '@react-native-picker/picker'; // npm i @react-native-picker/picker
import {User, fetchUsers, addUser, updateUser, deleteUser} from './database';

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<string | undefined>(undefined);
  const [editingUserId, setEditingUserId] = useState<number | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const loadUsers = async () => {
    const data = await fetchUsers();
    setUsers(data);
  };

  const resetForm = () => {
    setUsername('');
    setPassword('');
    setRole(undefined);
    setEditingUserId(null);
    setShowPassword(false);
  };

  const handleAddOrUpdateUser = async () => {
    if (!username || !password) return Alert.alert('Nhập đủ thông tin');

    const finalRole = role || 'user'; // default user nếu chưa chọn

    if (editingUserId !== null) {
      await updateUser({
        id: editingUserId,
        username,
        password,
        role: finalRole,
      });
      Alert.alert('Thành công', 'Cập nhật user thành công');
    } else {
      const success = await addUser(username, password, finalRole);
      if (!success) return;
    }

    resetForm();
    loadUsers();
  };

  const handleDeleteUser = (id: number) => {
    Alert.alert('Xác nhận', 'Bạn có muốn xóa người dùng này?', [
      {text: 'Hủy', style: 'cancel'},
      {
        text: 'Xóa',
        onPress: async () => {
          await deleteUser(id);
          loadUsers();
        },
      },
    ]);
  };

  const handleEditUser = (user: User) => {
    setEditingUserId(user.id);
    setUsername(user.username);
    setPassword(user.password);
    setRole(user.role);
    setShowPassword(false);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quản lý User</Text>

      <View style={styles.form}>
        <TextInput
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
          style={styles.input}
        />

        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            style={styles.inputWithToggle}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.toggleButton}>
            <Text style={{color: 'blue'}}>
              {showPassword ? 'Ẩn' : 'Hiển thị'}
            </Text>
          </TouchableOpacity>
        </View>

        <Picker
          selectedValue={role}
          onValueChange={value => setRole(value)}
          style={{marginBottom: 8}}>
          <Picker.Item label="Chọn vai trò " value={undefined} />
          <Picker.Item label="User" value="user" />
          <Picker.Item label="Admin" value="admin" />
        </Picker>

        <Button
          title={editingUserId !== null ? 'Cập nhật User' : 'Thêm User'}
          onPress={handleAddOrUpdateUser}
        />
      </View>

      <FlatList
        data={users}
        keyExtractor={item => item.id.toString()}
        renderItem={({item}) => (
          <View style={styles.userItem}>
            <Text>
              {item.username} - {item.role}
            </Text>
            <View style={{flexDirection: 'row', gap: 8}}>
              <Button title="Sửa" onPress={() => handleEditUser(item)} />
              <Button
                title="Xóa"
                onPress={() => handleDeleteUser(item.id)}
                color="red"
              />
            </View>
          </View>
        )}
      />
    </View>
  );
};

export default UserManagement;

const styles = StyleSheet.create({
  container: {flex: 1, padding: 16},
  title: {fontSize: 24, fontWeight: 'bold', marginBottom: 16},
  form: {marginBottom: 20},
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 8,
    padding: 8,
    borderRadius: 4,
  },
  inputContainer: {
    position: 'relative',
    marginBottom: 8,
  },
  inputWithToggle: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    paddingRight: 60, // không che text
    borderRadius: 4,
  },
  toggleButton: {
    position: 'absolute',
    right: 10,
    top: '50%',
    transform: [{translateY: -10}],
  },
  userItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 8,
    borderBottomWidth: 1,
    borderColor: '#eee',
    alignItems: 'center',
  },
});
