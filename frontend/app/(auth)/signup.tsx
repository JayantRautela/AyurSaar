import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { useAuthStore } from "../../store/useAuthStore";
import { COLORS } from "../../constants/colors";
import AuthInput from "../../components/AuthInput";

export default function Signup() {
  const { signup } = useAuthStore();
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    try {
      setLoading(true);
      await signup(name, email, password);
      router.replace("/");
    } catch (err: any) {
      console.log(err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>

      <Text style={styles.title}>Create Account</Text>
      <Text style={styles.subtitle}>
        Begin your journey to holistic wellness
      </Text>

      <Text style={styles.label}>Full Name</Text>
      <AuthInput
        placeholder="Your name"
        value={name}
        onChangeText={setName}
      />

      <Text style={styles.label}>Email</Text>
      <AuthInput
        placeholder="your.email@example.com"
        value={email}
        onChangeText={setEmail}
      />

      <Text style={styles.label}>Password</Text>
      <AuthInput
        placeholder="Create a password"
        value={password}
        onChangeText={setPassword}
        secure
      />

      <TouchableOpacity style={styles.button} onPress={handleSignup} disabled={loading}>
        <Text style={styles.buttonText}>Create Account</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={{ marginTop: 28 }}
        onPress={() => router.back()}
      >
        <Text style={styles.bottomText}>
          Already have an account?{" "}
          <Text style={{ color: COLORS.primaryDark, fontWeight: "600" }}>
            Sign In
          </Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: 28,
    justifyContent: "center",
  },
  logoContainer: {
    alignSelf: "center",
    width: 90,
    height: 90,
    backgroundColor: COLORS.primary,
    borderRadius: 28,
    marginBottom: 30,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: COLORS.textDark,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 15,
    color: COLORS.textLight,
    textAlign: "center",
    marginTop: 8,
    marginBottom: 36,
  },
  label: {
    fontSize: 14,
    color: COLORS.textDark,
    fontWeight: "500",
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingVertical: 18,
    borderRadius: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  bottomText: {
    textAlign: "center",
    fontSize: 14,
    color: COLORS.textLight,
  },
});