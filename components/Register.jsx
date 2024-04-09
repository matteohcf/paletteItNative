import React, { useState } from "react";
import { View, StyleSheet, Text, ActivityIndicator, TouchableOpacity } from "react-native";
import { Input, Button } from "@rneui/themed";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons"; /* Per le icone */

const Register = () => {
  const navigation = useNavigation(); // Funzione di navigazione
  const [showPassword, setShowPassword] = useState(false); //show password

  // Funzione per tornare alla schermata precedente
  const goBack = () => {
    navigation.goBack();
  };

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // Stato di caricamento

  const handleRegister = async (event) => {
    event.preventDefault();
    setLoading(true); // Imposta lo stato di caricamento su true prima di inviare la richiesta di registrazione
    try {
      const response = await axios.post(
        "https://matteocarrara.it/api/paletteAPI/register.php",
        {
          username: username,
          email: email,
          password: password,
        }
      );
      /* console.log(response); */
      setError(response.data.message);
    } catch (error) {
      console.error(error);
      setError(error.response.data.message);
    } finally {
      setLoading(false); // Stato di caricamento su false dopo l'invio della richiesta di registrazione, indipendentemente dall'esito
    }
  };

  return (
    <>
      {loading /* Loading? */ ? (
        <View style={styles.container}>
          <ActivityIndicator size="large" color="rgb(104, 48, 237)" />
        </View>
      ) : (
        <View style={styles.container}>
          <Text style={styles.title}>Register</Text>
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
            label="Username"
            placeholder="Inserisci username"
            leftIcon={
              <MaterialCommunityIcons
                name="account-circle-outline"
                color={"rgb(104, 48, 237)"}
                size={22}
              />
            }
            value={username}
            onChangeText={setUsername}
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
            title="REGISTRATI"
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
            }}
          />
          <Button
            title="TORNA AL LOGIN"
            onPress={goBack}
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
          <Text
            style={[
              styles.error,
              {
                color:
                  error && error === "Utente registrato con successo"
                    ? "green"
                    : "red",
              },
            ]}
          >
            {error}
          </Text>
        </View>
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
  title: {
    fontSize: 50,
    fontWeight: "bold",
    marginBottom: 10,
  },
  error: {
    marginTop: 10,
  },
});

export default Register;
