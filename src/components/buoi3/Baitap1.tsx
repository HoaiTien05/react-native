import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";

// Định nghĩa kiểu cho props của component Child
type ChildProps = {
  name: string;
  age: string;
  onUpdate: (newName: string, newAge: string) => void;
};

// Component Con
const Child: React.FC<ChildProps> = ({ name, age, onUpdate }) => {
  const [newName, setNewName] = useState("");
  const [newAge, setNewAge] = useState("");

  return (
    <View style={styles.childBox}>
      <Text style={styles.title}>Cập nhật thông tin của bạn</Text>
      <Text>Thông tin hiện tại: {name} - {age}</Text>

      <TextInput
        style={styles.input}
        placeholder="Tên mới"
        value={newName}
        onChangeText={setNewName}
      />
      <TextInput
        style={styles.input}
        placeholder="Tuổi mới"
        value={newAge}
        onChangeText={setNewAge}
        keyboardType="numeric"
      />

      <Button
        title="Gửi lên Cha"
        onPress={() => {
          if (newName && newAge) {
            onUpdate(newName, newAge);
            setNewName("");
            setNewAge("");
          }
        }}
      />
    </View>
  );
};

// Component Cha
const Parent: React.FC = () => {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Điền thông tin của bạn</Text>

      <TextInput
        style={styles.input}
        placeholder="Nhập tên"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Nhập tuổi"
        value={age}
        onChangeText={setAge}
        keyboardType="numeric"
      />

      <Text>Thông tin của bạn: {name} - {age}</Text>

      <Child
        name={name}
        age={age}
        onUpdate={(newName, newAge) => {
          setName(newName);
          setAge(newAge);
        }}
      />
    </View>
  );
};

export default Parent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  childBox: {
    marginTop: 20,
    padding: 15,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "gray",
    padding: 8,
    borderRadius: 5,
    marginVertical: 5,
  },
});
