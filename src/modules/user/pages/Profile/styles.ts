import styled from "styled-components/native";
import { Platform } from "react-native";
import fonts from "../../../../fonts";

export const Container = styled.ScrollView.attrs({
  contentContainerStyle: { paddingBottom: 30 },
})`
  flex: 1;
  padding: 0 30px 0;
`;

export const Header = styled.View`
  justify-content: space-between;
  flex-direction: row;
  margin-top: ${Platform.OS === "android" ? 40 : 64}px;
  margin-bottom: 32px;
`;

export const BackButton = styled.TouchableOpacity`
  width: 24px;
`;

export const SignOutButton = styled.TouchableOpacity``;

export const Title = styled.Text`
  font-size: 20px;
  color: #f4ede8;
  font-family: ${fonts.medium};
`;

export const UserAvatarButton = styled.TouchableOpacity`
  margin: 0 auto 32px;
  position: relative;
`;

export const UserAvatar = styled.Image`
  height: 186px;
  width: 186px;
  border-radius: 93px;
`;

export const AvatarIconContainer = styled.View`
  width: 48px;
  height: 48px;
  background-color: #ff9000;
  border-radius: 24px;
  align-items: center;
  justify-content: center;
  position: absolute;
  bottom: 0;
  right: 0;
`;
