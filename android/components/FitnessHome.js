import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  Image,
  ScrollView,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { URL_BASE } from "@env";
import categoryImage1 from "../assets/card1.jpg";
import categoryImage2 from "../assets/card2.jpg";
import categoryImage3 from "../assets/card3.jpg";
import categoryImage4 from "../assets/card4.jpg";
import categoryImage5 from "../assets/card5.jpg";
import categoryImage6 from "../assets/card6.jpg";

function FitnessHome({navigation}) {
  const accessToken = useSelector((state) => state.token.accessToken);
  const [categories, setCategories] = useState([]);

  const categoryImages = [
    { id: 1, image: categoryImage1, name: "Full Body" },
    { id: 2, image: categoryImage2, name: "Abs Beginner" },
    { id: 3, image: categoryImage3, name: "Abs Beginner" },
    { id: 4, image: categoryImage4, name: "Abs Beginner" },
    { id: 5, image: categoryImage5, name: "Abs Beginner" },
    { id: 6, image: categoryImage6, name: "Abs Beginner" },
  ];

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${URL_BASE}/categories/`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        Alert.alert(
          "Failed to fetch categories",
          "Check your internet connection"
        );
      }

      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity
        style={styles.iconContainer}
        onPress={() => navigation.navigate("UserProfile")}
      >
        <View style={styles.iconBackground}>
          <MaterialCommunityIcons name="account" size={20} color="#fff" />
        </View>
      </TouchableOpacity>
      {categories?.map((category, index) => (
        <TouchableOpacity key={category.id} style={styles.card} onPress={()=> navigation.navigate('FitnessList', { categoryId: category.id })}>
          <Image style={styles.image} source={categoryImages[index].image} />
          <View style={styles.textContainer}>
            <Text style={styles.text}>{category.name.toUpperCase()}</Text>
          </View>
        </TouchableOpacity>  
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    marginTop: 20,
  },
  card: {
    marginBottom: 16,
    borderRadius: 10,
    overflow: "hidden",
    position: "relative",
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 10,
  },
  textContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    width: "100%",
    padding: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  text: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "left",
  },
  iconContainer: {
    alignItems: "flex-end",
    // paddingRight: 16,
    marginBottom: 8,
  },
  iconBackground: {
    backgroundColor: "tomato",
    borderRadius: 50,
    padding: 5,
  },
  cardsContainer: {
    marginTop: 20,
  },
});

export default FitnessHome;
