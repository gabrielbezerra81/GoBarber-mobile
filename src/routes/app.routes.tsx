import { createStackNavigator } from "@react-navigation/stack";
import React from "react";

import Dashboard from "../pages/Dashboard/Dashboard";

const App = createStackNavigator();

const AppRoutes = () => {
  return (
    <App.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: "#312E38" },
      }}
    >
      <App.Screen name="Dashboard" component={Dashboard} />
    </App.Navigator>
  );
};

export default AppRoutes;
