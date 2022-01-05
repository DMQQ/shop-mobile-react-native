import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useWindowDimensions, View } from "react-native";
import { SuggestionType, useNavigationProps } from "../../../@types/types";
import Input from "../../../components/Input/Input";
import Suggestion from "../../../components/Suggestion";
import { API } from "../../../constants/routes";
import { useUser } from "../../../context/UserContext";

export default function SearchScreen() {
  const { width } = useWindowDimensions();
  const [query, setQuery] = useState("");
  const [suggestion, setSuggestion] = useState<SuggestionType[]>([]);

  const {
    user: { token },
  } = useUser();

  useEffect(() => {
    const cancelToken = axios.CancelToken.source();

    const delay = setTimeout(async () => {
      if (query.trim() !== "") {
        try {
          const { data } = await axios({
            method: "GET",
            headers: {
              token,
            },
            url: `${API}/products/suggestions`,
            cancelToken: cancelToken.token,
            params: {
              q: query,
            },
          });

          console.log(data);

          setSuggestion(data);
        } catch (error) {
          console.warn("./navigation/Search/Form.tsx: ", error);
        }
      }
    }, 500);

    return () => {
      cancelToken.cancel();
      clearTimeout(delay);
    };
  }, [query]);

  const navigation = useNavigation<useNavigationProps>();

  return (
    <View
      style={{
        width,
        alignItems: "center",
      }}
    >
      <Input
        value={query}
        setValue={setQuery}
        placeholder="Search..."
        placeholderTextColor={"#fff"}
        style={{
          width,
          borderColor: "#FF0056",
          borderWidth: 2,
          borderRadius: 0,
          margin: 0,
        }}
      />
      {suggestion.map((suggestion) => (
        <Suggestion
          key={suggestion.prod_id}
          navigation={navigation}
          {...suggestion}
        />
      ))}
    </View>
  );
}