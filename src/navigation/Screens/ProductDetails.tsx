import React, { useEffect, useState, useRef } from "react";
import { StyleSheet, ScrollView, Animated } from "react-native";
import axios from "axios";
import { API } from "../../constants/routes";
import { useUser } from "../../context/UserContext";
import { Colors } from "../../constants/styles";
import AddToCart from "../../modules/AddToCart/AddToCart";
import ImagesCarusel from "../../modules/ImagesCarusel/ImagesCarusel";

import ProductDetailsText from "../../modules/ProductDetailsText/ProductDetailsText";
import ProductDetailsButtons from "../../modules/ProductDetailsButtons/ProductDetailsButtons";

export default function ProductDetails({ route, navigation }: any) {
  const { prod_id, image, sharedID } = route.params;
  const { user } = useUser();
  const [result, setResult] = useState<any>({});

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get(`${API}/products/id=${prod_id}`, {
          headers: {
            token: user.token,
          },
        });
        if (typeof response.data !== "undefined") {
          setResult(response.data);
        }
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  const imgList: { name: string; id: number }[] = result?.img_id;
  const images = imgList?.length > 1 ? imgList.splice(1, imgList.length) : [];
  const scrollX = useRef(new Animated.Value(0)).current;

  return (
    <ScrollView
      style={styles.container}
      showsHorizontalScrollIndicator={false}
      scrollEventThrottle={16}
      showsVerticalScrollIndicator={false}
      bounces
    >
      <ImagesCarusel
        scrollX={scrollX}
        sharedID={sharedID}
        prod_id={prod_id}
        image={image}
        images={images}
      />

      <AddToCart
        prod_id={prod_id}
        style={{
          zIndex: 10,
          top: 260,
        }}
      />

      <ProductDetailsText result={result} images={images} scrollX={scrollX} />
      <ProductDetailsButtons
        navigation={navigation}
        propsAdd={{
          thumbnail: image,
          prod_id,
          sharedID,
          prod_name: result.title,
        }}
        propsRead={{ reviews: result.rating_id }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
});