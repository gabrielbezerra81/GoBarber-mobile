import React, { useState, useCallback, useEffect, useMemo } from "react";
import { useRoute, useNavigation } from "@react-navigation/native";
import moment from "moment";
import DateTimePicker from "@react-native-community/datetimepicker";
import Icon from "react-native-vector-icons/Feather";
import { Platform, Alert } from "react-native";

import {
  Container,
  Header,
  BackButton,
  HeaderTitle,
  UserAvatar,
  ProvidersListContainer,
  ProvidersList,
  ProviderContainer,
  ProviderAvatar,
  ProviderName,
  Calendar,
  Title,
  OpenDatePickerButton,
  OpenDatePickerButtonText,
  Schedule,
  Section,
  SectionTitle,
  SectionContent,
  Hour,
  HourText,
  Content,
  CreateAppointmentButton,
  CreateAppointmentButtonText,
} from "./styles";
import { useAuth } from "../../../../context/authContext";

import undefinedProfileImage from "../../../../assets/undefinedProfilePicture.png";
import api from "../../../../services/api";
import { Provider } from "../Dashboard/Dashboard";
import getNextValidDay from "../../../../utils/getNextValidDay";

interface RouteParams {
  providerId: string;
}

interface DayAvailability {
  hour: number;
  available: boolean;
}

const CreateAppointment: React.FC = () => {
  const route = useRoute();

  const { user } = useAuth();

  const navigation = useNavigation();

  const { providerId } = route.params as RouteParams;

  const [providers, setProviders] = useState<Provider[]>([]);
  const [selectedProvider, setSelectedProvider] = useState(providerId);
  const [selectedDate, setSelectedDate] = useState(getNextValidDay());
  const [selectedHour, setSelectedHour] = useState(0);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dayAvailability, setDayAvailability] = useState<DayAvailability[]>([]);

  const navigateBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const loadDayAvailability = useCallback(async () => {
    api
      .get<DayAvailability[]>(
        `providers/${selectedProvider}/day-availability`,
        {
          params: {
            day: selectedDate.getDate(),
            month: selectedDate.getMonth() + 1,
            year: selectedDate.getFullYear(),
          },
        },
      )
      .then((response) => {
        setDayAvailability(response.data);
      })
      .catch(console.log);
  }, [selectedProvider, selectedDate]);

  const handleOpenDatePicker = useCallback(() => {
    setShowDatePicker((showPicker) => !showPicker);
  }, []);

  const handleDateSelection = useCallback((event: any, date?: Date) => {
    if (Platform.OS === "android") {
      setShowDatePicker(false);
    }
    if (date) {
      setSelectedDate(date);
    }
  }, []);

  const handleHourSelection = useCallback((hour: number) => {
    setSelectedHour(hour);
  }, []);

  const handleCreateAppointment = useCallback(async () => {
    try {
      const date = new Date(selectedDate);

      date.setHours(selectedHour);
      date.setMinutes(0);

      const response = await api.post("appointments", {
        provider_id: selectedProvider,
        date,
      });

      const { provider } = response.data;

      console.log(response.data);

      await loadDayAvailability();

      setSelectedHour(0);

      navigation.navigate("AppointmentCreated", {
        date: date.getTime(),
        providerName: provider.name,
      });
    } catch (error) {
      Alert.alert(
        "Erro ao criar agendamento",
        "Ocorreu um erro ao tentar criar o agendamento, tente novamente.",
      );
      console.log(error);
    }
  }, [
    selectedDate,
    selectedHour,
    navigation,
    selectedProvider,
    loadDayAvailability,
  ]);

  useEffect(() => {
    api
      .get<Provider[]>("providers")
      .then((response) => {
        setProviders(response.data);
      })
      .catch(console.log);
  }, []);

  useEffect(() => {
    loadDayAvailability();
  }, [loadDayAvailability]);

  const morningAvailability = useMemo(
    () =>
      dayAvailability
        .filter(({ hour }) => hour < 12)
        .map((availability) => ({
          ...availability,
          formattedHour: moment(new Date().setHours(availability.hour)).format(
            "HH:00",
          ),
        })),
    [dayAvailability],
  );

  const afternoonAvailability = useMemo(
    () =>
      dayAvailability
        .filter(({ hour }) => hour >= 12)
        .map((availability) => ({
          ...availability,
          formattedHour: moment(new Date().setHours(availability.hour)).format(
            "HH:00",
          ),
        })),
    [dayAvailability],
  );

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

      <Content>
        <ProvidersListContainer>
          <ProvidersList
            data={providers}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(provider) => provider.id}
            renderItem={({ item: provider }) => (
              <ProviderContainer
                selected={provider.id === selectedProvider}
                onPress={() => {
                  setSelectedProvider(provider.id);
                }}
              >
                <ProviderAvatar
                  source={
                    provider.avatar_url
                      ? { uri: provider.avatar_url }
                      : undefinedProfileImage
                  }
                />
                <ProviderName selected={provider.id === selectedProvider}>
                  {provider.name}
                </ProviderName>
              </ProviderContainer>
            )}
          />
        </ProvidersListContainer>

        <Calendar>
          <Title>Escolha a data</Title>

          <OpenDatePickerButton onPress={handleOpenDatePicker}>
            <OpenDatePickerButtonText>
              Selecionar outra data
            </OpenDatePickerButtonText>
          </OpenDatePickerButton>

          {showDatePicker && (
            <DateTimePicker
              mode="date"
              display="calendar"
              value={selectedDate}
              onChange={handleDateSelection}
              {...(Platform.OS === "ios" && { textColor: "#f4ede8" })}
            />
          )}
        </Calendar>

        <Schedule>
          <Title>Escolha o horário</Title>

          <Section>
            <SectionTitle>Manhã</SectionTitle>
            <SectionContent>
              {morningAvailability.map(({ formattedHour, available, hour }) => (
                <Hour
                  enabled={available}
                  key={formattedHour}
                  available={available}
                  onPress={() => handleHourSelection(hour)}
                  selected={selectedHour === hour}
                >
                  <HourText selected={selectedHour === hour}>
                    {formattedHour}
                  </HourText>
                </Hour>
              ))}
            </SectionContent>
          </Section>

          <Section>
            <SectionTitle>Tarde</SectionTitle>
            <SectionContent>
              {afternoonAvailability.map(
                ({ formattedHour, available, hour }) => (
                  <Hour
                    enabled={available}
                    key={formattedHour}
                    available={available}
                    onPress={() => handleHourSelection(hour)}
                    selected={selectedHour === hour}
                  >
                    <HourText selected={selectedHour === hour}>
                      {formattedHour}
                    </HourText>
                  </Hour>
                ),
              )}
            </SectionContent>
          </Section>
        </Schedule>

        <CreateAppointmentButton onPress={handleCreateAppointment}>
          <CreateAppointmentButtonText>Agendar</CreateAppointmentButtonText>
        </CreateAppointmentButton>
      </Content>
    </Container>
  );
};

export default CreateAppointment;
