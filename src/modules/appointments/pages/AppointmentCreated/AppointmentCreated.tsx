import React, { useCallback, useMemo } from "react";
import Icon from "react-native-vector-icons/Feather";
import moment from "moment";
import "moment/locale/pt-br";

import { useNavigation, useRoute } from "@react-navigation/native";
import {
  Container,
  Title,
  Description,
  OkButton,
  OkButtonText,
} from "./styles";
import { useAuth } from "../../../../context/authContext";

interface RouteParams {
  date: number;
  providerName: string;
}

const AppointmentCreated: React.FC = () => {
  const navigation = useNavigation();

  const routes = useRoute();

  const routeParams = routes.params as RouteParams;

  const handleOkPressed = useCallback(() => {
    navigation.reset({
      routes: [
        {
          name: "Dashboard",
        },
      ],
      index: 0,
    });
  }, [navigation]);

  const formattedDate = useMemo(() => {
    const day = moment(routeParams.date).format("dddd");

    let [dayOfWeek] = day.split("-");

    dayOfWeek = dayOfWeek.charAt(0).toUpperCase() + dayOfWeek.substr(1);

    const date = moment(routeParams.date)
      .locale("pt-br")
      .format("[dia] LLL[h]");

    return `${dayOfWeek}, ${date}`;
  }, [routeParams.date]);

  return (
    <Container>
      <Icon name="check" size={80} color="#04d361" />

      <Title>Agendamento concluído</Title>
      <Description>
        {formattedDate} com {routeParams.providerName}
      </Description>
      <OkButton onPress={handleOkPressed}>
        <OkButtonText>Ok</OkButtonText>
      </OkButton>
    </Container>
  );
};

export default AppointmentCreated;
