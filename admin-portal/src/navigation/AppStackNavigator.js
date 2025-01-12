/**
 * AppStackNavigator.js
 * @author: Pranav Putta
 * @date: 05/31/2020
 */
import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { View, TouchableOpacity } from "react-native";
import { Icon } from "react-native-elements";
import LoginScreen from "../screens/LoginScreen";
import HomeScreen from "../screens/HomeScreen";
import NewItemScreen from "../screens/NewItemScreen";
import EditFieldsScreen from "../screens/EditFieldsScreen";
import UpdateItemScreen from "../screens/UpdateItemScreen"

const Stack = createStackNavigator();

/**
 * app stack navigator
 *
 * @returns creates main navigation container
 */
function AppStackNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          options={{
            headerShown: false,
            gestureDirection: "vertical",
            animationEnabled: true,
          }}
          name={screenKeys.login}
          component={LoginScreen}
        />
        <Stack.Screen
          options={{
            animationEnabled: true,
            gestureDirection: "vertical",
            headerShown: false,
            headerTitle: "Home",
          }}
          name={screenKeys.home}
          component={HomeScreen}
        />
        <Stack.Screen
          options={{
            animationEnabled: true,
            gestureDirection: "vertical",
            headerShown: true,
            headerTitle: "New Doctor",
          }}
          name={screenKeys.newItem}
          component={NewItemScreen}
        />
        <Stack.Screen
          options={{
            animationEnabled: true,
            gestureDirection: "vertical",
            headerShown: true,
            headerTitle: "Edit Doctor Fields",
          }}
          name={screenKeys.editFields}
          component={EditFieldsScreen}
        />
        <Stack.Screen
          options={{
            animationEnabled: true,
            gestureDirection: "vertical",
            headerShown: true,
            headerTitle: "Update Item",
          }}
          name={screenKeys.updateItem}
          component={UpdateItemScreen}
        />
        
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export const screenKeys = {
  login: "loginscreen",
  home: "homescreen",
  newItem: "newitem",
  editFields: "editfields",
  updateItem: "updateItem"
};

export default AppStackNavigator;
