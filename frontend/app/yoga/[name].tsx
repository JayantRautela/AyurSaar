import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { useLocalSearchParams } from "expo-router";

export default function YogaDetail() {
  const { data } = useLocalSearchParams();
  const pose = JSON.parse(data as string);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Image source={{ uri: pose.image_url }} style={styles.image} />

        <View style={styles.container}>
          <Text style={styles.title}>{pose.name}</Text>
          <Text style={styles.sanskrit}>{pose.sanskrit}</Text>

          <Text style={styles.sectionTitle}>About This Pose</Text>
          <Text style={styles.text}>{pose.about_this_pose}</Text>

          <Text style={styles.sectionTitle}>Health Benefits</Text>
          <Text style={styles.text}>{pose.target_benefit}</Text>

          <Text style={styles.sectionTitle}>Step-by-Step Guide</Text>
          {pose.steps.map((step: string, index: number) => (
            <Text key={index} style={styles.step}>
              {index + 1}. {step}
            </Text>
          ))}

          <Text style={styles.sectionTitle}>Precautions</Text>
          <Text style={[styles.text, { color: "#C62828" }]}>
            {pose.precaution_and_contradiction}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#F4F2EE" },
  image: { width: "100%", height: 250 },
  container: { padding: 20 },
  title: { fontSize: 24, fontWeight: "700", color: "#3E3E3E" },
  sanskrit: {
    fontSize: 14,
    fontStyle: "italic",
    color: "#8C8475",
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 20,
    marginBottom: 8,
    color: "#3E3E3E",
  },
  text: {
    fontSize: 15,
    color: "#6E6E6E",
    lineHeight: 22,
  },
  step: {
    fontSize: 14,
    marginBottom: 6,
    color: "#6E6E6E",
  },
});