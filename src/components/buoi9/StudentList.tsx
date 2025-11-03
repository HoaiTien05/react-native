import React, { useState, useMemo } from "react";
import {
  StyleSheet,
  TextInput,
  Text,
  View,
  Button,
  FlatList,
  TouchableOpacity,
  Alert,
  Keyboard,
} from "react-native";

type Student = { id: number; name: string; age: number; grade: number; };

const StudentList = () => {
  const [studentList, setStudentList] = useState<Student[]>([
    { id: 1, name: "Hoài Tiên", age: 20, grade: 7.5 },
    { id: 2, name: "Đông", age: 17, grade: 7.5 },
    { id: 3, name: "Hằng", age: 18, grade: 8.2 },
    { id: 4, name: "Chi", age: 19, grade: 9.1 },
    { id: 5, name: "Băng", age: 19, grade: 9.0 },
  ]);

  // form states
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [grade, setGrade] = useState("");
  const [editId, setEditId] = useState<number | null>(null);

  // controls
  const [searchText, setSearchText] = useState("");
  const [showOnly8Plus, setShowOnly8Plus] = useState(false);

  // helper: add or update
  const handleAddOrUpdate = () => {
    if (!name.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập tên");
      return;
    }
    const ageNum = Number(age);
    const gradeNum = Number(grade);
    if (Number.isNaN(ageNum) || ageNum <= 0) {
      Alert.alert("Lỗi", "Tuổi không hợp lệ");
      return;
    }
    if (Number.isNaN(gradeNum) || gradeNum < 0 || gradeNum > 10) {
      Alert.alert("Lỗi", "Điểm phải trong 0 - 10");
      return;
    }

    if (editId !== null) {
      setStudentList((prev) => prev.map((s) => (s.id === editId ? { ...s, name: name.trim(), age: ageNum, grade: gradeNum } : s)));
      setEditId(null);
    } else {
      const maxId = studentList.reduce((m, s) => (s.id > m ? s.id : m), 0);
      const newStudent: Student = { id: maxId + 1, name: name.trim(), age: ageNum, grade: gradeNum };
      setStudentList((prev) => [...prev, newStudent]);
    }

    setName("");
    setAge("");
    setGrade("");
    Keyboard.dismiss();
  };

  const handleEdit = (student: Student) => {
    setEditId(student.id);
    setName(student.name);
    setAge(String(student.age));
    setGrade(String(student.grade));
  };

  const handleDelete = (id: number) => {
    const st = studentList.find((s) => s.id === id);
    Alert.alert("Xóa học sinh", `Bạn có chắc muốn xóa ${st?.name ?? "học sinh này"}?`, [
      { text: "Hủy", style: "cancel" },
      { text: "Xóa", style: "destructive", onPress: () => setStudentList((prev) => prev.filter((s) => s.id !== id)) },
    ]);
  };

  const sortByGradeDesc = () => {
    setStudentList((prev) => [...prev].sort((a, b) => b.grade - a.grade));
  };

  // compute filtered & searched list (useMemo for small optimization)
  const displayList = useMemo(() => {
    const searched = studentList.filter((s) =>
      s.name.toLowerCase().includes(searchText.trim().toLowerCase())
    );
    const filtered = showOnly8Plus ? searched.filter((s) => s.grade >= 8) : searched;
    return filtered;
  }, [studentList, searchText, showOnly8Plus]);

  // count >8 (from full list)
  const countGreater8 = studentList.filter((s) => s.grade > 8).length;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Quản lý Danh Sách Học Sinh</Text>

      {/* Search */}
      <TextInput
        style={styles.input}
        placeholder="Tìm kiếm học sinh theo tên..."
        value={searchText}
        onChangeText={setSearchText}
      />

      {/* Form */}
      <TextInput style={styles.input} placeholder="Nhập tên học sinh" value={name} onChangeText={setName} />
      <TextInput style={styles.input} placeholder="Nhập tuổi" keyboardType="numeric" value={age} onChangeText={setAge} />
      <TextInput style={styles.input} placeholder="Nhập điểm" keyboardType="numeric" value={grade} onChangeText={setGrade} />

      {/* Controls row */}
      <View style={styles.controlsRow}>
        <View style={{ flex: 1, marginRight: 6 }}>
          <Button title={editId ? "Cập nhật" : "Thêm sinh viên"} onPress={handleAddOrUpdate} />
        </View>
        <View style={{ width: 140, marginRight: 6 }}>
          <Button title="Sắp xếp theo điểm" onPress={sortByGradeDesc} />
        </View>
        <View style={{ width: 140 }}>
          <Button title={showOnly8Plus ? "Hiện tất cả" : "Chỉ điểm >= 8"} onPress={() => setShowOnly8Plus((p) => !p)} />
        </View>
      </View>

      {/* List */}
      <FlatList
        data={displayList}
        keyExtractor={(item) => item.id.toString()}
        style={{ marginTop: 12 }}
        ListEmptyComponent={<Text>Không có học sinh (theo bộ lọc/tìm kiếm hiện tại)</Text>}
        renderItem={({ item, index }) => (
          <View style={styles.itemRow}>
            <Text style={styles.stt}>{index + 1}.</Text>
            <View style={styles.itemInfo}>
              <Text style={styles.nameText}>{item.name}</Text>
              <Text>Tuổi: {item.age}  •  Điểm: {item.grade}</Text>
            </View>
            <View style={styles.actions}>
              <TouchableOpacity style={styles.btn} onPress={() => handleEdit(item)}>
                <Text style={styles.btnText}>Sửa</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.btn, styles.btnDelete]} onPress={() => handleDelete(item.id)}>
                <Text style={styles.btnText}>Xóa</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      <Text style={styles.text}>Số học sinh có điểm trên 8: {countGreater8}</Text>
    </View>
  );
};

export default StudentList;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  header: { fontSize: 24, textAlign: "center", marginBottom: 12 },
  input: {
    height: 44,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 8,
    paddingLeft: 10,
    borderRadius: 6,
  },
  controlsRow: { flexDirection: "row", marginTop: 4 },
  itemRow: { flexDirection: "row", alignItems: "center", paddingVertical: 10, borderBottomColor: "#eee", borderBottomWidth: 1 },
  stt: { width: 30 },
  itemInfo: { flex: 1 },
  nameText: { fontWeight: "600", fontSize: 16 },
  actions: { flexDirection: "row" },
  btn: { padding: 8, borderRadius: 6, borderWidth: 1, borderColor: "#888", marginLeft: 6 },
  btnDelete: { borderColor: "red" },
  btnText: { fontSize: 14 },
  text: { fontSize: 16, marginTop: 12 },
});
