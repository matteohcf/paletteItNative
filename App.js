import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Home from './pages/Home';
import Palette from './pages/Palette';
import Account from './pages/Account';
import AddPalette from './components/AddPalette';
import Register from './components/Register'; 
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
/* import LogoTitle from './components/LogoTitle'; */
import { SafeAreaProvider } from 'react-native-safe-area-context';
/* Auth */
import { AuthProvider } from './features/Auth/AuthContext';
import { useAuth } from './features/Auth/AuthContext';
import { Provider } from 'react-redux'; /* Redux */
import store from './store'; /* Store redux */

const Tab = createMaterialBottomTabNavigator();
const Stack = createStackNavigator();

function MainTabs() {
  const { isLoggedIn, login, logout } = useAuth();  /* Auth */
  /* console.log(isLoggedIn); */
  return (
    <AuthProvider>
      <Tab.Navigator
        barStyle={{ backgroundColor: 'white', height: 84 }}
        activeColor="rgb(104, 48, 237)"
        inactiveColor="gray"
      >
        <Tab.Screen
          name="Home"
          component={Home}
          options={{
            tabBarLabel: 'Home',
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="home" color={color} size={24} />
            ),
          }}
        />
        <Tab.Screen
          name="Palette"
          component={Palette}
          options={{
            tabBarLabel: 'Palette',
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="palette" color={color} size={24} />
            ),
          }}
        />
        <Tab.Screen
          name="Account"
          component={Account}
          options={{
            tabBarLabel: 'Account',
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="account" color={color} size={24} />
            ),
          }}
        />
      </Tab.Navigator>
    </AuthProvider>
  );
}

function App() {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <AuthProvider>
          <NavigationContainer>
            <Stack.Navigator headerMode="none">
              <Stack.Screen name="MainTabs" component={MainTabs} />
              <Stack.Screen name="Register" component={Register} />
              <Stack.Screen name="AddPalette" component={AddPalette} />
            </Stack.Navigator>
          </NavigationContainer>
        </AuthProvider>
      </SafeAreaProvider>
    </Provider>
  );
}

export default App;
