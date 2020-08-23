import styled from "styled-components/native";
import { RectButton } from "react-native-gesture-handler";
import fonts from "../../../../fonts";

export const Container = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: 0 24px;
`;

export const Title = styled.Text`
  color: #f4ede8;
  font-size: 32px;
  font-family: ${fonts.medium};
  text-align: center;
  margin-top: 32px;
`;

export const Description = styled.Text`
  font-family: ${fonts.regular};
  font-size: 18px;
  color: #999591;
  text-align: center;
  margin-top: 16px;
`;

export const OkButton = styled(RectButton)`
  background: #ff9000;
  border-radius: 10px;
  padding: 12px 24px;
  margin-top: 32px;
`;

export const OkButtonText = styled.Text`
  color: #312e38;
  font-family: ${fonts.medium};
  font-size: 18px;
`;
