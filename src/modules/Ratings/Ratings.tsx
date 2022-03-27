import { ProductRatingProps } from "/@types/types";
import React from "react";
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  Image,
  FlatList,
} from "react-native";

import { API } from "../../constants/routes";
import { Colors } from "../../constants/styles";
import { Stars } from "../Stars/Stars";

const { width } = Dimensions.get("screen");

export default function Ratings({
  rating,
  title,
  description,
}: ProductRatingProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={{
            uri: "https://i.pinimg.com/736x/8b/16/7a/8b167af653c2399dd93b952a48740620.jpg",
          }}
          style={styles.image}
        />
        <View style={{ flexDirection: "column", marginLeft: 20 }}>
          <Text style={styles.text}>Jan Kowalski</Text>
          <Text style={[{ fontSize: 18, color: "#b5b5b5" }]}>13 days ago</Text>
        </View>
      </View>

      <View style={{ marginBottom: 10 }}>
        <Text style={[styles.text, { fontSize: 25, fontWeight: "bold" }]}>
          {title}
        </Text>

        <Text style={styles.text}>{description}</Text>
      </View>

      <FlatList
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        data={[
          { id: 1, name: "0d406e307aa1bf36489bf9f5b3eeac16" },
          { id: 2, name: "1e1f59ed6d99acb2223c2fd4e567541e" },
        ]}
        keyExtractor={({ id }) => id.toString()}
        renderItem={({ item }) => (
          <Image
            source={{ uri: `${API}/upload/images=${item.name}` }}
            style={styles.slider}
          />
        )}
      />

      <Stars
        rating={rating}
        starStyle={{ transform: [{ scale: 0.5 }], padding: 0 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.primary100,
    padding: 10,
    marginTop: 20,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 10,
  },
  header: {
    marginBottom: 10,
    flexDirection: "row",
  },
  text: {
    color: "#e3e3e3",
    fontSize: 20,
  },
  slider: {
    width: width - 20, // padding
    height: 250,
  },
});
