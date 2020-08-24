import React, { useRef, useCallback, useEffect } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Alert,
  TextInput,
  Text,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { useNavigation } from "@react-navigation/native";
import { Form } from "@unform/mobile";
import { FormHandles } from "@unform/core";
import * as Yup from "yup";

// import ImagePicker from "react-native-image-picker";
import * as ImagePicker from "expo-image-picker";

import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
  withMenuContext,
  MenuContextProps,
} from "react-native-popup-menu";

import Button from "../../../../components/Button/Button";
import Input from "../../../../components/Input/Input";

import {
  Container,
  BackButton,
  Title,
  UserAvatarButton,
  UserAvatar,
  Header,
  SignOutButton,
  AvatarIconContainer,
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

const pickerOptions: ImagePicker.ImagePickerOptions = {
  mediaTypes: ImagePicker.MediaTypeOptions.Images,
  allowsEditing: true,
  aspect: [4, 5],
  quality: 1,
};

type ProfileProps = MenuContextProps;

const Profile: React.FC<ProfileProps> = ({ ctx }) => {
  const formRef = useRef<FormHandles>(null);
  const emailInputRef = useRef<TextInput>(null);

  const oldPasswordInputRef = useRef<TextInput>(null);
  const passwordInputRef = useRef<TextInput>(null);
  const passwordConfirmationInputRef = useRef<TextInput>(null);

  const navigation = useNavigation();

  const { user, updateUser, signOut } = useAuth();

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

  const updateAvatarAPI = useCallback(
    (uri: string) => {
      const data = new FormData();

      data.append("avatar", {
        uri,
        type: "image/jpeg",
        name: `${user.id}.jpg`,
      } as any);
      api
        .patch("users/avatar", data)
        .then((apiResponse) => {
          updateUser(apiResponse.data);
        })
        .catch(console.log);
    },
    [updateUser, user.id],
  );

  const handleGoBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleSignOut = useCallback(() => {
    signOut();
  }, [signOut]);

  const handleAvatarUpdateFromGallery = useCallback(async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync(pickerOptions);
      if (!result.cancelled) {
        updateAvatarAPI(result.uri);
      }

      console.log(result);
    } catch (error) {
      console.log(error);
    }
  }, [updateAvatarAPI]);

  const handleAvatarUpdateFromCamera = useCallback(async () => {
    try {
      const result = await ImagePicker.launchCameraAsync(pickerOptions);
      if (!result.cancelled) {
        updateAvatarAPI(result.uri);
      }
    } catch (error) {
      console.log(error);
    }
  }, [updateAvatarAPI]);

  useEffect(() => {
    async function getPermission() {
      if (Platform.OS === "ios") {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== "granted") {
          Alert.alert("Precisamos de acesso a câmera para atualizar o avatar!");
        }
      }
    }
    getPermission();
  }, []);

  return (
    <>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        enabled
        style={{ flex: 1, flexGrow: 1 }}
        contentContainerStyle={{ flex: 1, flexGrow: 1 }}
      >
        <Container keyboardShouldPersistTaps="handled">
          <Header>
            <BackButton onPress={handleGoBack}>
              <Icon name="chevron-left" size={24} color="#999591" />
            </BackButton>
            <Title>Meu perfil</Title>
            <SignOutButton onPress={handleSignOut}>
              <Icon name="power" size={24} color="#999591" />
            </SignOutButton>
          </Header>

          <UserAvatarButton
            onPress={() => {
              ctx?.menuActions.openMenu("imagePickerMenu");
            }}
          >
            <UserAvatar
              source={
                user.avatar_url
                  ? { uri: user.avatar_url }
                  : undefinedProfileImage
              }
            />
            <AvatarIconContainer>
              <Icon name="camera" size={24} color="#312E38" />
            </AvatarIconContainer>
            <Menu name="imagePickerMenu">
              <MenuTrigger />
              <MenuOptions>
                <MenuOption onSelect={handleAvatarUpdateFromCamera}>
                  <Text>Tirar uma foto</Text>
                </MenuOption>
                <MenuOption onSelect={handleAvatarUpdateFromGallery}>
                  <Text>Escolher da galeria</Text>
                </MenuOption>
                <MenuOption text="Cancelar" />
              </MenuOptions>
            </Menu>
          </UserAvatarButton>

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

export default withMenuContext(Profile);

const ImagePickerMenu = () => (
  <Menu name="imagePickerMenu">
    <MenuOptions>
      <MenuOption onSelect={() => alert("Save")} text="Save" />
      <MenuOption onSelect={() => alert("Delete")}>
        <Text style={{ color: "red" }}>Delete</Text>
      </MenuOption>
      <MenuOption
        onSelect={() => alert("Not called")}
        disabled
        text="Disabled"
      />
    </MenuOptions>
  </Menu>
);
