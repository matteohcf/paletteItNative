import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Text,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/FontAwesome";
import ColorPicker from "./ColorPicker";
import { Button } from "@rneui/themed";
import tinycolor from "tinycolor2";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSelector, useDispatch } from "react-redux"; /* Redux */
import { newPalette, notNewPalette } from "../features/saved/NewPalette";

const AddPalette = () => {
  const navigation = useNavigation(); // Funzione di navigazione
  const [selectedColorIndex, setSelectedColorIndex] = useState(null);
  const [apiResponse, setApiResponse] = useState(""); /* Per API response */
  const [displayIdUtente, setDisplayIdUtente] = useState(""); /* Per id utente da mandare ad api */
  const [paletteColors, setPaletteColors] = useState([
    "#008DDA",
    "#7AA2E3",
    "#41C9E2",
    "#ACE2E1",
  ]);

  /* Variabile redux store */
  const isNewPalette = useSelector((state) => state.NewPalette.value);
  const dispatch = useDispatch();

  const handleColorPress = (index) => {
    setSelectedColorIndex(index);
  };

  const handleColorPickerClose = () => {
    setSelectedColorIndex(null);
  };

  const handleColorSave = (color) => {
    const updatedColors = [...paletteColors];
    updatedColors[selectedColorIndex] = tinycolor(color).toHexString(); // Conversione colore in HEX
    setPaletteColors(updatedColors);
    setSelectedColorIndex(null);
  };

  const goBack = () => {
    navigation.goBack();
  };

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

  /* Creazione palette in DB */
  const creaPalette = () => {
    axios
      .post(
        "https://matteocarrara.it/api/paletteAPI/creaPalette.php",
        {
          color1: paletteColors[0],
          color2: paletteColors[1],
          color3: paletteColors[2],
          color4: paletteColors[3],
          creating_user_id: displayIdUtente,
        }
      )
      .then((response) => {
        /* console.log(response); */
        dispatch(newPalette()); /* Nuova palette */
        setApiResponse(response.data.message);
      })
      .catch((error) => {
        console.error(error);
        setApiResponse(error.response.data.message);
      });
  };

  return (
    <>
      <TouchableOpacity style={styles.closeButton} onPress={goBack}>
        <Icon name="times" size={24} color="#333" />
      </TouchableOpacity>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <View style={styles.containerCerchi}>
            {[...Array(4).keys()].map((index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.colorCircle,
                  {
                    backgroundColor: paletteColors[index],
                    elevation: selectedColorIndex === index ? 8 : 0,
                  },
                  selectedColorIndex === index ? styles.selectedColor : null,
                ]}
                onPress={() => handleColorPress(index)}
              />
            ))}
          </View>
          {selectedColorIndex !== null && (
            <ColorPicker
              colorIndex={selectedColorIndex}
              onClose={handleColorPickerClose}
              onColorSave={handleColorSave}
            />
          )}
          <Button
            title="PUBBLICA"
            onPress={creaPalette}
            titleStyle={{ fontWeight: "700" }}
            buttonStyle={{
              backgroundColor: "rgb(104, 48, 237)",
              borderColor: "transparent",
              borderWidth: 0,
              borderRadius: 5,
            }}
            containerStyle={{
              width: "80%",
              alignSelf: "center",
              marginTop: 20,
            }}
          />
          <Text
            style={[
              styles.error,
              {
                color:
                  apiResponse && apiResponse === "Colori inviati con successo"
                    ? "green"
                    : "red",
              },
            ]}
          >
            {apiResponse}
          </Text>
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  closeButton: {
    position: "absolute",
    top: 55,
    left: 20,
    zIndex: 999, // Assicura che l'icona sia sopra gli altri elementi
  },
  containerCerchi: {
    marginTop: 90,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  colorCircle: {
    width: 60,
    height: 60,
    borderRadius: 35,
    margin: 5,
  },
  selectedColor: {
    borderWidth: 5,
    borderColor: "#333",
  },
  error: {
    marginTop: 10,
    alignSelf: "center",
  },
});

export default AddPalette;
