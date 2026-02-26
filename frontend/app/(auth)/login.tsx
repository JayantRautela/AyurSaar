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

export default function Login() {
  const { login } = useAuthStore();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);
      await login(email, password);
      router.replace("/");
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>

      <Text style={styles.title}>Welcome Back</Text>
      <Text style={styles.subtitle}>
        Sign in to continue your wellness journey
      </Text>

      <Text style={styles.label}>Email</Text>
      <AuthInput
        placeholder="your.email@example.com"
        value={email}
        onChangeText={setEmail}
      />

      <Text style={styles.label}>Password</Text>
      <AuthInput
        placeholder="Enter your password"
        value={password}
        onChangeText={setPassword}
        secure
      />

      {/* <TouchableOpacity style={styles.forgotContainer}>
        <Text style={styles.forgotText}>Forgot Password?</Text>
      </TouchableOpacity> */}

      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
        <Text style={styles.buttonText}>Sign In</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={{ marginTop: 28 }}
        onPress={() => router.push("/(auth)/signup")}
      >
        <Text style={styles.bottomText}>
          Dont have an account?{" "}
          <Text style={{ color: COLORS.primaryDark, fontWeight: "600" }}>
            Sign Up
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
  forgotContainer: {
    alignItems: "flex-end",
    marginTop: -12,
    marginBottom: 24,
  },
  forgotText: {
    color: COLORS.primaryDark,
    fontSize: 14,
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