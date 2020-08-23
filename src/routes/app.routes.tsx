import { createStackNavigator } from "@react-navigation/stack";
import React from "react";

import Dashboard from "../modules/appointments/pages/Dashboard/Dashboard";
import Profile from "../modules/user/pages/Profile/Profile";
import CreateAppointment from "../modules/appointments/pages/CreateAppointment/CreateAppointment";
import AppointmentCreated from "../modules/appointments/pages/AppointmentCreated/AppointmentCreated";

const App = createStackNavigator();

const AppRoutes = () => (
  <App.Navigator
    screenOptions={{
      headerShown: false,
      cardStyle: { backgroundColor: "#312E38" },
    }}
  >
    <App.Screen name="Dashboard" component={Dashboard} />
    <App.Screen name="CreateAppointment" component={CreateAppointment} />
    <App.Screen name="AppointmentCreated" component={AppointmentCreated} />
    <App.Screen name="Profile" component={Profile} />
  </App.Navigator>
);

export default AppRoutes;
