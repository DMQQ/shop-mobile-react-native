import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { Colors, h3 } from "../../constants/styles";
import Product, { ProductTypeProps } from "../../modules/Product/Product";

export default function SearchResults({ route }: any) {
  const { result } = route.params;

  return (
    <View style={styles.container}>
      <Text
        style={[
          h3,
          { fontFamily: "PoppinsBold", padding: 10, paddingBottom: 15 },
        ]}
      >
        Matching Products
      </Text>
      {result.map((prod: ProductTypeProps) => {
        return <Product key={prod.prod_id} {...prod} sharedID="SearchResult" />;
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
});