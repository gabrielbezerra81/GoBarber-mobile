import React, { useState, useCallback } from "react";

import { useRoute, useNavigation } from "@react-navigation/native";

import Icon from "react-native-vector-icons/Feather";
import {
  Container,
  Header,
  BackButton,
  HeaderTitle,
  UserAvatar,
} from "./styles";
import { useAuth } from "../../../../context/authContext";

import undefinedProfileImage from "../../../../assets/undefinedProfilePicture.png";

interface RouteParams {
  providerId: string;
}

const CreateAppointment: React.FC = () => {
  const route = useRoute();

  const { user } = useAuth();

  const navigation = useNavigation();

  const { providerId } = route.params as RouteParams;

  const [selectedProvider, setSelectedProvider] = useState(providerId);

  const navigateBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  return (
    <Container>
      <Header>
        <BackButton onPress={navigateBack}>
          <Icon name="chevron-left" size={24} color="#999591" />
        </BackButton>

        <HeaderTitle>Agendamento</HeaderTitle>

        <UserAvatar
          source={
            user.avatar_url ? { uri: user.avatar_url } : undefinedProfileImage
          }
        />
      </Header>
    </Container>
  );
};

export default CreateAppointment;
