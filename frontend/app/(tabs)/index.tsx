import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useAuthStore } from "../../store/useAuthStore";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

export default function Home() {
  const { user } = useAuthStore();
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.container}>
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.welcomeText}>Welcome back,</Text>
              <Text style={styles.nameText}>{user?.name}</Text>

              {/* <View style={styles.streakBadge}>
                <Ionicons name="flame-outline" size={18} color="#A97C50" />
                <Text style={styles.streakText}>
                  3 Day Wellness Streak
                </Text>
              </View> */}
            </View>

            <Image
              source={{
                uri: `https://ui-avatars.com/api/?name=${user?.name}&background=7A9471&color=fff`,
              }}
              style={styles.avatar}
            />
          </View>

          <TouchableOpacity activeOpacity={0.9} onPress={() => router.push("/chat")}>
            <LinearGradient
              colors={["#7A9471", "#8FAE86"]}
              style={styles.card}
            >
              <Text style={styles.cardTitle}>Ask AyurSaar</Text>
              <Text style={styles.cardSubtitle}>
                AI Wellness Assistant
              </Text>
              <Text style={styles.cardDesc}>
                Personalized herbal & yoga guidance
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          <Text style={styles.sectionTitle}>Quick Tools</Text>

          <View style={styles.toolsRow}>
            
            <TouchableOpacity style={styles.toolCard} onPress={() => router.push("/herbs")}>
              <View style={styles.iconCircle}>
                <Ionicons name="leaf-outline" size={28} color="#7A9471" />
              </View>
              <Text style={styles.toolText}>Herbs{"\n"}Library</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.toolCard} onPress={() => router.push("/yoga")}>
              <View style={styles.iconCircle}>
                <Ionicons name="fitness-outline" size={28} color="#7A9471" />
              </View>
              <Text style={styles.toolText}>Yoga</Text>
            </TouchableOpacity>

          </View>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#F4F2EE",
  },
  container: {
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  welcomeText: {
    fontSize: 18,
    color: "#8A867F",
  },
  nameText: {
    fontSize: 34,
    fontWeight: "700",
    color: "#3E3E3E",
    marginTop: 4,
  },
  streakBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EFE7DD",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 14,
  },
  streakText: {
    marginLeft: 6,
    color: "#A97C50",
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  card: {
    marginTop: 30,
    borderRadius: 28,
    padding: 24,
  },
  cardTitle: {
    fontSize: 26,
    fontWeight: "600",
    color: "white",
  },
  cardSubtitle: {
    color: "white",
    fontSize: 18,
    marginTop: 8,
  },
  cardDesc: {
    color: "rgba(255,255,255,0.8)",
    marginTop: 6,
  },
  sectionTitle: {
    fontSize: 26,
    fontWeight: "600",
    marginTop: 24,
    marginBottom: 20,
    color: "#3E3E3E",
  },
  toolsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  toolCard: {
    backgroundColor: "white",
    width: "48%",
    paddingVertical: 10,
    borderRadius: 22,
    alignItems: "center",
    elevation: 5,
  },
  iconCircle: {
    backgroundColor: "#F0F0F0",
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 14,
  },
  toolText: {
    fontSize: 18,
    textAlign: "center",
    color: "#3E3E3E",
  },
});