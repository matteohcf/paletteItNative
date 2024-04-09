import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { useEffect, useState } from "react";
import { useAuth } from "../features/Auth/AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

const PaletteCard = ({
  id_palette,
  color1,
  color2,
  color3,
  color4,
  likes,
  likedPalette,
}) => {
  /* console.log(likedPalette); */
  const { isLoggedIn, login, logout } = useAuth();
  const [displayIdUtente, setDisplayIdUtente] = useState("");

  const [likesDisplay, setLikesDisplay] = useState(likes);
  const [error, setError] = useState(null);
  const [fill, setFill] = useState("black");

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

  const onLikePress = () => {
    if (!isLoggedIn) {
      console.log("Utente non loggato, non può mettere like!");
    } else {
      /* console.log("Add Like.php"); */
      axios
        .post(
          "https://matteocarrara.it/api/paletteAPI/addLike.php",
          {
            id_palette: id_palette,
            id_utente: displayIdUtente,
          }
        )
        .then((response) => {
          const newLikes = response.data.likes;
          /* console.log(response.data); */
          if (response.data.isLiked) {
            setLikesDisplay(newLikes);
            setFill("red");
          } else {
            setFill("black");
            setLikesDisplay(newLikes);
          }
          setError(null);
          /* console.log(likedPalette); */
        })
        .catch((error) => {
          console.error(error);
          setError("Errore nell'aggiornamento dei like.");
        });
    }
  };

  useEffect(() => {
    /* console.log("Use effect colori"); */
    // Verifica se l'ID della palette è presente in likedPalette e imposta il colore del cuore di conseguenza
    setFill(
      Array.isArray(likedPalette) && likedPalette.includes(id_palette)
        ? "red"
        : "black"
    );
  }, [likedPalette, id_palette]);

  return (
    <View style={styles.cardContainer}>
      <View style={styles.colorsContainer}>
        <View
          style={[
            styles.colorBox,
            styles.firstColorBox,
            { backgroundColor: color1 },
          ]}
        >
          <View style={styles.colorTextContainer}>
            <Text style={styles.colorText} selectable={true}>
              {/* {id_palette} */}
              {color1}
            </Text>
          </View>
        </View>
        <View style={[styles.colorBox, { backgroundColor: color2 }]}>
          <View style={styles.colorTextContainer}>
            <Text style={styles.colorText} selectable={true}>
              {color2}
            </Text>
          </View>
        </View>
        <View style={[styles.colorBox, { backgroundColor: color3 }]}>
          <View style={styles.colorTextContainer}>
            <Text style={styles.colorText} selectable={true}>
              {color3}
            </Text>
          </View>
        </View>
        <View
          style={[
            styles.colorBox,
            styles.lastColorBox,
            { backgroundColor: color4 },
          ]}
        >
          <View style={styles.colorTextContainer}>
            <Text style={styles.colorText} selectable={true}>
              {color4}
            </Text>
          </View>
        </View>
      </View>
      <TouchableOpacity
        style={styles.likeButtonContainer}
        onPress={onLikePress}
      >
        <Ionicons
          style={styles.likeButton}
          name="heart"
          size={22}
          color={fill}
        />
        <Text style={styles.likesCount}>{likesDisplay}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    width: 340,
    backgroundColor: "white",
    borderRadius: 20,
    paddingRight: 13,
    paddingLeft: 13,
    paddingTop: 8,
    paddingBottom: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  colorsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    flex: 1,
  },
  colorBox: {
    flex: 1,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 0,
    marginHorizontal: 0,
  },
  firstColorBox: {
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  lastColorBox: {
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
  },
  colorTextContainer: {
    backgroundColor: "rgba(0,0,0,0.4)",
    borderRadius: 5,
  },
  colorText: {
    color: "#fff",
    fontSize: 11,
    letterSpacing: 0,
    paddingTop: 2,
    paddingBottom: 2,
    paddingLeft: 4,
    paddingRight: 4,
  },
  likeButtonContainer: {
    alignItems: "center",
  },
  likeButton: {
    marginLeft: 8,
  },
  likesCount: {
    marginLeft: 8,
    fontSize: 12,
    fontWeight: "bold",
  },
});

export default PaletteCard;
