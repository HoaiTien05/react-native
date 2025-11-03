import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";

export default function SimpleCalculator() {
  const [num1, setNum1] = useState("");
  const [num2, setNum2] = useState("");
  const [operation, setOperation] = useState(null);
  const [result, setResult] = useState("");

  const calculate = () => {
    // Kiểm tra nhập trống
    if (!num1 || !num2) {
      Alert.alert("Lỗi", "Vui lòng nhập đủ hai số!");
      return;
    }

    const a = parseFloat(num1);
    const b = parseFloat(num2);

    // Kiểm tra nhập chữ
    if (isNaN(a) || isNaN(b)) {
      Alert.alert("Lỗi", "Vui lòng nhập số hợp lệ!");
      return;
    }

    if (!operation) {
      Alert.alert("Lỗi", "Vui lòng chọn phép toán!");
      return;
    }

    // Thực hiện phép tính
    let res;
    if (operation === "add") res = a + b;
    else if (operation === "sub") res = a - b;
    else if (operation === "mul") res = a * b;
    else if (operation === "div") {
      if (b === 0) {
        Alert.alert("Lỗi", "Không thể chia cho 0!");
        return;
      }
      res = a / b;
    } else if (operation === "compare") {
      if (a > b) res = "Số thứ nhất lớn hơn số thứ hai";
      else if (a < b) res = "Số thứ nhất nhỏ hơn số thứ hai";
      else res = "Hai số bằng nhau";
      setResult(res);
      return;
    }

    // Làm tròn nếu là số thập phân
    setResult(res % 1 !== 0 ? res.toFixed(2) : res);
  };

  // Hàm tạo nút chọn phép toán
  const RadioButton = ({ label, value }) => (
    <TouchableOpacity
      onPress={() => setOperation(value)}
      style={{ flexDirection: "row", alignItems: "center", marginRight: 15 }}
    >
      <View style={{width: 18,height: 18,borderRadius: 9,borderWidth: 2,borderColor: "#333",marginRight: 5,alignItems: "center",justifyContent: "center",}}>
        {operation === value && (
          <View
            style={{
              width: 10,
              height: 10,
              borderRadius: 5,
              backgroundColor: "#007AFF",
            }}
          />
        )}
      </View>
      <Text>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 20 }}>
      <Text style={{ fontSize: 22, fontWeight: "bold", marginBottom: 20 }}>
          Máy tính đơn giản
      </Text>

      {/* Nhập số thứ nhất */}
      <TextInput
        placeholder="Nhập số thứ nhất"
        keyboardType="numeric"
        value={num1}
        onChangeText={setNum1}
        style={{
          borderWidth: 1,
          borderColor: "#aaa",
          borderRadius: 8,
          padding: 10,
          marginBottom: 10,
        }}
      />

      {/* Nhập số thứ hai */}
      <TextInput
        placeholder="Nhập số thứ hai"
        keyboardType="numeric"
        value={num2}
        onChangeText={setNum2}
        style={{
          borderWidth: 1,
          borderColor: "#aaa",
          borderRadius: 8,
          padding: 10,
          marginBottom: 15,
        }}
      />

      {/* Các phép tính */}
      <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
        <RadioButton label="Cộng (+)" value="add" />
        <RadioButton label="Trừ (-)" value="sub" />
        <RadioButton label="Nhân (×)" value="mul" />
        <RadioButton label="Chia (÷)" value="div" />
        <RadioButton label="So sánh (>)" value="compare" />
      </View>

      {/* Nút tính toán */}
      <TouchableOpacity
        onPress={calculate}
        style={{
          backgroundColor: "#007AFF",
          padding: 12,
          borderRadius: 8,
          alignItems: "center",
          marginTop: 20,
        }}
      >
        <Text style={{ color: "#fff", fontSize: 18, fontWeight: "bold" }}>
          Tính
        </Text>
      </TouchableOpacity>

      {/* Hiển thị kết quả */}
      {result !== "" && (
        <Text
          style={{
            fontSize: 20,
            color: "#007AFF",
            fontWeight: "bold",
            textAlign: "center",
            marginTop: 20,
          }}
        >
          Kết quả: {result}
        </Text>
      )}
    </View>
  );
}
