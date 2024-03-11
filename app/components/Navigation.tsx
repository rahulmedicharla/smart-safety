import { NavigationContainer } from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

import Landing from './Landing/Landing';
import Login from './Login/Login';
import Register from './Register/Register';
import { RootStackParamList, RootTabsParamList, primaryGray, primaryScarlet } from './types';
import Present from './Present/Present';
import Past from './Past/Past';
import Future from './Future/Future';
import Profile from './Profile/Profile';

import Icon from 'react-native-paper/src/components/Icon'
import { getDatabase } from 'firebase/database';


const Stack = createStackNavigator<RootStackParamList>();
const Tabs = createBottomTabNavigator<RootTabsParamList>();

export default function Navigation(){

    const auth = getAuth();
    const db = getDatabase();

    const [isLoggedIn, setIsLoggedIn] = useState(false)
    
    useEffect(() => {
        const listener = onAuthStateChanged(auth, (user) => {
            if(user){
                setIsLoggedIn(true)
            }else{
                setIsLoggedIn(false)
            }
        })
        
        return listener;
    }, [])

    return (
        <NavigationContainer>
            {!isLoggedIn ? (
                <Stack.Navigator initialRouteName='Landing'>
                    <Stack.Screen name ="Landing" component = {Landing} options={{headerShown: false}}/>
                    <Stack.Screen name="Login" component={Login} options={{headerBackTitleVisible: false, headerStyle: {backgroundColor: primaryGray}}} />
                    <Stack.Screen name="Register" component={Register} options={{headerBackTitleVisible: false, headerStyle: {backgroundColor: primaryGray}}} />
                </Stack.Navigator>
            ):(
                <Tabs.Navigator initialRouteName='Present' screenOptions={{tabBarStyle: {backgroundColor: primaryGray}}}>
                    <Tabs.Screen name="Present" component={Present} options={{tabBarShowLabel: false,headerShown: false, tabBarLabel: "Home", tabBarActiveTintColor: primaryScarlet ,tabBarIcon: ({size, color}) => (<Icon size={size+5} color={color} source="map-marker-outline"></Icon>)}} />
                    <Tabs.Screen name="Past" component={Past} options={{tabBarShowLabel: false,headerShown: false, tabBarActiveTintColor: primaryScarlet,tabBarIcon: ({size, color}) => (<Icon size={size + 5} color={color} source="finance"></Icon>)}} />
                    <Tabs.Screen name="Future" component={Future} options={{tabBarShowLabel: false,headerShown: false, tabBarActiveTintColor: primaryScarlet ,tabBarIcon: ({size, color}) => (<Icon size={size + 5} color={color} source="navigation-outline"></Icon>)}} />
                    <Tabs.Screen name = "Profile" component={Profile} options={{tabBarShowLabel: false,headerShown: false, tabBarActiveTintColor: primaryScarlet ,tabBarIcon: ({size, color}) => (<Icon size={size + 5} color={color} source="account"></Icon>)}} />
                </Tabs.Navigator>
            )}
        </NavigationContainer>
    )
}