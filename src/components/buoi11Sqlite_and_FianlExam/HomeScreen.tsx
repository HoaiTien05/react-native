import React, {useEffect, useState} from 'react';
import {
  FlatList,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from './Header';

import {
  Product,
  Category,
  initDatabase,
  fetchProducts,
  fetchCategories,
  fetchProductsByCategory,
  searchProductsByNameOrCategory,
  filterProductsByPrice,
  addToCart,
} from './database';

export type HomeStackParamList = {
  Home: undefined;
  ProductDetail: {product: Product};
  Categories: undefined;
  AdminDashboard: undefined;
  Checkout: undefined;
};

type Props = NativeStackScreenProps<HomeStackParamList, 'Home'>;

// Map ảnh từ tên file
const getImageSource = (img: string) => {
  if (img.startsWith('file://')) return {uri: img};

  switch (img) {
    case 'hinh1.jpg':
      return require('../../assets/img/anh1.jpg');
    default:
      return require('../../assets/img/anh2.jpg');
  }
};

const HomeScreen = ({navigation}: Props) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [keyword, setKeyword] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    initDatabase(async () => {
      await loadProducts();
      await loadCategories();
      const storedUserId = await AsyncStorage.getItem('loggedInUser');
      if (storedUserId) {
        const user = JSON.parse(storedUserId);
        setUserId(user.id);
      }
    });
  }, []);

  // Load tất cả sản phẩm
  const loadProducts = async () => {
    const data = await fetchProducts();
    setProducts(data.reverse());
    setSelectedCategory(null);
  };

  // Load categories
  const loadCategories = async () => {
    const data = await fetchCategories();
    setCategories(data);
  };

  // SEARCH
  const handleSearchBtn = async () => {
    if (keyword.trim() === '') {
      loadProducts();
    } else {
      const results = await searchProductsByNameOrCategory(keyword);
      setProducts(results);
    }
  };

  // FILTER CATEGORY
  const handleCategory = async (id: number) => {
    setSelectedCategory(id);
    const results = await fetchProductsByCategory(id);
    setProducts(results);
  };

  // FILTER PRICE
  const handleFilterPrice = async () => {
    const min = parseInt(minPrice);
    const max = parseInt(maxPrice);

    if (isNaN(min) || isNaN(max)) {
      Alert.alert('Vui lòng nhập khoảng giá hợp lệ');
      return;
    }

    const results = await filterProductsByPrice(min, max);
    setProducts(results);

    setMinPrice('');
    setMaxPrice('');
  };

  // ADD TO CART
  const handleAddToCart = async (product: Product, showAlert = true) => {
    if (!userId) {
      Alert.alert('Bạn chưa đăng nhập!');
      return;
    }
    await addToCart(userId, product.id);
    if (showAlert) {
      Alert.alert('Thành công ✅ ', 'Đã thêm sản phẩm vào giỏ hàng', [
        {
          text: 'OK',
          onPress: () => navigation.navigate('Cart'),
        },
      ]);
    }
  };

  const renderItem = ({item}: {item: Product}) => (
    <View style={styles.productCard}>
      <TouchableOpacity
        onPress={() => navigation.navigate('ProductDetail', {product: item})}>
        <Image source={getImageSource(item.img)} style={styles.image} />
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.price}>{item.price.toLocaleString()} đ</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.btn, {backgroundColor: '#4CAF50', marginTop: 5}]}
        onPress={async () => {
          await handleAddToCart(item, false);
          navigation.navigate('Checkout');
        }}>
        <Text style={styles.btnText}>Mua ngay</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.btn, {backgroundColor: '#E91E63', marginTop: 5}]}
        onPress={async () => await handleAddToCart(item, true)}>
        <Text style={styles.btnText}>Thêm vào giỏ hàng</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <ScrollView contentContainerStyle={{paddingBottom: 80}}>
      <Image
        source={require('../../assets/img/banner.jpg')}
        style={styles.banner}
      />

      <Header />

      {/* SEARCH */}
      <View style={styles.searchRow}>
        <TextInput
          placeholder="Nhập tên sản phẩm hoặc danh mục..."
          value={keyword}
          onChangeText={setKeyword}
          style={styles.searchInput}
        />
        <TouchableOpacity style={styles.searchBtn} onPress={handleSearchBtn}>
          <Text style={{color: '#fff'}}>Tìm</Text>
        </TouchableOpacity>
      </View>

      {/* CATEGORY FILTER */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{marginVertical: 10}}>
        <TouchableOpacity style={styles.catBtn} onPress={loadProducts}>
          <Text>Tất cả</Text>
        </TouchableOpacity>

        {categories.map(cat => (
          <TouchableOpacity
            key={cat.id}
            style={[
              styles.catBtn,
              selectedCategory === cat.id && {backgroundColor: '#E91E63'},
            ]}
            onPress={() => handleCategory(cat.id)}>
            <Text
              style={{color: selectedCategory === cat.id ? '#fff' : '#000'}}>
              {cat.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* PRICE FILTER */}
      <View style={styles.priceRow}>
        <TextInput
          placeholder="Giá từ"
          keyboardType="numeric"
          value={minPrice}
          onChangeText={setMinPrice}
          style={styles.priceInput}
        />
        <TextInput
          placeholder="Đến"
          keyboardType="numeric"
          value={maxPrice}
          onChangeText={setMaxPrice}
          style={styles.priceInput}
        />
        <TouchableOpacity style={styles.filterBtn} onPress={handleFilterPrice}>
          <Text style={{color: '#fff'}}>Lọc</Text>
        </TouchableOpacity>
      </View>

      {/* PRODUCT LIST */}
      <FlatList
        data={products}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        numColumns={2}
        ListEmptyComponent={
          <Text style={{textAlign: 'center', marginTop: 20}}>
            Không có sản phẩm
          </Text>
        }
        scrollEnabled={false}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  banner: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 10,
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 8,
  },
  searchBtn: {
    marginLeft: 8,
    backgroundColor: '#E91E63',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
  },
  catBtn: {
    padding: 10,
    marginHorizontal: 5,
    borderWidth: 1,
    borderRadius: 20,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  priceInput: {
    borderWidth: 1,
    width: '30%',
    borderRadius: 8,
    padding: 5,
  },
  filterBtn: {
    backgroundColor: '#E91E63',
    padding: 10,
    borderRadius: 8,
  },
  image: {
    width: 110,
    height: 80,
    resizeMode: 'cover',
  },
  productCard: {
    backgroundColor: '#fff',
    margin: 10,
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 5,
    flex: 1,
  },
  productName: {fontWeight: 'bold'},
  price: {color: '#E91E63'},
  btn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  btnText: {color: '#fff', fontWeight: 'bold', textAlign: 'center'},
});

export default HomeScreen;
