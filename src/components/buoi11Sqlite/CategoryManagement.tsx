import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  Button,
  Alert,
  StyleSheet,
} from 'react-native';
import {Category, fetchCategories} from './database';
import SQLite from 'react-native-sqlite-storage';

import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';

// Khai báo kiểu navigation (bạn chỉnh theo stack của bạn)
type RootStackParamList = {
  CategoryManagement: undefined;
  ProductManagement: {categoryId?: number};
};

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'CategoryManagement'
>;

const CategoryManagement = () => {
  const navigation = useNavigation<NavigationProp>();

  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryName, setCategoryName] = useState('');
  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(
    null,
  );

  const loadCategories = async () => {
    const data = await fetchCategories();
    setCategories(data);
  };

  const resetForm = () => {
    setCategoryName('');
    setEditingCategoryId(null);
  };

  const handleAddOrUpdateCategory = async () => {
    if (!categoryName) return Alert.alert('Nhập tên danh mục');

    try {
      const db = await SQLite.openDatabase({
        name: 'myDatabase.db',
        location: 'default',
      });

      if (editingCategoryId !== null) {
        // Update category
        await db.executeSql('UPDATE categories SET name = ? WHERE id = ?', [
          categoryName,
          editingCategoryId,
        ]);
        Alert.alert('Thành công', 'Cập nhật danh mục thành công');
      } else {
        // Add new category
        await db.executeSql('INSERT INTO categories (name) VALUES (?)', [
          categoryName,
        ]);
        Alert.alert('Thành công', 'Thêm danh mục thành công');
      }

      resetForm();
      loadCategories();
    } catch (error) {
      console.error(error);
      Alert.alert('Lỗi', 'Có lỗi xảy ra');
    }
  };

  const handleDeleteCategory = async (id: number) => {
    Alert.alert('Xác nhận', 'Bạn có muốn xóa danh mục này?', [
      {text: 'Hủy', style: 'cancel'},
      {
        text: 'Xóa',
        onPress: async () => {
          const db = await SQLite.openDatabase({
            name: 'myDatabase.db',
            location: 'default',
          });
          await db.executeSql('DELETE FROM categories WHERE id = ?', [id]);
          loadCategories();
        },
      },
    ]);
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategoryId(category.id);
    setCategoryName(category.name);
  };

  useEffect(() => {
    loadCategories();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quản lý Danh mục</Text>

      <View style={styles.form}>
        <TextInput
          placeholder="Tên danh mục"
          value={categoryName}
          onChangeText={setCategoryName}
          style={styles.input}
        />
        <Button
          title={
            editingCategoryId !== null ? 'Cập nhật danh mục' : 'Thêm danh mục'
          }
          onPress={handleAddOrUpdateCategory}
        />
      </View>

      <FlatList
        data={categories}
        keyExtractor={item => item.id.toString()}
        renderItem={({item}) => (
          <View style={styles.item}>
            <Text>{item.name}</Text>
            <View style={{flexDirection: 'row', gap: 8}}>
              <Button title="Sửa" onPress={() => handleEditCategory(item)} />
              <Button
                title="Xóa"
                onPress={() => handleDeleteCategory(item.id)}
                color="red"
              />
              <Button
                title="Thêm sản phẩm"
                onPress={() =>
                  navigation.navigate('ProductManagement', {
                    categoryId: item.id,
                  })
                }
                color="#28a"
              />
            </View>
          </View>
        )}
      />
    </View>
  );
};

export default CategoryManagement;

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
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 8,
    borderBottomWidth: 1,
    borderColor: '#eee',
    alignItems: 'center',
  },
});
