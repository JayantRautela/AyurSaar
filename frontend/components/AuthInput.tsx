import { View, TextInput, StyleSheet } from "react-native";
import { COLORS } from "../constants/colors";

interface Props {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  secure?: boolean;
}

export default function AuthInput({
  placeholder,
  value,
  onChangeText,
  secure = false,
}: Props) {
  return (
    <View style={styles.container}>
      <TextInput
        placeholder={placeholder}
        placeholderTextColor={COLORS.textLight}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secure}
        style={styles.input}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.inputBg,
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 6,
    marginTop: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  input: {
    fontSize: 16,
    color: COLORS.textDark,
  },
});