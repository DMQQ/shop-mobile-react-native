import React, { useEffect } from "react";
import { ActivityIndicator, Modal, ScrollView, View, Text } from "react-native";
import { ScreenNavigationProps } from "../../../@types/types";
import { Button, Input } from "../../../components";
import useCheckout from "../../../hooks/useCheckout";
import { CardField, initStripe } from "@stripe/stripe-react-native";
import { Formik } from "formik";
import checkoutSchema from "./checkoutSchema";
import { Colors } from "../../../constants/styles";
import { AntDesign } from "@expo/vector-icons";
import styles from "./styles";

export default function Checkout({
  route,
  navigation,
}: Required<ScreenNavigationProps<"Checkout">>) {
  const { purchase, result, total, loading } = useCheckout({ route });

  useEffect(() => {
    initStripe({
      publishableKey:
        "pk_test_51KHt5OJFFDDymwGwp9gsCogqhxvzYvyo2wJsIAwSrPflIZjFZn2OtUhBbQAwt9SNek6Ol2e7QZUSh86NJyNByl2m00scfwXXjW",
      merchantIdentifier: "merchant.identifier",
    });
  }, []);

  return (
    <ScrollView style={[styles.container]}>
      <Formik
        initialValues={{
          name: "",
          surname: "",
          address: "",
        }}
        onSubmit={purchase}
        validationSchema={checkoutSchema}
      >
        {({
          handleChange,
          handleBlur,
          isValid,
          handleSubmit,
          values,
          errors,
        }) => (
          <>
            <Input
              value={values.name}
              onChangeText={handleChange("name")}
              name={errors.name || "Name"}
              placeholder="Name"
              style={{
                ...styles.input,
                borderColor: errors.name ? "#FF3030" : Colors.primary100,
              }}
              labelStyle={{
                color: errors.name ? "#FF3030" : "#fff",
              }}
              placeholderTextColor={errors.name ? "#FF3030" : "#fff"}
              onBlur={handleBlur("name")}
            />

            <Input
              value={values.surname}
              onChangeText={handleChange("surname")}
              name={errors.surname || "Surname"}
              placeholder="Surname"
              style={{
                ...styles.input,
                borderColor: errors.surname ? "#FF3030" : Colors.primary100,
              }}
              labelStyle={{
                color: errors.surname ? "#FF3030" : "#fff",
              }}
              placeholderTextColor={errors.surname ? "#FF3030" : "#fff"}
              onBlur={handleBlur("surname")}
            />

            <Input
              value={values.address}
              onChangeText={handleChange("address")}
              name={errors.name || "Address"}
              placeholder="2780 Quincy Mountain Suite 162"
              style={{
                ...styles.input,
                borderColor: errors.address ? "#FF3030" : Colors.primary100,
              }}
              labelStyle={{
                color: errors.address ? "#FF3030" : "#fff",
              }}
              placeholderTextColor={errors.address ? "#FF3030" : "#e3e3e3"}
              onBlur={handleBlur("address")}
            />

            <CardField
              placeholder={{
                number: "4242 4242 4242 4242",
              }}
              cardStyle={{
                backgroundColor: "#1e293b",
                placeholderColor: "#ffffff",
                textColor: "#ffffff",
                borderRadius: 10,
                cursorColor: "#ffffff",
              }}
              style={styles.card}
            />

            <Button
              disabled={!isValid}
              text={`PAY $${total}`}
              icon={
                <AntDesign
                  name="creditcard"
                  size={24}
                  color="white"
                  style={{ marginRight: 10 }}
                />
              }
              style={[
                styles.button,
                { backgroundColor: isValid ? "#FF0056" : Colors.primary },
              ]}
              callback={handleSubmit}
            />
          </>
        )}
      </Formik>

      <Modal visible={loading} transparent animationType="slide">
        <View style={styles.modal}>
          <View style={styles.modalItems}>
            {!result && <ActivityIndicator size={"large"} color={"red"} />}

            {result === "OK" && (
              <>
                <Text style={{ color: "#fff", fontSize: 30 }}>Success</Text>
                <Button
                  text="Click to get back"
                  style={{ marginTop: 10 }}
                  onPress={() => navigation.navigate("Home")}
                />
              </>
            )}
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}