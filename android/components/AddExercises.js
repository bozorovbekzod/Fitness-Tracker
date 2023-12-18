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
} from "native-base";
import { MaterialIcons } from "@expo/vector-icons";
import { useSelector } from "react-redux";
// import Toast from 'react-native-toast-message';
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import { Alert } from "react-native";
import { View } from "native-base";
import { URL_BASE } from "@env";
import { SelectList } from "react-native-dropdown-select-list";

const AddExercises = () => {
  const [image, setImage] = useState([]);
  const [video, setVideo] = useState([]);
  const [description, setDescription] = useState("");
  const [set, setSet] = useState("");
  const [reps, setReps] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const token = useSelector((state) => state.token.accessToken);
  const navigation = useNavigation();

  useEffect(() => {
    // Fetch categories when the component mounts
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${URL_BASE}/categories/`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
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

  const pickVideo = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "video/*",
        copyToCacheDirectory: true,
      });

      if (!result.canceled) {
        setVideo(result?.assets);
      } else {
        console.log("Video picker canceled");
      }
    } catch (error) {
      console.error("Error picking video:", error);
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
      if (video.length > 0) {
        formData.append("video", {
          type: "video/mp4",
          uri: video[0]?.uri,
          name: new Date() + "video.mp4",
        });
      }
      formData.append("description", description);
      formData.append("set", set);
      formData.append("reps", reps);
      formData.append("title", title);
      formData.append("category", category);

      const response = await fetch(`${URL_BASE}/fitness/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        console.error("Error submitting exercise:", response);
        Alert.alert("Error", "Failed to add exercise", [{ text: "OK" }], {
          cancelable: false,
        });
      } else {
        clearForm();
        Alert.alert(
          "Success",
          "Exercise added successfully",
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
        "Cannot Add Exercise. Check your data and try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const clearForm = () => {
    setImage([]);
    setVideo([]);
    setDescription("");
    setSet("");
    setReps("");
    setTitle("");
    setCategory("");
  };

  return (
    <ScrollView>
      <Center w="100%">
        <Box safeArea p="2" w="90%" maxW="290" py="8">
          <Heading size="lg" color="coolGray.800" fontWeight="semibold">
            Add Exercise
          </Heading>
          <VStack space={3} mt="5">
            <Button onPress={pickImage}>Pick Image</Button>
            {image.length !== 0 && (
              <Text fontSize="sm" color="green.500">
                Image selected
              </Text>
            )}

            <Button onPress={pickVideo}>Pick Video</Button>
            {video.length !== 0 && (
              <Text fontSize="sm" color="green.500">
                Video selected
              </Text>
            )}

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

            <FormControl>
              <FormControl.Label _text={{ color: "muted.700", fontSize: "sm" }}>
                Set:
              </FormControl.Label>
              <Input value={set} onChangeText={setSet} placeholder="Set" />
            </FormControl>

            <FormControl>
              <FormControl.Label _text={{ color: "muted.700", fontSize: "sm" }}>
                Reps:
              </FormControl.Label>
              <Input value={reps} onChangeText={setReps} placeholder="Reps" />
            </FormControl>

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

            <FormControl>
              <FormControl.Label _text={{ color: "muted.700", fontSize: "sm" }}>
                Category:
              </FormControl.Label>
              <SelectList
                // boxStyles={{ borderColor: "white" }}
                // inputStyles={{ color: "white" }}
                // dropdownStyles={{ borderColor: "white" }}
                // dropdownTextStyles={{ color: "white" }}
                // search={false}
                setSelected={(val) => setCategory(val)}
                data={categories.map((cat) => ({
                  key: cat.id,
                  value: cat.name,
                }))}
                save="key"
                placeholder="Select Category"
              />
            </FormControl>

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
                Add Exercise
              </Button>
              <Button colorScheme="red" onPress={clearForm} onPressOut={()=> navigation.navigate('HomeFitness')}>
                Cancel
              </Button>
            </View>
          </VStack>
        </Box>
      </Center>
    </ScrollView>
  );
};

export default AddExercises;
