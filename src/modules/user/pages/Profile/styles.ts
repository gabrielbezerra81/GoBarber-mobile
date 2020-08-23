import styled from "styled-components/native";
import { Platform } from "react-native";
import fonts from "../../../../fonts";

export const Container = styled.ScrollView.attrs({
  contentContainerStyle: { paddingBottom: 30 },
})`
  flex: 1;
  padding: 0 30px 0;
`;

export const Title = styled.Text`
  font-size: 20px;
  color: #f4ede8;
  font-family: ${fonts.medium};
  margin: 24px 0;
`;

export const BackButton = styled.TouchableOpacity`
  margin-top: ${Platform.OS === "android" ? 40 : 64}px;
  width: 24px;
`;

export const UserAvatarButton = styled.TouchableOpacity`
  margin: 0 auto;
`;

export const UserAvatar = styled.Image`
  height: 186px;
  width: 186px;
  border-radius: 93px;
`;
