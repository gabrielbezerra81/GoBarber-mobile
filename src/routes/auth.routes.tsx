import { createStackNavigator } from "@react-navigation/stack";
import React from "react";

import SignIn from "../modules/auth/SignIn/SignIn";
import SignUp from "../modules/auth/SignUp/SignUp";

const Auth = createStackNavigator();

const AuthRoutes: React.FC = () => (
  <Auth.Navigator
    screenOptions={{
      headerShown: false,
      cardStyle: { backgroundColor: "#312E38" },
    }}
  >
    <Auth.Screen name="SignIn" component={SignIn} />
    <Auth.Screen name="SignUp" component={SignUp} />
  </Auth.Navigator>
);

export default AuthRoutes;
