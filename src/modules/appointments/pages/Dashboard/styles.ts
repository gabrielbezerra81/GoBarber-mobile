import styled from "styled-components/native";
import { FlatList } from "react-native";
import { getStatusBarHeight } from "react-native-iphone-x-helper";
import { RectButton } from "react-native-gesture-handler";
import { Provider } from "./Dashboard";
import fonts from "../../../../fonts";

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

export const HeaderTitle = styled.Text`
  color: #f4ede8;
  font-size: 20px;
  line-height: 28px;
  font-family: ${fonts.regular};
`;

export const UserName = styled.Text`
  color: #ff9000;
  font-family: ${fonts.medium};
`;

export const ProfileButton = styled.TouchableOpacity``;

export const UserAvatar = styled.Image`
  height: 56px;
  width: 56px;
  border-radius: 28px;
`;

export const ProvidersList = styled(FlatList as new () => FlatList<Provider>)`
  padding: 32px 24px 16px;
`;

export const ProvidersListTitle = styled.Text`
  font-size: 24px;
  color: #f4ede8;
  margin-bottom: 24px;
  font-family: ${fonts.medium};
`;

export const ProviderContainer = styled(RectButton)`
  background: #3e3b47;
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 16px;
  flex-direction: row;
  align-items: center;
`;
export const ProviderAvatar = styled.Image`
  height: 72px;
  width: 72px;
  border-radius: 36px;
`;
export const ProviderInfo = styled.View`
  flex: 1;
  margin-left: 20px;
`;

export const ProviderName = styled.Text`
  color: #f4ede8;
  font-family: ${fonts.medium};
  font-size: 18px;
`;
export const ProviderMeta = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: 8px;
`;

export const ProviderMetaText = styled.Text`
  color: #999591;
  margin-left: 8px;
  font-family: ${fonts.regular};
`;
