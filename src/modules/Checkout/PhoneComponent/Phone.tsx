import React from "react";
import { useState } from "react";
import { View, Text } from "react-native";
import Input from "../../../components/Input/Input";
import { Colors } from "../../../constants/styles";

export default function Phone() {
  const [phone, setPhone] = useState("");
  return (
    <View style={{ padding: 10 }}>
      <Text
        style={{ color: Colors.text, fontFamily: "PoppinsBold", fontSize: 25 }}
      >
        Phone
      </Text>
      <View>
        <Input
          value={phone}
          setValue={setPhone}
          placeholder="phone number"
          placeholderColor={Colors.text}
          keyboardType="numeric"
          style={{ borderColor: Colors.text, borderWidth: 0.5 }}
        />
      </View>
    </View>
  );
}