import React, { useRef, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

export default function LinearSolver() {
  const [a, setA] = useState('');
  const [b, setB] = useState('');
  const [result, setResult] = useState('');

  const aInputRef = useRef<TextInput>(null);
  const bInputRef = useRef<TextInput>(null);

  const solveEquation = () => {
    const numberA = parseFloat(a);
    const numberB = parseFloat(b);

    const isAInvalid = isNaN(numberA);
    const isBInvalid = isNaN(numberB);
    const errors: string[] = [];

    if (isAInvalid) errors.push('Giá trị "a" phải là một số.');
    if (isBInvalid) errors.push('Giá trị "b" phải là một số.');

    if (errors.length > 0) {
      setResult(errors.join('\n'));

      if (isAInvalid) {
        setA('');
        setTimeout(() => aInputRef.current?.focus(), 0);
      }
      if (isBInvalid) {
        setB('');
        setTimeout(() => bInputRef.current?.focus(), 0);
      }
      return;
    }

    if (numberA === 0) {
      setResult(numberB === 0 ? 'Phương trình có vô số nghiệm.' : 'Phương trình vô nghiệm.');
    } else {
      const x = (-numberB / numberA).toFixed(2);
      setResult(`Nghiệm: x = ${x}`);
    }
  };

  const clearInputs = () => {
    setA('');
    setB('');
    setResult('');
    setTimeout(() => aInputRef.current?.focus(), 0);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Giải phương trình bậc nhất: ax + b = 0</Text>

      <TextInput
        ref={aInputRef}
        style={styles.input}
        placeholder="Nhập hệ số a"
        keyboardType="numeric"
        value={a}
        onChangeText={setA}
      />

      <TextInput
        ref={bInputRef}
        style={styles.input}
        placeholder="Nhập hệ số b"
        keyboardType="numeric"
        value={b}
        onChangeText={setB}
      />

      <View style={styles.buttonRow}>
        <View style={styles.buttonWrapper}>
          <Button title="Giải" onPress={solveEquation} />
        </View>
        <View style={styles.buttonWrapper}>
          <Button title="Xóa" onPress={clearInputs} color="gray" />
        </View>
      </View>

      <Text style={styles.result}>{result}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    width: '80%',
    marginBottom: 10,
    borderRadius: 5,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginTop: 10,
  },
  buttonWrapper: {
    flex: 1,
    marginHorizontal: 5,
  },
  result: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
