import React, { useEffect, useState } from "react";
import { Text, View, Image, StyleSheet, ActivityIndicator } from "react-native";
import { useSelector } from "react-redux";
import { URL_BASE } from "@env";
import { Video } from "expo-av";

const VideoComponent = ({ uri }) => {
  const videoRef = React.useRef(null);
  const [isVideoLoading, setVideoLoading] = React.useState(true);

  const onLoad = (status) => {
    setVideoLoading(false);
  };

  const onError = (error) => {
    console.error("Error loading video:", error);
    setVideoLoading(false);
  };

  return (
    <View>
      {isVideoLoading && (
        <ActivityIndicator size="large" color="blue" mt={15} />
      )}
      <Video
        ref={videoRef}
        style={{ width: "100%", height: 200 }}
        source={{ uri: uri }}
        useNativeControls={isVideoLoading ? false : true}
        resizeMode="contain"
        shouldPlay={true}
        isLooping
        onReadyForDisplay={onLoad}
        onError={onError}
      />
    </View>
  );
};

function CategoryFitnessDetail({ route }) {
  const { fitnessId } = route.params;
  const accessToken = useSelector((state) => state.token.accessToken);
  const [fitnessData, setFitnessData] = useState(null);

  useEffect(() => {
    const fetchFitnessData = async () => {
      try {
        const response = await fetch(`${URL_BASE}/fitness/${fitnessId}/`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

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
  }, [fitnessId, accessToken]);

  if (!fitnessData) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="blue" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {fitnessData.image && (
          <Image style={styles.image} source={{ uri: fitnessData.image }} />
        )}
        {fitnessData.video && <VideoComponent uri={fitnessData.video} />}
        <View style={styles.infoContainer}>
          <Text style={styles.title}>{fitnessData.title}</Text>
          <Text style={styles.description}>{fitnessData.description}</Text>
          <Text style={styles.setReps}>
            {fitnessData.set} | Reps: {fitnessData.reps}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    marginTop: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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

export default CategoryFitnessDetail;
