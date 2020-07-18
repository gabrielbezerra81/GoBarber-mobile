import React from "react";
import AuthRoutes from "./auth.routes";
import AppRoutes from "./app.routes";
import { useAuth } from "../context/authContext";
import { ActivityIndicator, View } from "react-native";

const Routes: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
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
