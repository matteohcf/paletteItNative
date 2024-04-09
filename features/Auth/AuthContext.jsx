import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Carica lo stato di autenticazione salvato in AsyncStorage all'avvio dell'applicazione
  useEffect(() => {
    const loadAuthState = async () => {
      try {
        const authState = await AsyncStorage.getItem('authState');
        if (authState !== null) {
          setIsLoggedIn(JSON.parse(authState));
        }
      } catch (error) {
        console.error('Errore nel caricare lo stato di autenticazione:', error);
      }
    };

    loadAuthState();
  }, []);

  // Funzione per effettuare il login
  const login = async () => {
    try {
      setIsLoggedIn(true);
      await AsyncStorage.setItem('authState', JSON.stringify(true));
    } catch (error) {
      console.error('Errore nel salvataggio dello stato di autenticazione:', error);
    }
  };

  // Funzione per effettuare il logout
  const logout = async () => {
    try {
      setIsLoggedIn(false);
      await AsyncStorage.removeItem('authState');
    } catch (error) {
      console.error('Errore nella rimozione dello stato di autenticazione:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);