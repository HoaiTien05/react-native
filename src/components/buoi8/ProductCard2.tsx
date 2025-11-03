import { FlatList, TouchableOpacity, Image, StyleSheet, Text, View, ImageSourcePropType } from 'react-native';
import React from 'react';

type Product = {
  id: string;
  img: ImageSourcePropType;
  name: string;
  price: string;
};

const ProductCard = ({ img, name, price }: Product) => {
  return (
    <View style={styles.card}>
      <Image style={styles.image} source={img} />
      <View style={styles.cardBody}>
        <Text style={styles.title}>{name}</Text>
        <Text style={styles.price}>{price} ₫</Text>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Mua ngay</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const Sanpham23pnv1a = () => {
  const products: Product[] = Array.from({ length: 9 }, (_, i) => ({
    id: (i + 1).toString(),
    img: require('../../assets/img/anh1.jpg'),
    name: 'Giày thể thao',
    price: '20000',
  }));

  return (
    <FlatList
      data={products}
      keyExtractor={(item) => item.id}
      numColumns={3} // ✅ Hiển thị 3 cột
      contentContainerStyle={styles.container}
      renderItem={({ item }) => (
        <ProductCard img={item.img} name={item.name} price={item.price} id={item.id} />
      )}
      // showsVerticalScrollIndicator={false} // Ẩn thanh cuộn (tuỳ chọn)
    />
  );
};

export default Sanpham23pnv1a;

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    width: 110, // ✅ Giảm kích thước để vừa 3 sản phẩm mỗi hàng
    margin: 6,
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 100,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    resizeMode: 'cover',
  },
  cardBody: {
    padding: 8,
    alignItems: 'center',
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
    color: '#333',
    textAlign: 'center',
  },
  price: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#e63946',
    marginBottom: 8,
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 12,
  },
});
