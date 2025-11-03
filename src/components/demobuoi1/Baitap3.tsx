import React, { useState } from "react";
import { View, Text, Button, StyleSheet, Alert } from "react-native";

const Baitap3 = () => {
  const [name, setName] = useState("Tien");
  const [age, setAge] = useState(20);

  const handlePress = () => {
    Alert.alert(
      "Thông báo",
      `Hello ${name}, ${age} tuổi`,
      [
        { text: "OK", onPress: () => console.log("OK Pressed") }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Hello {name}</Text>
      <Button title="Nhấn vào đây" onPress={handlePress} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  text: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
  },
});

export default Baitap3;
