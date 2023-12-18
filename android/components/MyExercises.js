import React, { useState, useEffect } from "react";
import { FlatList, TouchableOpacity } from "react-native";
import { VStack, Text, Box, Image, HStack, Button, Center } from "native-base";
import { useNavigation } from "@react-navigation/native";
import { URL_BASE } from "@env";
import { useSelector } from "react-redux";

const MyExercises = () => {
  const [fitnessList, setFitnessList] = useState([]);
  const navigation = useNavigation();
  const token = useSelector((state) => state.token.accessToken);

  useEffect(() => {
    fetchFitnessList();
  }, []);

  const fetchFitnessList = async () => {
    try {
      const response = await fetch(`${URL_BASE}/fitness/`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        console.error("Failed to fetch fitness list");
        return;
      }

      const data = await response.json();
      setFitnessList(data);
    } catch (error) {
      console.error("Error fetching fitness list:", error.message);
    }
  };

  // const handleEdit = (fitnessId) => {
  //   navigation.navigate("EditExercise", { fitnessId });
  // };

  const handleDelete = async (fitnessId) => {
    try {
      const response = await fetch(`${URL_BASE}/fitness/${fitnessId}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        // Handle error appropriately
        console.error("Failed to delete fitness item");
        return;
      }

      // Remove the deleted item from the list
      setFitnessList((prevList) =>
        prevList.filter((item) => item.id !== fitnessId)
      );
    } catch (error) {
      console.error("Error deleting fitness item:", error.message);
    }
  };

  const renderItem = ({ item }) => (
    <Box
      borderWidth={1}
      borderColor="gray.300"
      borderRadius="md"
      p={4}
      my={2}
      flexDirection="row"
      alignItems="center"
      justifyContent="space-between"
    >
      <Image
        source={{ uri: item.image }}
        alt="Fitness Thumbnail"
        size="sm"
        borderRadius="md"
        mr={2}
      />
      <VStack>
        <Text fontWeight="bold">{item.title}</Text>
        <Text>{item.description}</Text>
      </VStack>

      <HStack space={2}>
        {/* <TouchableOpacity>
          <Button
            onPress={() => handleEdit(item.id)}
            size="xs"
            colorScheme="blue"
          >
            Edit
          </Button>
        </TouchableOpacity> */}
        <TouchableOpacity>
          <Button
            onPress={() => handleDelete(item.id)}
            size="xs"
            colorScheme="red"
          >
            Delete
          </Button>
        </TouchableOpacity>
      </HStack>
    </Box>
  );

  return (
    <FlatList
      data={fitnessList}
      renderItem={renderItem}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={{ padding: 16 }}
    />
  );
};

export default MyExercises;
