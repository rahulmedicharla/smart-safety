import {View, Text, StyleSheet} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import { LandingStackProps, primaryWhite } from '../types';
import { TouchableOpacity } from 'react-native-gesture-handler';

import {Image} from 'expo-image'
import { primaryGray, primaryScarlet } from '../types';


export default function Landing({route, navigation}: LandingStackProps){
    const logo = require('./osu.png')
    
    return (
        <SafeAreaView style={styles.container}>
                <Image source={logo} style={styles.logo}/>
                <Text style={styles.h1}>Welcome to Smart Safety</Text>
                <Text style={styles.h2}>Please login or register to continue</Text>
                <TouchableOpacity style={styles.redButton} onPress={() => navigation.navigate('Login')}>
                    <Text style={styles.whiteText}>Login</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.redButton} onPress={() => navigation.navigate('Register')}>
                    <Text style={styles.whiteText}>Register</Text>
                </TouchableOpacity>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: primaryGray,
        alignItems: 'center',
        justifyContent:'center'
    },
    h1: {
        fontSize: 30,
        fontWeight: 'bold',
        margin: 10
    },
    h2: {
        fontSize: 18,
        fontWeight: 'bold',
        margin: 10
    },
    redButton: {
        backgroundColor: primaryScarlet,
        width: 225,
        height: 60,
        borderRadius: 15,
        margin: 12,
        alignItems: 'center',
        justifyContent: 'center'
    },
    whiteText: {
        color: primaryWhite,
        fontSize: 18,
    },
    logo:{
        width: 200,
        height: 200,
        margin: 20
    }
})
