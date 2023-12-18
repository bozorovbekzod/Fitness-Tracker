import React, { useState, useEffect } from "react";
import {
  ScrollView,
  VStack,
  Input,
  Button,
  Text,
  Center,
  Box,
  Heading,
  FormControl,
  Image,
} from "native-base";
import { useSelector } from "react-redux";
import { useNavigation, useRoute } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { Alert } from "react-native";
import { URL_BASE } from "@env";
import { SelectList } from "react-native-dropdown-select-list";

const EditExercise = () => {
  const [image, setImage] = useState([]);
  const [description, setDescription] = useState("");
  const [set, setSet] = useState("");
  const [reps, setReps] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const token = useSelector((state) => state.token.accessToken);
  const navigation = useNavigation();
  const route = useRoute();

  const fitnessId = route.params.fitnessId; // Assume you pass fitnessId from the navigation

  useEffect(() => {
    // Fetch exercise details when the component mounts
    fetchExerciseDetails();
  }, [fitnessId]);

  const fetchExerciseDetails = async () => {
    try {
      const response = await fetch(`${URL_BASE}/fitness/${fitnessId}/`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        Alert.alert(
          "Failed to fetch exercise details",
          "Check your internet connection"
        );
      }

      const data = await response.json();
      // Set state with exercise details
      setImage([{ uri: data.image }]); // Assuming the image is a URL
      setDescription(data.description);
      setSet(data.set);
      setReps(data.reps);
      setTitle(data.title);
      setCategory(data.category);
    } catch (error) {
      console.error("Error fetching exercise details:", error.message);
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets);
    }
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);

      const formData = new FormData();
      formData.append("image", {
        type: "image/jpg",
        uri: image[0]?.uri,
        name: new Date() + "image.jpg",
      });
      formData.append("description", description);
      formData.append("set", set);
      formData.append("reps", reps);
      formData.append("title", title);
      formData.append("category", category);

      const response = await fetch(`${URL_BASE}/fitness/${fitnessId}/`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        console.error("Error updating exercise:", response);
        Alert.alert("Error", "Failed to update exercise", [{ text: "OK" }], {
          cancelable: false,
        });
      } else {
        Alert.alert(
          "Success",
          "Exercise updated successfully",
          [{ text: "OK" }],
          {
            cancelable: false,
          }
        );
        navigation.navigate("Home");
      }
    } catch (error) {
      Alert.alert(
        "Failed",
        "Cannot Update Exercise. Check your data and try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView>
      <Center w="100%">
        <Box safeArea p="2" w="90%" maxW="290" py="8">
          <Heading size="lg" color="coolGray.800" fontWeight="semibold">
            Edit Exercise
          </Heading>
          <VStack space={3} mt="5">
            {/* Image Picker */}
            <Button onPress={pickImage}>Pick Image</Button>
            {image.length !== 0 && (
              <Image
                source={{ uri: image[0]?.uri }}
                alt="Selected Image"
                size="xl"
                resizeMode="cover"
              />
            )}

            {/* Description Input */}
            <FormControl>
              <FormControl.Label _text={{ color: "muted.700", fontSize: "sm" }}>
                Description:
              </FormControl.Label>
              <Input
                value={description}
                onChangeText={setDescription}
                placeholder="Description"
              />
            </FormControl>

            {/* Set Input */}
            <FormControl>
              <FormControl.Label _text={{ color: "muted.700", fontSize: "sm" }}>
                Set:
              </FormControl.Label>
              <Input value={set} onChangeText={setSet} placeholder="Set" />
            </FormControl>

            {/* Reps Input */}
            <FormControl>
              <FormControl.Label _text={{ color: "muted.700", fontSize: "sm" }}>
                Reps:
              </FormControl.Label>
              <Input value={reps} onChangeText={setReps} placeholder="Reps" />
            </FormControl>

            {/* Title Input */}
            <FormControl>
              <FormControl.Label _text={{ color: "muted.700", fontSize: "sm" }}>
                Title:
              </FormControl.Label>
              <Input
                value={title}
                onChangeText={setTitle}
                placeholder="Title"
              />
            </FormControl>

            {/* Category Select */}
            <FormControl>
              <FormControl.Label _text={{ color: "muted.700", fontSize: "sm" }}>
                Category:
              </FormControl.Label>
              <SelectList
                setSelected={(val) => setCategory(val)}
                data={categories.map((cat) => ({
                  key: cat.id,
                  value: cat.name,
                }))}
                save="key"
                placeholder="Select Category"
              />
            </FormControl>

            {/* Submit Button */}
            <View
              mt={4}
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-end",
                gap: 15,
              }}
            >
              <Button
                colorScheme="indigo"
                onPress={handleSubmit}
                isLoading={isSubmitting}
              >
                Update Exercise
              </Button>
            </View>
          </VStack>
        </Box>
      </Center>
    </ScrollView>
  );
};

export default EditExercise;
