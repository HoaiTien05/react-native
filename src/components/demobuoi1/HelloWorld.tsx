import React from "react";
import { View,Text,StyleSheet } from "react-native";

const HelloWorld = () =>{
    return (
        <View style={styles.container}>
            <Text style = {{fontSize: 30, fontWeight:'bold',color: 'orange' }}> Hello world Bhờ Nướch Thị Hoài Tiên</Text>
        </View>
    )
}
const styles = StyleSheet.create({
  container: {
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center", 
    backgroundColor: "#fff", 
  },
});

export default HelloWorld;