import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import Slider from "@react-native-community/slider"; 
import { Button } from "@rneui/themed";

const ColorPicker = ({ colorIndex, onClose, onColorSave }) => {
  const [red, setRed] = useState(0);
  const [green, setGreen] = useState(0);
  const [blue, setBlue] = useState(0);

  const handleColorChange = (color, value) => {
    switch (color) {
      case "red":
        setRed(value);
        break;
      case "green":
        setGreen(value);
        break;
      case "blue":
        setBlue(value);
        break;
      default:
        break;
    }
  };

  const handleSaveColor = () => {
    const color = `rgb(${red}, ${green}, ${blue})`;
    onColorSave(color);
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.colorPreview,
          { backgroundColor: `rgb(${red}, ${green}, ${blue})` },
        ]}
      />
      <View style={styles.sliders}>
        <View style={styles.sliderContainer}>
          <Text>Red: {red}</Text>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={255}
            step={1}
            value={red}
            onValueChange={(value) => handleColorChange("red", value)}
          />
        </View>
        <View style={styles.sliderContainer}>
          <Text>Green: {green}</Text>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={255}
            step={1}
            value={green}
            onValueChange={(value) => handleColorChange("green", value)}
          />
        </View>
        <View style={styles.sliderContainer}>
          <Text>Blue: {blue}</Text>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={255}
            step={1}
            value={blue}
            onValueChange={(value) => handleColorChange("blue", value)}
          />
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <Button
          title="Annulla"
          onPress={handleCancel}
          titleStyle={{ fontWeight: "700" }}
          buttonStyle={{
            backgroundColor: "rgb(104, 48, 237)",
            borderColor: "transparent",
            borderWidth: 0,
            borderRadius: 5,
          }}
        />
        <Button
          title="Salva"
          onPress={handleSaveColor}
          titleStyle={{ fontWeight: "700" }}
          buttonStyle={{
            backgroundColor: "rgb(104, 48, 237)",
            borderColor: "transparent",
            borderWidth: 0,
            borderRadius: 5,
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginTop: 20,
  },
  colorPreview: {
    width: 200,
    height: 200,
    borderRadius: 100,
    marginBottom: 20,
  },
  sliders: {
    width: "80%",
  },
  sliderContainer: {
    marginBottom: 20,
  },
  slider: {
    width: "100%",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
  },
});

export default ColorPicker;
