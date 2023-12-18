import React, { useEffect, useState } from "react";
import { Text, View, Image, StyleSheet, TouchableOpacity } from "react-native";
import { useSelector } from "react-redux";
import { URL_BASE } from "@env";
import { useNavigation } from "@react-navigation/native";


function CategoryFitness({ route }) {
  const { categoryId } = route.params;
  const accessToken = useSelector((state) => state.token.accessToken);
  const [fitnessData, setFitnessData] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchFitnessData = async () => {
      try {
        const response = await fetch(
          `${URL_BASE}/fitness/?category_id=${categoryId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (!response.ok) {
          // Handle error if needed
          console.error("Failed to fetch fitness data");
          return;
        }

        const data = await response.json();
        setFitnessData(data);
      } catch (error) {
        console.error("Error fetching fitness data:", error.message);
      }
    };

    fetchFitnessData();
  }, [categoryId, accessToken]);

  return (
    <View style={styles.container}>
      {fitnessData.map((fitness) => (
        <TouchableOpacity key={fitness.id} style={styles.card} onPress={()=> navigation.navigate('DetailFitness', { fitnessId: fitness.id })}>
          <Image style={styles.image} source={{ uri: fitness.image }} />
          <View style={styles.infoContainer}>
            <Text style={styles.title}>{fitness.title}</Text>
            <Text style={styles.description}>{fitness.description}</Text>
            <Text style={styles.setReps}>
              {fitness.set} | Reps: {fitness.reps}
            </Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
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
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 10,
  },
  infoContainer: {
    padding: 10,
    backgroundColor: "#fff",
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  description: {
    color: "#555",
    marginBottom: 8,
  },
  setReps: {
    color: "#777",
  },
});

export default CategoryFitness;
