import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Input, Button } from "@rneui/themed";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import PaletteCardLogin from "./PaletteCardLogin";
import { useAuth } from "../features/Auth/AuthContext";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"; /* Per le icone */
import Icon from "react-native-vector-icons/FontAwesome"; // Icone FontAwesome
import { useSelector, useDispatch } from "react-redux"; /* Redux */
import { newPalette, notNewPalette } from "../features/saved/NewPalette";

const Login = () => {
  const navigation = useNavigation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { isLoggedIn, login, logout } = useAuth();
  const [displayEmail, setDisplayEmail] = useState("");
  const [displayUsername, setDisplayUsername] = useState("");
  const [displayIdUtente, setDisplayIdUtente] = useState("");
  const [cards, setCards] = useState([]);
  const [showPassword, setShowPassword] = useState(false); //show password

  /* Variabile redux store */
  const isNewPalette = useSelector((state) => state.NewPalette.value);
  const dispatch = useDispatch();

  // Effetto per recuperare i dati salvati in AsyncStorage
  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const storedEmail = await AsyncStorage.getItem("email");
        const storedUsername = await AsyncStorage.getItem("username");
        const storedIdUtente = await AsyncStorage.getItem("id_utente");
        if (storedEmail && storedUsername && storedIdUtente) {
          setDisplayEmail(storedEmail);
          setDisplayUsername(storedUsername);
          setDisplayIdUtente(storedIdUtente);
          login();
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchInfo();
  }, [login]);

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoading(true); // Stato di caricamento
    try {
      const response = await axios.post(
        "https://matteocarrara.it/api/paletteAPI/login.php",
        {
          email: email,
          password: password,
        }
      );
      if (response.data.status === "success") {
        /* console.log(response.data.data.id_utente); */
        await AsyncStorage.setItem("isLoggedIn", "true");
        await AsyncStorage.setItem("email", response.data.data.email); // Salva l'email
        await AsyncStorage.setItem("username", response.data.data.username); // Salva username
        await AsyncStorage.setItem("id_utente", String(response.data.data.id_utente)); // Salva username
        setDisplayEmail(response.data.data.email); // Imposta l'email per la visualizzazione
        setDisplayUsername(response.data.data.username); // Imposta username per la visualizzazione
        setDisplayIdUtente(response.data.data.id_utente);
        login();
        setError("");
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false); // Imposta lo stato di caricamento su false dopo il login
    }
  };

  /* Per la palette dell'utente */
  useFocusEffect(
    React.useCallback(() => {
      /* console.log("Use focus effect"); */
      /* console.log(displayIdUtente); */
      if (isLoggedIn) {
        setLoading(true);
        axios.get(`https://matteocarrara.it/api/paletteAPI/getPaletteDashboard.php?creating_user_id=${displayIdUtente}`)
          .then((response) => {
            setCards([]); /* Account nuovo --> SetCards */
            if (Array.isArray(response.data)) {
              dispatch(notNewPalette());
              /* console.log(response.data); */
              setCards(response.data);
            } else {
              setError("Dati non validi dal backend.");
            }
            setError("");
          })
          .catch((error) => {
            console.error(error);
            setError("Errore nell'aggiornamento delle palette.");
          })
          .finally(() => {
            setLoading(false); // Imposta lo stato di caricamento su false dopo il recupero delle palette
          });
      }
    }, [isLoggedIn, displayIdUtente, isNewPalette])
  );

  /* Eliminazione palette */
  const handleDeletePalette = async (id_palette) => {
    /* console.log("Elimino palette: ", id_palette); */
    if (id_palette && displayIdUtente) {
      try {
        await axios.delete(`https://matteocarrara.it/api/paletteAPI/deletePalette.php?paletteId=${id_palette}&userId=${displayIdUtente}`);
        setCards(cards.filter((palette) => palette.id_palette !== id_palette));
        /* console.log("Palette eliminata con successo."); */
      } catch (error) {
        console.error("Errore durante l'eliminazione della palette:", error);
      }
    }
  };

  const handleRegister = () => {
    /* Link alla pagina register */
    navigation.navigate("Register");
  };

  const handleAddPalette = () => {
    /* Link alla pagina addPalette */
    navigation.navigate("AddPalette");
  };

  /* Logout */
  const handleLogout = async () => {
    await AsyncStorage.removeItem("isLoggedIn");
    await AsyncStorage.removeItem("email");
    await AsyncStorage.removeItem("username");
    await AsyncStorage.removeItem("id_utente");
    logout();
    setDisplayEmail("");
    setDisplayUsername("");
    setDisplayIdUtente("");
  };

  return (
    <>
      {loading ? ( // Mostra la schermata di caricamento se loading è true
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="rgb(104, 48, 237)" />
        </View>
      ) : (
        <>
          {isLoggedIn /* isLoggedIn? */ ? (
            <>
              <TouchableOpacity
                style={styles.settingsButton}
                onPress={handleLogout}
              >
                <Icon name="sign-out" size={34} color="#333" />
              </TouchableOpacity>
              <View style={styles.container1}>
                <Text style={styles.title1}>
                  Benvenuto{" "}
                  <Text style={styles.username}>{displayUsername}</Text>
                </Text>
                <Text style={styles.info1}>Palette pubblicate:</Text>
                <ScrollView contentContainerStyle={styles.scrollContainer}>
                  {cards.map((palette, index) => (
                    <View key={palette.id_palette} style={styles.containerCard}>
                      <PaletteCardLogin
                        key={index}
                        id_palette={palette.id_palette}
                        color1={palette.color1}
                        color2={palette.color2}
                        color3={palette.color3}
                        color4={palette.color4}
                        likes={palette.likes}
                        /* onLikePress={() => console.log("Pressed")} */
                        onDelete={() => handleDeletePalette(palette.id_palette)}
                      />
                    </View>
                  ))}
                </ScrollView>
                <TouchableOpacity
                  style={styles.addButton}
                  onPress={handleAddPalette}
                >
                  <Icon name="plus" size={18} color="#fff" />
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <View style={styles.container}>
              <Text style={styles.title}>Login</Text>
              <Input
                label="Email"
                placeholder="Inserisci email"
                leftIcon={
                  <MaterialCommunityIcons
                    name="at"
                    color={"rgb(104, 48, 237)"}
                    size={22}
                  />
                }
                value={email}
                onChangeText={setEmail}
              />
              <Input
                label="Password"
                placeholder="Inserisci password"
                secureTextEntry={!showPassword}
                leftIcon={
                  <MaterialCommunityIcons
                    name="lock-alert-outline"
                    color={"rgb(104, 48, 237)"}
                    size={22}
                  />
                }
                rightIcon={
                  // Icona show password
                  <TouchableOpacity onPress={handleShowPassword}>
                    <MaterialCommunityIcons
                      name={showPassword ? "eye-off-outline" : "eye-outline"}
                      color={"rgb(104, 48, 237)"}
                      size={22}
                    />
                  </TouchableOpacity>
                }
                value={password}
                onChangeText={setPassword}
              />
              <Button
                title="LOGIN"
                onPress={handleLogin}
                titleStyle={{ fontWeight: "700" }}
                buttonStyle={{
                  backgroundColor: "rgb(104, 48, 237)",
                  borderColor: "transparent",
                  borderWidth: 0,
                  borderRadius: 5,
                }}
                containerStyle={{
                  width: "100%",
                  alignSelf: "center",
                }}
              />
              <Button
                title="VAI AL REGISTER"
                onPress={handleRegister}
                titleStyle={{ fontWeight: "700" }}
                buttonStyle={{
                  backgroundColor: "rgb(104, 48, 237)",
                  borderColor: "transparent",
                  borderWidth: 0,
                  borderRadius: 5,
                }}
                containerStyle={{
                  width: "100%",
                  alignSelf: "center",
                  marginTop: 10,
                }}
              />
              <Text style={styles.error}>{error}</Text>
            </View>
          )}
        </>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  container1: {
    flex: 1,
    padding: 20,
    marginTop: 30,
  },
  error: {
    marginTop: 10,
    color: "red",
  },
  title: {
    fontSize: 50,
    fontWeight: "bold",
    marginBottom: 15,
    lineHeight: 50,
  },
  title1: {
    fontSize: 32,
    marginBottom: 5,
    lineHeight: 40,
    maxWidth: "80%",
  },
  username: {
    fontWeight: "bold",
  },
  sottotitolo1: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
  },
  scrollContainer: {
    alignItems: "center",
  },
  info1: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  containerCard: {
    marginBottom: 10,
  },
  addButton: {
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
  settingsButton: {
    position: "absolute",
    top: 60,
    right: 20,
    zIndex: 999, // Assicura che l'icona sia sopra gli altri elementi
  },
});

export default Login;
