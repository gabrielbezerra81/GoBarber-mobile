import React, {
  createContext,
  useContext,
  useCallback,
  useState,
  useEffect,
} from "react";
import AsyncStorage from "@react-native-community/async-storage";
import createAuthRefreshInterceptor from "axios-auth-refresh";
import moment from "moment";
import api from "../services/api";
import usePrevious from "../utils/usePrevious";

interface User {
  id: string;
  name: string;
  email: string;
  avatar_url: string;
}

interface AuthState {
  token: string;
  user: User;
  refreshToken: string;
  tokenDate: Date;
}

interface SignInCredentials {
  email: string;
  password: string;
}

interface AuthContextData {
  user: User;
  signIn(credentials: SignInCredentials): Promise<void>;
  signOut(): void;
  updateUser(user: User): Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

const expiresIn = 30000;
const defaultMin = 5000;
const intervalTime = expiresIn - defaultMin;

const AuthProvider: React.FC = ({ children }) => {
  const [data, setData] = useState<AuthState>({} as AuthState);
  const [loading, setLoading] = useState(true);

  const [interceptorID, setInterceptorID] = useState(-1);

  useEffect(() => {
    async function loadStoragedData() {
      const [token, user, refreshToken] = await AsyncStorage.multiGet([
        "@GoBarber:token",
        "@GoBarber:user",
        "@GoBarber:refreshToken",
      ]);

      if (token[1] && user[1] && refreshToken[1]) {
        const tokenObject = JSON.parse(token[1]);

        api.defaults.headers.authorization = `Bearer ${tokenObject.token}`;

        setData({
          token: tokenObject.token,
          tokenDate: tokenObject.creationDate,
          user: JSON.parse(user[1]),
          refreshToken: refreshToken[1],
        });
      }

      setLoading(false);
    }

    loadStoragedData();
  }, []);

  const signIn = useCallback(async ({ email, password }) => {
    const response = await api.post("sessions", { email, password });

    const { token, user, refreshToken } = response.data;

    const tokenCreationDate = new Date(token.creationDate);

    await AsyncStorage.multiSet([
      ["@GoBarber:token", JSON.stringify(token)],
      ["@GoBarber:user", JSON.stringify(user)],
      ["@GoBarber:refreshToken", refreshToken],
    ]);

    api.defaults.headers.authorization = `Bearer ${token.token}`;

    setData({
      token: token.token,
      user,
      refreshToken,
      tokenDate: tokenCreationDate,
    });
  }, []);

  const signOut = useCallback(async () => {
    await AsyncStorage.multiRemove([
      "@GoBarber:token",
      "@GoBarber:user",
      "@GoBarber:refreshToken",
    ]);
    setData({} as AuthState);
  }, []);

  const updateUser = useCallback(
    async (user: User) => {
      await AsyncStorage.setItem("@GoBarber:user", JSON.stringify(user));

      setData({
        refreshToken: data.refreshToken,
        token: data.token,
        user,
        tokenDate: data.tokenDate,
      });
    },
    [data.token, data.refreshToken, data.tokenDate],
  );

  const fetchNewTokenOnAPIError = useCallback(
    async (failedRequest: any, authData) =>
      api
        .post("sessions/token", { refreshToken: authData.refreshToken })
        .then(async (tokenRefreshResponse) => {
          const { token: newToken } = tokenRefreshResponse.data;

          await AsyncStorage.setItem(
            "@GoBarber:token",
            JSON.stringify(newToken),
          );

          setData((oldData) => ({
            ...oldData,
            token: newToken.token,
            tokenDate: newToken.creationDate,
          }));

          api.defaults.headers.authorization = `Bearer ${newToken.token}`;

          failedRequest.response.config.headers.Authorization = `Bearer ${newToken.token}`;
        }),
    [],
  );

  const fetchNewToken = useCallback(() => {
    api
      .post("sessions/token", { refreshToken: data.refreshToken })
      .then(async (tokenRefreshResponse) => {
        const { token: newToken } = tokenRefreshResponse.data;

        await AsyncStorage.setItem("@GoBarber:token", JSON.stringify(newToken));

        setData((oldData) => ({ ...oldData, token: newToken.token }));

        api.defaults.headers.authorization = `Bearer ${newToken.token}`;
      });
  }, [data.refreshToken]);

  const previousInterceptorID = usePrevious(interceptorID);

  useEffect(() => {
    if (previousInterceptorID && previousInterceptorID > 0) {
      api.interceptors.response.eject(previousInterceptorID);
    }

    if (data.refreshToken) {
      const id =
        createAuthRefreshInterceptor(api, (failedRequest) =>
          fetchNewTokenOnAPIError(failedRequest, data),
        ) + 1;

      setInterceptorID(id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, fetchNewTokenOnAPIError]);

  useEffect(() => {
    let tokenInterval: NodeJS.Timeout;
    let tokenTimer: NodeJS.Timeout;

    if (data.tokenDate && data.refreshToken) {
      const timeLeft =
        expiresIn / 1000 - moment(new Date()).diff(data.tokenDate, "seconds");

      // deve buscar um novo token agora se faltar 5s ou menos para expirar
      const shouldFetchNow = timeLeft <= defaultMin / 1000;

      const interval = timeLeft * 1000 - defaultMin;

      // O intervalo padrão para buscar tokens é de 25s
      tokenInterval = setInterval(() => {
        fetchNewToken();
      }, intervalTime);

      // Se faltar mais do que 5s, por exemplo 13s, irá executar a busca por um novo
      // token na diferença entre esses tempos, ou seja, 8s. E para a atualização
      // continuar a cada 25s, o intervalo é excluído e setado novamente junto com o
      // timeout de 8s, ou seja, o intervalo continuará normalmente a cada 25s depois
      // dos 8s.
      if (!shouldFetchNow) {
        if (tokenInterval) {
          clearInterval(tokenInterval);
        }

        tokenTimer = setTimeout(() => {
          fetchNewToken();
          tokenInterval = setInterval(() => {
            fetchNewToken();
          }, intervalTime);
        }, interval);
      }

      if (shouldFetchNow) {
        fetchNewToken();
      }
    }

    return () => {
      if (tokenInterval) {
        clearInterval(tokenInterval);
      }
      if (tokenTimer) {
        clearTimeout(tokenTimer);
      }
    };
  }, [fetchNewToken, data.refreshToken, data.tokenDate]);

  return (
    <AuthContext.Provider
      value={{
        user: data.user,
        signIn,
        signOut,
        loading,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within a AuthProvider");
  }
  return context;
};
