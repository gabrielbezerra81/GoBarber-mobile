import React from "react";
import { ActivityIndicator, View } from "react-native";
import { useFonts } from "expo-font";
import AuthRoutes from "./auth.routes";
import AppRoutes from "./app.routes";
import { useAuth } from "../context/authContext";

const Routes: React.FC = () => {
  const { user, loading } = useAuth();

  const [fontLoaded] = useFonts({
    "RobotoSlab-Regular": require("../../assets/fonts/RobotoSlab-Regular.ttf"),
    "RobotoSlab-Medium": require("../../assets/fonts/RobotoSlab-Medium.ttf"),
  });

  if (loading || !fontLoaded) {
    return (
      <View
        style={{
          flex: 1,
          alignContent: "center",
          justifyContent: "center",
          backgroundColor: "#312E38",
        }}
      >
        <ActivityIndicator size="large" color="#999" />
      </View>
    );
  }

  return user ? <AppRoutes /> : <AuthRoutes />;
};

export default Routes;
