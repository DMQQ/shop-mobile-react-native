import React from "react";
import { View, Text, Image } from "react-native";
import { SharedElement } from "react-navigation-shared-element";
import styles from "./styles";
import { API } from "../../constants/routes";
import { useNavigation } from "@react-navigation/native";
import { useNavigationProps } from "../../@types/types";
import { Button } from "../../components";
import Clock from "@components/Clock";
import useCart from "modules/Cart/AddToCart/useAddCart";
import Ripple from "react-native-material-ripple";
import Loader from "./Loader";
import AddWatchlist from "modules/AddWatchlist";
import useColorTheme from "utils/context/ThemeContext";
import useDailySale from "./useDailySale";
import { image } from "functions/image";
import { Fonts } from "constants/styles";
import { useAppSelector } from "utils/hooks/hooks";

export default function DailySale() {
  const { data: sale, loading } = useDailySale();
  const data = sale?.sale;
  const navigation = useNavigation<useNavigationProps>();
  const { pushToCart, result } = useCart(data?.prod_id || 0);
  const { theme } = useColorTheme();
  const isLoaderPresent = loading || !data;

  const { cart } = useAppSelector((st) => st.cart);

  function toProduct() {
    if (data?.prod_id) {
      navigation.navigate("Product", {
        image: `${API}/upload/images=${data?.img_id[0]?.name}`,
        prod_id: data?.prod_id,
        sharedID: "DAILY",
        title: data?.title,
        isSharedAnimationUsed: true,
      });
    }
  }

  const product = cart.find((p) => p.prod_id === data?.prod_id);

  return (
    <View style={styles.container}>
      <View style={[styles.row, { justifyContent: "space-between" }]}>
        <Text style={styles.title}>Promotion</Text>
        <Clock />
      </View>
      {!isLoaderPresent ? (
        <View>
          <Ripple onPress={toProduct} style={styles.image_container}>
            <Text style={styles.off}>20% Off</Text>
            <SharedElement id={`prod_id.${data?.prod_id}DAILY`}>
              <Image
                style={[styles.image]}
                resizeMode="cover"
                source={image(data?.img_id?.[0]?.name)}
              />
            </SharedElement>
          </Ripple>
          <View style={[styles.details]}>
            <Text
              style={{
                color: theme.text,
                fontSize: 20,
                marginLeft: 20,
                fontFamily: Fonts.PoppinsRegular,
              }}
            >
              {data?.title}
            </Text>

            <View style={styles.bottom_tab}>
              <View
                style={[
                  styles.row,
                  { width: "100%", justifyContent: "space-between" },
                ]}
              >
                <View style={[styles.row, { width: "50%" }]}>
                  <Text style={[styles.price, { color: theme.text }]}>
                    ${data?.price}
                  </Text>
                  <Text style={styles.discounted}>
                    ${Math.ceil((data?.price || 0) * 1.25)}
                  </Text>
                </View>
                <Text style={{ color: theme.text }}>{data?.quantity} Left</Text>
              </View>

              <View style={[styles.row, { marginTop: 10, zIndex: 5 }]}>
                <AddWatchlist prod_id={data!.prod_id} />
                <Button
                  fontStyle={{ textTransform: "uppercase" }}
                  style={styles.button}
                  callback={pushToCart}
                  text={
                    !!result
                      ? `product added (${product?.ammount})`
                      : "add to cart"
                  }
                  color="primary"
                  type="contained"
                />
              </View>
            </View>
          </View>
        </View>
      ) : (
        <Loader />
      )}
    </View>
  );
}
