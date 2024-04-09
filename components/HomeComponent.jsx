import React from "react";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"; /* Per le icone */
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  FlatList,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const images = [
  require("../assets/palette1.png"),
  require("../assets/palette2.png"),
  require("../assets/palette3.png"),
  require("../assets/palette4.png"),
  require("../assets/palette5.png"),
  require("../assets/palette6.png"),
  require("../assets/palette7.png"),
  require("../assets/palette8.png"),
  require("../assets/palette9.png"),
  require("../assets/palette10.png"),
];

const HomeComponent = () => {
  const navigation = useNavigation();

  const handleScopri = () => {
    /* Link alla pagina palette */
    navigation.navigate("Palette");
  };

  const renderCarouselItem = ({ item }) => (
    <Image source={item} style={styles.carouselImage} />
  );

  return (
    <ImageBackground
      source={require("../assets/sfondo1.jpg")}
      style={styles.backgroundImage}
    >
      <View style={styles.container}>
        <MaterialCommunityIcons
          name="palette"
          color={"rgb(207, 190, 255)"}
          size={150}
        />
        <Text style={styles.title}>Palette it!</Text>
        <Text style={styles.subtitle}>Esplora le tue palette preferite</Text>
        <TouchableOpacity style={styles.button} onPressOut={handleScopri}>
          <Text style={styles.buttonText}>Scopri</Text>
        </TouchableOpacity>
        <View style={styles.carouselContainer}>
          <FlatList
            data={images}
            renderItem={renderCarouselItem}
            keyExtractor={(item, index) => index.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
          />
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)", // Opacità dello sfondo
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 20,
    color: "#fff",
    marginBottom: 30,
  },
  button: {
    backgroundColor: "rgb(104, 48, 237)",
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 25,
    marginBottom: 20,
  },
  buttonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
  },
  carouselContainer: {
    maxHeight: 200,
    marginTop: 20,
  },
  carouselImage: {
    width: 170,
    height: 170,
    marginRight: 10,
    marginLeft: 10,
    borderRadius: 10,
  },
});

export default HomeComponent;
