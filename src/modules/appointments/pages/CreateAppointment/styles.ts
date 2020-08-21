import styled from "styled-components/native";
import { getStatusBarHeight } from "react-native-iphone-x-helper";
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
