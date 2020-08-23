import "react-native-gesture-handler";
import RNAsyncStorageFlipper from "rn-async-storage-flipper";
import AsyncStorage from "@react-native-community/async-storage";
import React from "react";
import { StatusBar } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import AppProvider from "./context";
import Routes from "./routes";

RNAsyncStorageFlipper(AsyncStorage);

const App: React.FC = () => (
  <NavigationContainer>
    <StatusBar barStyle="light-content" backgroundColor="#312E38" translucent />
    <AppProvider>
      <Routes />
    </AppProvider>
  </NavigationContainer>
);

export default App;
