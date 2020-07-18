import React from "react";
import { View, Button } from "react-native";
import { useAuth } from "../../context/authContext";

const Dashboard: React.FC = () => {
  const { signOut } = useAuth();

  return (
    <View
      style={{
        flex: 1,
        alignContent: "center",
        justifyContent: "center",
        backgroundColor: "#312E38",
      }}
    >
      <Button title="Sair" onPress={signOut} />
    </View>
  );
};

export default Dashboard;
