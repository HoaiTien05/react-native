import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from './HomeScreen';
import DetailsScreen from './DetailsScreen';
import ProductDetailScreen from './ProductDetailScreen';
import {HomeStackParamList} from './types';
// import FashionScreen from './FashionScreen';
// import AccessoryScreen from './AccessoryScreen';
// import CategoriesScreen from './CategoriesScreen';
// import AboutScreen from './AboutScreen';
import AdminDashboard from './AdminDashboard';
import CategoryManagement from './CategoryManagement';
import UserManagement from './UserManagement';
// import AddUser from './admin/users/AddUser';
// import EditUser from './admin/users/EditUser';
import ProductManagement from './ProductManagement';
import CartScreen from './CartScreen';
import CheckoutScreen from './CheckoutScreen';
import OrderHistoryScreen from './OrderHistoryScreen';
import ProfileScreen from './ProfileScreen';
import OrderManagement from './OrderManagement';

const Stack = createNativeStackNavigator<HomeStackParamList>();

const HomeStackScreen = () => {
  return (
    // Màn hình đầu tiên (<Stack.Screen ... />) trong <Stack.Navigator> sẽ mặc định là màn hình được mở đầu tiên.
    <Stack.Navigator
      screenOptions={{headerShown: false}}
      initialRouteName="Home">
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Details" component={DetailsScreen} />
      <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
      <Stack.Screen name="Cart" component={CartScreen} />
      <Stack.Screen name="Checkout" component={CheckoutScreen} />
      <Stack.Screen name="History" component={OrderHistoryScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />

      {/* <Stack.Screen name="Categories" component={CategoriesScreen} />
      <Stack.Screen name="Fashion" component={FashionScreen} />
      <Stack.Screen name="Accessory" component={AccessoryScreen} />
      <Stack.Screen name="About" component={AboutScreen} /> */}
      <Stack.Screen name="AdminDashboard" component={AdminDashboard} />
      <Stack.Screen name="CategoryManagement" component={CategoryManagement} />
      <Stack.Screen name="UserManagement" component={UserManagement} />
      <Stack.Screen name="ProductManagement" component={ProductManagement} />
      <Stack.Screen name="OrderManagement" component={OrderManagement} />
      {/* <Stack.Screen name="AddUser" component={AddUser} />
      <Stack.Screen name="EditUser" component={EditUser} /> */}
    </Stack.Navigator>
  );
};

export default HomeStackScreen;
