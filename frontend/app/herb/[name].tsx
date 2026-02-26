import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { HERBS } from "../(tabs)/herbs"; // 👈 export HERBS if needed

export default function HerbDetail() {
  const { name } = useLocalSearchParams();
  const router = useRouter();

  const herb = HERBS.find((h) => h.name === name);

  if (!herb) return null;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView>
        <Image source={{ uri: herb.image_url }} style={styles.image} />

        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={20} />
        </TouchableOpacity>

        <View style={styles.content}>
          <Text style={styles.title}>{herb.name}</Text>
          <Text style={styles.scientific}>
            {herb.scientific_name}
          </Text>

          <Text style={styles.section}>Benefits</Text>
          {herb.benefits.map((b, i) => (
            <Text key={i} style={styles.text}>• {b}</Text>
          ))}

          <Text style={styles.section}>Used For</Text>
          {herb.used_for.map((u, i) => (
            <Text key={i} style={styles.text}>• {u}</Text>
          ))}

          <Text style={styles.section}>Preparation</Text>
          <Text style={styles.text}>{herb.preparation}</Text>

          <Text style={styles.section}>Safety</Text>
          <Text style={styles.text}>{herb.safety}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F4F2EE" },
  image: { width: "100%", height: 260 },
  backBtn: {
    position: "absolute",
    top: 50,
    left: 20,
    backgroundColor: "white",
    padding: 10,
    borderRadius: 20,
  },
  content: {
    backgroundColor: "white",
    marginTop: -30,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 20,
  },
  title: { fontSize: 24, fontWeight: "700" },
  scientific: { fontStyle: "italic", marginBottom: 20 },
  section: { fontSize: 18, fontWeight: "600", marginTop: 15 },
  text: { marginTop: 5 },
});