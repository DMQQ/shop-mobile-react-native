import { useState, useCallback, useRef, useEffect } from "react";
import { ScrollView, View, RefreshControl } from "react-native";
import ImagesCarusel from "./components/ImagesCarusel/ImagesCarusel";
import { Product, ScreenNavigationProps } from "/@types/types";
import styles from "./styles";
import useColorTheme from "@utils/context/ThemeContext";
import ProductSuggestion from "./components/Suggestions/ProductSuggestion";
import BottomTab from "./components/BottomTab/BottomTab";
import { wait } from "functions/wait";
import Details from "./components/Details";
import useProduct from "./hooks/useProduct";
import CartSheet from "@modules/Cart/CartSheet";

import BottomSheet from "@gorhom/bottom-sheet";
import { useAppSelector } from "utils/hooks/hooks";
import { useIsFocused } from "@react-navigation/native";

export default function ProductDetails({
  route,
}: Required<ScreenNavigationProps<"Product">>) {
  const { prod_id, image, sharedID, title } = route.params;
  const { data, refetch } = useProduct(prod_id);
  const result = data?.product;

  const images = [
    { id: 0, name: image?.split("=")[1] },
    ...(result?.img_id || []),
  ];

  const { theme } = useColorTheme();

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    refetch({ prod_id });
    wait(2000).then(() => setRefreshing(false));
  }, []);

  const sheetRef = useRef<BottomSheet | null>(null);

  const isFocused = useIsFocused();
  const { cart } = useAppSelector((state) => state.cart);

  const cartProduct = cart.find((item) => item.prod_id === result?.prod_id);

  useEffect(() => {
    if (!!cartProduct) {
      sheetRef.current?.close();
    }
  }, [cart, isFocused]);

  return (
    <View style={{ flex: 1, backgroundColor: theme.primary }}>
      <ScrollView
        style={[styles.container, { backgroundColor: theme.primary }]}
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        bounces
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <ImagesCarusel {...{ sharedID, prod_id, images }} />

        <Details
          {...result}
          prod_id={prod_id}
          image={image}
          title={title}
          sharedID={sharedID}
        />

        <ProductSuggestion text={result?.title} />
      </ScrollView>

      <BottomTab
        onCartUpdate={() => sheetRef.current?.snapToIndex(0)}
        prod_id={prod_id}
        quantity={result?.quantity || 0}
      />

      <CartSheet
        cartProduct={cartProduct}
        onDismiss={() => sheetRef.current?.close()}
        product={{ ...(result as Product), prod_id, img_id: images }}
        ref={(ref) => (sheetRef.current = ref)}
      />
    </View>
  );
}
