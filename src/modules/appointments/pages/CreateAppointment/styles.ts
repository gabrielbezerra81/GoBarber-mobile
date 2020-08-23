import styled, { css } from "styled-components/native";
import { getStatusBarHeight } from "react-native-iphone-x-helper";
import { FlatList } from "react-native";
import { RectButton } from "react-native-gesture-handler";
import fonts from "../../../../fonts";
import { Provider } from "../Dashboard/Dashboard";

export const Container = styled.View`
  flex: 1;
`;

export const Header = styled.View`
  padding: 24px;
  background: #28262e;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-top: ${getStatusBarHeight() + 24}px;
`;

Header.displayName = "CreateAppointmentHeader";

export const BackButton = styled.TouchableOpacity``;

export const HeaderTitle = styled.Text`
  color: #f4ede8;
  font-size: 20px;
  font-family: ${fonts.medium};
`;

export const UserAvatar = styled.Image`
  height: 56px;
  width: 56px;
  border-radius: 28px;
`;

export const Content = styled.ScrollView``;

export const ProvidersListContainer = styled.View`
  height: 112px;
  padding: 32px 24px;
`;

export const ProvidersList = styled(FlatList as new () => FlatList<Provider>)``;

interface ProviderContainerProps {
  selected: boolean;
}

export const ProviderContainer = styled(RectButton)<ProviderContainerProps>`
  background: #3e3b47;
  border-radius: 10px;
  flex-direction: row;

  align-items: center;
  padding: 8px 12px;
  margin-right: 16px;

  ${({ selected }) =>
    selected &&
    css`
      background: #ff9000;
    `}
`;

export const ProviderAvatar = styled.Image`
  height: 32px;
  width: 32px;
  border-radius: 16px;
`;

interface ProviderNameProps {
  selected: boolean;
}

export const ProviderName = styled.Text<ProviderNameProps>`
  margin-left: 8px;
  font-family: ${fonts.medium};
  font-size: 16px;
  color: #f4ede8;

  ${({ selected }) =>
    selected &&
    css`
      color: #232129;
    `}
`;

export const Calendar = styled.View``;

export const Title = styled.Text`
  font-size: 24px;
  color: #f4ede8;
  font-family: ${fonts.medium};
  margin: 0 24px 24px;
`;

export const OpenDatePickerButton = styled(RectButton)`
  height: 46px;
  background: #ff9000;
  border-radius: 10px;
  align-items: center;
  justify-content: center;
  margin: 0 24px;
`;

export const OpenDatePickerButtonText = styled.Text`
  font-size: 16px;
  color: #232129;
  font-family: ${fonts.medium};
`;

export const Schedule = styled.View`
  padding: 24px 0 16px;
`;

export const Section = styled.View`
  margin-bottom: 24px;
  padding: 0 24px;
`;

export const SectionTitle = styled.Text`
  font-size: 18px;
  color: #999591;
  font-family: ${fonts.regular};
  margin: 0 0 12px;
`;

export const SectionContent = styled.ScrollView.attrs({
  contentContainerStyle: {
    paddingHorizontal: 0,
  },
  horizontal: true,
  showsHorizontalScrollIndicator: false,
})``;

interface HourProps {
  available: boolean;
  selected: boolean;
}

export const Hour = styled(RectButton)<HourProps>`
  padding: 12px;
  background: #3e3b47;
  border-radius: 10px;
  margin-right: 8px;

  opacity: ${({ available }) => (available ? 1 : 0.3)};

  ${({ selected }) =>
    selected &&
    css`
      background: #ff9000;
    `}
`;

interface HourTextProps {
  selected: boolean;
}

export const HourText = styled.Text<HourTextProps>`
  color: #f4ede8;
  font-family: ${fonts.regular};
  font-size: 16px;

  ${({ selected }) =>
    selected &&
    css`
      color: #232129;
    `}
`;

export const CreateAppointmentButton = styled(RectButton)`
  height: 50px;
  background: #ff9000;
  border-radius: 10px;
  align-items: center;
  justify-content: center;
  margin: 0 24px 24px;
`;

export const CreateAppointmentButtonText = styled.Text`
  font-size: 18px;
  color: #232129;
  font-family: ${fonts.medium};
`;
