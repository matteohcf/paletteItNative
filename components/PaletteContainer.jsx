import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import PaletteCard from "./PaletteCard";
import axios from "axios";
import { useAuth } from "../features/Auth/AuthContext";
import Icon from "react-native-vector-icons/FontAwesome";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

function PaletteContainer() {
  const { isLoggedIn, login, logout } = useAuth();
  const [displayIdUtente, setDisplayIdUtente] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cards, setCards] = useState([]);
  const scrollViewRef = useRef(null);
  const [showScrollToTopButton, setShowScrollToTopButton] = useState(false);
  const [likedPalette, setLikedPalette] = useState([]);

  /* Per ottenere l'id dell'utente loggato (per inviare alle API) */
  const getStoredValue = async () => {
    try {
      const value = await AsyncStorage.getItem("id_utente");
      setDisplayIdUtente(value);
      /* console.log(displayIdUtente); */
    } catch (error) {
      console.error("Errore durante il recupero del valore:", error);
    }
  };
  getStoredValue();

  useFocusEffect(
    React.useCallback(() => {
      /* console.log("Use focus effect 2"); */
      const fetchData = async () => {
        setLoading(true);
        try {
          const response = await axios.get(
            "https://matteocarrara.it/api/paletteAPI/getPalette.php",
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          setCards(response.data);
          setLoading(false);
        } catch (error) {
          console.error("Errore nella richiesta al database:", error);
          setLoading(false);
          setError(error);
        }
      };
      fetchData();
    }, [])
  );

  /* Per ottenere le palette con i like, passato poi come props */
  useFocusEffect(
    React.useCallback(() => {
      /* console.log("Use focus effect 3"); */
      /* console.log(displayIdUtente); */
      if (isLoggedIn) {
        axios
          .post(
            "https://matteocarrara.it/api/paletteAPI/getLikedPalette.php",
            {
              id_utente: displayIdUtente,
            }
          )
          .then((response) => {
            setLikedPalette(response.data.liked_palettes);
            /* console.log(response.data.liked_palettes); */
            /* console.log(likedPalette); */
          })
          .catch((error) => {
            console.error(error);
            setError("Errore nell'aggiornamento dei like.");
          });
      } else {
        setLikedPalette([]);
      }
    }, [displayIdUtente])
  );

  const scrollToTop = () => {
    scrollViewRef.current.scrollTo({ y: 0, animated: true });
  };

  return (
    <>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="rgb(104, 48, 237)" />
        </View>
      ) : (
        <View style={styles.container}>
          <Text style={styles.title}>Palette</Text>
          <ScrollView
            ref={scrollViewRef}
            contentContainerStyle={styles.scrollContainer}
            onScroll={(event) => {
              const offsetY = event.nativeEvent.contentOffset.y;
              const contentHeight = event.nativeEvent.contentSize.height;
              const height = event.nativeEvent.layoutMeasurement.height;
              const isNearBottom = offsetY + height >= (3 / 4) * contentHeight; // Bottone appare quando si è scesi oltre i 3/4 del contenuto
              setShowScrollToTopButton(isNearBottom);
            }}
            scrollEventThrottle={16}
          >
            {cards.map((palette) => (
              <View key={palette.id_palette} style={styles.containerCard}>
                <PaletteCard
                  id_palette={palette.id_palette}
                  color1={palette.color1}
                  color2={palette.color2}
                  color3={palette.color3}
                  color4={palette.color4}
                  likes={palette.likes}
                  likedPalette={likedPalette}
                  /* onLikePress={() => console.log("Pressedddd")} */
                />
              </View>
            ))}
          </ScrollView>
          {showScrollToTopButton && (
            <TouchableOpacity
              style={styles.scrollToTopButton}
              onPress={scrollToTop}
            >
              <Icon name="chevron-up" size={18} color="#fff" />
            </TouchableOpacity>
          )}
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    marginTop: 30,
    position: "relative",
  },
  title: {
    fontSize: 40,
    fontWeight: "bold",
    marginBottom: 15,
  },
  scrollContainer: {
    alignItems: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollToTopButton: {
    position: "absolute",
    bottom: 10,
    right: 20,
    backgroundColor: "rgba(104, 48, 237, 0.8)",
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  containerCard: {
    marginBottom: 15,
  },
});

export default PaletteContainer;
