import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Swipeout from 'react-native-swipeout';

const PaletteCardLogin = ({ id_palette, color1, color2, color3, color4, likes, onLikePress, onDelete }) => {

  const swipeoutBtns = [
    {
      text: 'Elimina',
      backgroundColor: 'red',
      onPress: onDelete,
    },
  ];

  return (
    <Swipeout right={swipeoutBtns} autoClose={true} style={styles.swipeoutContainer}>
    <View style={styles.cardContainer}>
      <View style={styles.colorsContainer}>
        <View style={[styles.colorBox, styles.firstColorBox, { backgroundColor: color1 }]}>
          <View style={styles.colorTextContainer} ><Text style={styles.colorText} selectable={true}>{/* {id_palette} */}{color1}</Text></View>
        </View>
        <View style={[styles.colorBox, { backgroundColor: color2 }]}>
          <View style={styles.colorTextContainer} ><Text style={styles.colorText} selectable={true}>{color2}</Text></View>
        </View>
        <View style={[styles.colorBox, { backgroundColor: color3 }]}>
          <View style={styles.colorTextContainer} ><Text style={styles.colorText} selectable={true}>{color3}</Text></View>
        </View>
        <View style={[styles.colorBox, styles.lastColorBox, { backgroundColor: color4 }]}>
          <View style={styles.colorTextContainer} ><Text style={styles.colorText} selectable={true}>{color4}</Text></View>
        </View> 
      </View>
      <TouchableOpacity style={styles.likeButtonContainer} onPress={onLikePress}>
        <Ionicons style={styles.likeButton} name="heart" size={22} color="black" />
        <Text style={styles.likesCount}>{likes}</Text>
      </TouchableOpacity>
    </View>
    </Swipeout>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    width: 340,
    backgroundColor: 'white',
    borderRadius: 0,
    paddingRight: 13,
    paddingLeft: 13,
    paddingTop: 8,
    paddingBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  colorsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
  },
  colorBox: {
    flex: 1,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
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
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 5,
  },
  colorText: {
    color: '#fff',
    fontSize: 11,
    letterSpacing: 0,
    paddingTop: 2,
    paddingBottom: 2,
    paddingLeft: 4,
    paddingRight: 4,
  },
  likeButtonContainer: {
    alignItems: 'center',
  },
  likeButton: {
    marginLeft: 8,
  },
  likesCount: {
    marginLeft: 8,
    fontSize: 12,
    fontWeight: 'bold',
  },
  swipeoutContainer: {
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: "transparent",
  },
});

export default PaletteCardLogin;