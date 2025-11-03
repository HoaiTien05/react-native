import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';

export default function BMICalculator() {
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [bmi, setBmi] = useState(null);
  const [message, setMessage] = useState('');
  const [bgColor, setBgColor] = useState('#fff');
  const [idealWeight, setIdealWeight] = useState('');

  const calculateBMI = () => {
    let h = height.replace(/[^\d.]/g, '');
    let w = weight.replace(/[^\d.]/g, '');

    // Nếu nhập "1m80" thì chuyển thành 180 cm
    if (height.includes('m') && h.length <= 3) {
      const parts = height.split('m');
      const meters = parseFloat(parts[0]);
      const centimeters = parseFloat(parts[1]) || 0;
      h = meters * 100 + centimeters;
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

    const { category, bgColorCode } = getBMICategory(rounded);
    setMessage(category);
    setBgColor(bgColorCode);

    // Gợi ý cân nặng lý tưởng (BMI = 22)
    const ideal = (22 * (H / 100) * (H / 100)).toFixed(1);
    setIdealWeight(`💡 Cân nặng lý tưởng khoảng: ${ideal} kg`);
  };

  const getBMICategory = (bmi) => {
    const b = parseFloat(bmi);
    if (b < 18.5)
      return {
        category: '⚠️ Gầy (Underweight) - Hãy ăn uống đầy đủ hơn!',
        bgColorCode: '#ADD8E6', // Xanh dương nhạt
      };
    if (b >= 18.5 && b < 25)
      return {
        category: '✅ Bình thường (Normal weight) - Duy trì lối sống lành mạnh!',
        bgColorCode: '#90EE90', // Xanh lá nhạt
      };
    if (b >= 25 && b < 30)
      return {
        category: '⚠️ Thừa cân (Overweight) - Cần tập luyện và ăn uống khoa học!',
        bgColorCode: '#FFD580', // Cam nhạt
      };
    return {
      category: '🚨 Béo phì (Obese) - Nên tham khảo ý kiến bác sĩ!',
      bgColorCode: '#FF7F7F', // Đỏ nhạt
    };
  };

  const reset = () => {
    setHeight('');
    setWeight('');
    setBmi(null);
    setMessage('');
    setBgColor('#fff');
    setIdealWeight('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}> BMI Calculator</Text>

      <TextInput
        style={styles.input}
        placeholder="Nhập chiều cao (cm hoặc m)"
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
        <Text style={styles.buttonText}>Calculate BMI</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.resetButton} onPress={reset}>
        <Text style={styles.buttonText}>Reset</Text>
      </TouchableOpacity>

      {bmi && (
        <View style={[styles.resultBox, { backgroundColor: bgColor }]}>
          <Text style={styles.resultText}>📊 Chỉ số BMI của bạn: {bmi}</Text>
          <Text style={styles.message}>{message}</Text>
          <Text style={styles.ideal}>{idealWeight}</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#f2f2f2',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 25,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#28a745',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  resetButton: {
    backgroundColor: '#dc3545',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  resultBox: {
    marginTop: 25,
    padding: 20,
    borderRadius: 10,
    elevation: 3,
  },
  resultText: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    color: '#000',
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10,
    fontWeight: '500',
    color: '#000',
  },
  ideal: {
    fontSize: 15,
    textAlign: 'center',
    marginTop: 8,
    color: '#333',
    fontStyle: 'italic',
  },
});
