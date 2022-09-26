import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  SafeAreaView,
  StatusBar,
} from "react-native";
import MapView from "react-native-maps";
import * as Location from "expo-location";
import { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Provider } from "react-redux";
import store from "./utils/redux/store";
import pages, { authPages } from "./pages";
import { me } from "./utils/redux/actions";
import { useDispatch } from "react-redux";
import { Storage } from "expo-storage";
import { useSelector } from "react-redux";

const Stack = createNativeStackNavigator();

const Head = () => {
  const dispatch = useDispatch();
  const [isLogin, setLogin] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const data = useSelector((state) => state.mainReducer.isLogin);
  useEffect(() => {
    setLoading(true)
    dispatch(me());
    setLoading(false)
  }, []);

  return isLoading ? (
    <Text>Loading...</Text>
  ) : (
    <NavigationContainer>
      <Stack.Navigator>
        {data
          ? pages.map((e, i) => (
              <Stack.Screen
                key={i}
                name={e.name}
                options={{ headerShown: false }}
                component={e.component}
              />
            ))
          : authPages.map((e, i) => (
              <Stack.Screen
                key={i}
                name={e.name}
                options={{ headerShown: false }}
                component={e.component}
              />
            ))}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <Provider store={store}>
      <Head />
    </Provider>
  );
}
