import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  ScrollView,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {launchImageLibrary} from 'react-native-image-picker';

import {
  Product,
  Category,
  fetchProducts,
  fetchCategories,
  addProduct,
  updateProduct,
  deleteProduct,
} from './database';

import {NativeStackScreenProps} from '@react-navigation/native-stack';

// Khai báo kiểu param list
type RootStackParamList = {
  ProductManagement: {categoryId?: number};
};

type Props = NativeStackScreenProps<RootStackParamList, 'ProductManagement'>;

const ProductManagement = ({route}: Props) => {
  const initialCategoryId = route.params?.categoryId;

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [categoryId, setCategoryId] = useState<number | undefined>(
    initialCategoryId,
  );
  const [img, setImg] = useState<string>('');
  const [editingId, setEditingId] = useState<number | null>(null);

  const loadData = async () => {
    const productData = await fetchProducts();
    const categoryData = await fetchCategories();

    setProducts(productData.reverse()); // hiển thị mới nhất lên đầu
    setCategories(categoryData);
  };

  useEffect(() => {
    loadData();
  }, []);

  // Cập nhật categoryId nếu param thay đổi (trường hợp bạn chuyển từ CategoryManagement)
  useEffect(() => {
    if (initialCategoryId) {
      setCategoryId(initialCategoryId);
    }
  }, [initialCategoryId]);

  const handleAddOrUpdate = async () => {
    if (!name || !price || !categoryId) {
      Alert.alert('❗ Lỗi', 'Vui lòng nhập đầy đủ thông tin');
      return;
    }

    const productData = {
      name,
      price: parseFloat(price),
      img: img || 'hinh1.jpg',
      categoryId,
    };

    try {
      if (editingId !== null) {
        await updateProduct({id: editingId, ...productData});
        setEditingId(null);
      } else {
        await addProduct(productData);
      }

      setName('');
      setPrice('');
      setCategoryId(undefined);
      setImg('');
      loadData();
    } catch (error) {
      console.error(error);
      Alert.alert('Lỗi', 'Có lỗi xảy ra khi thêm/cập nhật sản phẩm');
    }
  };

  const handleEdit = (product: Product) => {
    setName(product.name);
    setPrice(product.price.toString());
    setCategoryId(product.categoryId);
    setImg(product.img);
    setEditingId(product.id);
  };

  const handleDelete = (id: number) => {
    Alert.alert('Xác nhận xóa', 'Bạn có chắc chắn muốn xóa sản phẩm này?', [
      {text: 'Hủy', style: 'cancel'},
      {
        text: 'Xóa',
        style: 'destructive',
        onPress: async () => {
          await deleteProduct(id);
          loadData();
        },
      },
    ]);
  };

  const handlePickImage = () => {
    launchImageLibrary({mediaType: 'photo', includeBase64: false}, response => {
      if (response.didCancel) return;
      if (response.errorCode) {
        console.error('ImagePicker Error: ', response.errorMessage);
      } else if (response.assets && response.assets[0]) {
        setImg(response.assets[0].uri || '');
      }
    });
  };

  const getImageSource = (img: string) => {
    if (img.startsWith('file://')) return {uri: img};
    switch (img) {
      case 'hinh1.jpg':
        return require('../../assets/img/anh1.jpg');
      case 'hinh2.jpg':
        return require('../../assets/img/anh2.jpg');
      default:
        return require('../../assets/img/anh3.jpg');
    }
  };

  const renderItem = ({item}: {item: Product}) => (
    <View style={styles.item}>
      <Image source={getImageSource(item.img)} style={styles.itemImage} />
      <View style={{flex: 1, marginLeft: 10}}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text>{item.price.toLocaleString()} VND</Text>
        <Text>
          Danh mục: {categories.find(c => c.id === item.categoryId)?.name}
        </Text>
        <View style={styles.iconRow}>
          <TouchableOpacity onPress={() => handleEdit(item)}>
            <Text style={styles.icon}>✏️</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleDelete(item.id)}>
            <Text style={styles.icon}>❌</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Quản lý sản phẩm</Text>

      <TextInput
        style={styles.input}
        placeholder="Tên sản phẩm"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Giá sản phẩm"
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
      />

      <Picker
        selectedValue={categoryId}
        onValueChange={value => setCategoryId(value)}
        style={styles.picker}>
        <Picker.Item label="-- Chọn danh mục --" value={undefined} />
        {categories.map(cat => (
          <Picker.Item key={cat.id} label={cat.name} value={cat.id} />
        ))}
      </Picker>

      <TouchableOpacity style={styles.button} onPress={handlePickImage}>
        <Text style={styles.buttonText}>
          {img ? 'Chọn lại hình ảnh' : 'Chọn hình ảnh'}
        </Text>
      </TouchableOpacity>
      {img ? (
        <Image source={getImageSource(img)} style={styles.selectedImage} />
      ) : null}

      <TouchableOpacity style={styles.button} onPress={handleAddOrUpdate}>
        <Text style={styles.buttonText}>
          {editingId ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm'}
        </Text>
      </TouchableOpacity>

      <FlatList
        data={products}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{paddingBottom: 100}}
        ListEmptyComponent={
          <Text style={{textAlign: 'center'}}>Không có sản phẩm nào</Text>
        }
      />
    </ScrollView>
  );
};

export default ProductManagement;

const styles = StyleSheet.create({
  container: {padding: 16, paddingBottom: 100},
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 6,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  picker: {marginBottom: 10, backgroundColor: '#eee'},
  button: {
    backgroundColor: '#28a',
    padding: 10,
    borderRadius: 6,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {color: '#fff', fontWeight: 'bold'},
  item: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 12,
    overflow: 'hidden',
  },
  itemImage: {width: 80, height: 80},
  selectedImage: {width: 100, height: 100, marginBottom: 10},
  productName: {fontWeight: 'bold', fontSize: 16},
  iconRow: {flexDirection: 'row', marginTop: 8},
  icon: {fontSize: 20, marginRight: 10},
});
