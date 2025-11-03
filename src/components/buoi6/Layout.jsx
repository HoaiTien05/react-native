import { StyleSheet, View } from 'react-native';
import React from 'react';
import ProductCard from './ProductCard';

const Layout = () => {
  const products = [
    { id: 1, name: 'Giày thể thao', price: '250.000₫', image: require('../../assets/img/anh1.jpg') },
    { id: 2, name: 'Áo thun', price: '150.000₫', image: require('../../assets/img/anh2.jpg') },
    { id: 3, name: 'Nón lưỡi trai', price: '120.000₫', image: require('../../assets/img/anh3.jpg') },
    { id: 4, name: 'Túi xách', price: '300.000₫', image: require('../../assets/img/anh4.jpg') },
    { id: 5, name: 'Đồng hồ', price: '500.000₫', image: require('../../assets/img/anh5.jpg') },
    { id: 6, name: 'Tai nghe', price: '220.000₫', image: require('../../assets/img/anh6.jpg') },
    { id: 7, name: 'Áo khoác', price: '450.000₫', image: require('../../assets/img/anh7.jpg') },
    { id: 8, name: 'Dép quai ngang', price: '180.000₫', image: require('../../assets/img/anh8.png') },
    { id: 9, name: 'Ví da', price: '350.000₫', image: require('../../assets/img/anh9.jpg') },
  ];

  const rows = [];
  for (let i = 0; i < products.length; i += 3) {
    rows.push(products.slice(i, i + 3));
  }

  return (
    <View style={styles.container}>
      {rows.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </View>
      ))}
    </View>
  );
};

export default Layout;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 6,
    paddingTop: 8,
    backgroundColor: '#f8f8f8',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
});

