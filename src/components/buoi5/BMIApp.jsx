import React, { useState } from 'react';
import { SafeAreaView,View,Text,TextInput,TouchableOpacity,StyleSheet,Alert} from 'react-native';

export default function BMIApp() {
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [bmi, setBmi] = useState(null);
  const [message, setMessage] = useState('');

  const calculateBMI = () => {
  let h = height.replace(/[^\d.]/g, ''); // lấy ra số thôi
  let w = weight.replace(/[^\d.]/g, '');

  // Nếu người dùng nhập kiểu "1m80" thì chuyển thành 180
  if (height.includes('m') && h.length <= 3) {
    const parts = height.split('m');
    const meters = parseFloat(parts[0]);
    const centimeters = parseFloat(parts[1]) || 0;
    h = meters * 100 + centimeters; // ví dụ: 1m80 -> 180
  }

  const H = parseFloat(h);
  const W = parseFloat(w);

  if (isNaN(H) || isNaN(W) || H <= 0 || W <= 0) {
    Alert.alert('Lỗi', 'Vui lòng nhập chiều cao và cân nặng hợp lệ!');
    return;
  }

  const bmiValue = W / ((H / 100) * (H / 100));
  const rounded = bmiValue.toFixed(1);
  setBmi(rounded);
  setMessage(getBMICategory(rounded));
};


  const getBMICategory = (bmi) => {
    const b = parseFloat(bmi);
    if (b < 18.5) return 'Thiếu cân - Hãy ăn uống đầy đủ hơn!';
    if (b >= 18.5 && b < 25) return 'Bình thường - Duy trì lối sống lành mạnh!';
    if (b >= 25 && b < 30) return 'Thừa cân - Cần tập luyện và ăn uống khoa học!';
    return 'Béo phì - Nên tham khảo ý kiến bác sĩ!';
  };

  const reset = () => {
    setHeight('');
    setWeight('');
    setBmi(null);
    setMessage('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Tính Chỉ Số BMI</Text>

      <TextInput
        style={styles.input}
        placeholder="Nhập chiều cao (cm)"
        keyboardType="numeric"
        value={height}
        onChangeText={setHeight}
      />

      <TextInput
        style={styles.input}
        placeholder="Nhập cân nặng (kg)"
        keyboardType="numeric"
        value={weight}
        onChangeText={setWeight}
      />

      <TouchableOpacity style={styles.button} onPress={calculateBMI}>
        <Text style={styles.buttonText}>Tính BMI</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.resetButton} onPress={reset}>
        <Text style={styles.buttonText}>Xóa</Text>
      </TouchableOpacity>

      {bmi && (
        <View style={styles.resultBox}>
          <Text style={styles.resultText}>Chỉ số BMI của bạn: {bmi}</Text>
          <Text style={styles.message}>{message}</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f2f2f2',
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#28a745',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  resetButton: {
    backgroundColor: '#dc3545',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
  resultBox: {
    marginTop: 20,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
  },
  resultText: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10,
  },
});
