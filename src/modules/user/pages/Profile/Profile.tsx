import React, { useRef, useCallback } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  View,
  Alert,
  TextInput,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { useNavigation } from "@react-navigation/native";
import { Form } from "@unform/mobile";
import { FormHandles } from "@unform/core";
import * as Yup from "yup";

import Button from "../../../../components/Button/Button";
import Input from "../../../../components/Input/Input";

import {
  Container,
  BackButton,
  Title,
  UserAvatarButton,
  UserAvatar,
} from "./styles";
import getValidationErrors from "../../../../utils/getValidationErrors";
import api from "../../../../services/api";
import { useAuth } from "../../../../context/authContext";

import undefinedProfileImage from "../../../../assets/undefinedProfilePicture.png";

interface ProfileFormData {
  name: string;
  email: string;
  old_password: string;
  password: string;
  password_confirmation: string;
}

const Profile: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const emailInputRef = useRef<TextInput>(null);

  const oldPasswordInputRef = useRef<TextInput>(null);
  const passwordInputRef = useRef<TextInput>(null);
  const passwordConfirmationInputRef = useRef<TextInput>(null);

  const navigation = useNavigation();

  const { user, updateUser } = useAuth();

  const handleProfileUpdate = useCallback(
    async (data: ProfileFormData) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          name: Yup.string().required("Nome obrigatório"),
          email: Yup.string()
            .email("Digite um e-mail válido")
            .required("E-mail obrigatório"),
          old_password: Yup.string(),
          password: Yup.string().when("old_password", {
            is: (val) => !!val,
            then: Yup.string().required("Campo obrigatório"),
            otherwise: Yup.string().max(0, "Preencha a senha atual"),
          }),
          password_confirmation: Yup.string()
            .when("old_password", {
              is: (val) => !!val,
              then: Yup.string().required("Campo obrigatório"),
              otherwise: Yup.string().max(0, "Preencha a senha atual"),
            })
            .oneOf([Yup.ref("password")], "Confirmação incorreta"),
        });
        await schema.validate(data, { abortEarly: false });

        const {
          email,
          name,
          old_password,
          password,
          password_confirmation,
        } = data;

        const formData = {
          name,
          email,
          ...(old_password
            ? { old_password, password, password_confirmation }
            : {}),
        };

        const response = await api.put("profile", formData);

        await updateUser(response.data);

        Alert.alert("Perfil atualizado com sucesso!");

        navigation.goBack();
      } catch (error) {
        if (error instanceof Yup.ValidationError) {
          const errors = getValidationErrors(error);
          formRef.current?.setErrors(errors);
          return;
        }
        Alert.alert(
          "Erro na atualização do perfil",
          "Ocorreu um erro ao atualizar seu perfil, tente novamente.",
        );
      }
    },
    [navigation, updateUser],
  );

  const handleGoBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  return (
    <>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        enabled
        style={{ flex: 1, flexGrow: 1 }}
        contentContainerStyle={{ flex: 1, flexGrow: 1 }}
      >
        <Container keyboardShouldPersistTaps="handled">
          <BackButton onPress={handleGoBack}>
            <Icon name="chevron-left" size={24} color="#999591" />
          </BackButton>

          <UserAvatarButton>
            <UserAvatar
              source={
                user.avatar_url
                  ? { uri: user.avatar_url }
                  : undefinedProfileImage
              }
            />
          </UserAvatarButton>

          <View>
            <Title>Meu perfil</Title>
          </View>

          <Form
            initialData={{ name: user.name, email: user.email }}
            ref={formRef}
            onSubmit={handleProfileUpdate}
          >
            <Input
              name="name"
              icon="user"
              placeholder="Nome"
              autoCorrect={false}
              autoCapitalize="words"
              returnKeyType="next"
              onSubmitEditing={() => {
                emailInputRef.current?.focus();
              }}
            />
            <Input
              ref={emailInputRef}
              name="email"
              icon="mail"
              placeholder="E-mail"
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              returnKeyType="next"
              onSubmitEditing={() => {
                oldPasswordInputRef.current?.focus();
              }}
            />
            <Input
              ref={oldPasswordInputRef}
              containerStyle={{ marginTop: 16 }}
              name="old_password"
              icon="lock"
              placeholder="Senha atual"
              secureTextEntry
              returnKeyType="next"
              onSubmitEditing={() => {
                passwordInputRef.current?.focus();
              }}
            />
            <Input
              ref={passwordInputRef}
              name="password"
              icon="lock"
              placeholder="Nova senha"
              secureTextEntry
              returnKeyType="next"
              onSubmitEditing={() => {
                passwordConfirmationInputRef.current?.focus();
              }}
            />
            <Input
              ref={passwordConfirmationInputRef}
              name="password_confirmation"
              icon="lock"
              placeholder="Confirmar senha"
              secureTextEntry
              returnKeyType="send"
              onSubmitEditing={() => {
                formRef.current?.submitForm();
              }}
            />
          </Form>

          <Button
            onPress={() => {
              formRef.current?.submitForm();
            }}
          >
            Confirmar mudanças
          </Button>
        </Container>
      </KeyboardAvoidingView>
    </>
  );
};

export default Profile;
