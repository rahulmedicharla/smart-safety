import {View, Text, StyleSheet} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import { LoginStackProps } from '../types';

import {TextInput, TouchableOpacity} from 'react-native-gesture-handler';

import { primaryGray, primaryScarlet, primaryWhite } from '../types';
import { useState } from 'react';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

export default function Login({route, navigation}: LoginStackProps){

    const auth = getAuth();

    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [error, setError] = useState<null | String>(null)

    const login = (email: string, password: string) => {
        if (email == '' || password == ''){
            setError('Please enter an email and password')
        }
        else if(!email.includes('osu.edu')){
            setError('Please enter an OSU email')
        }
        else{
            signInWithEmailAndPassword(auth, email, password).catch((error) => {
                setError(error.message)
            })}
    }

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.h2}>Login using your OSU email</Text>
            {styles.error ? (
                <Text style={styles.error}>{error}</Text>
            ):null}
            <TextInput style={styles.input} keyboardType='email-address' placeholder='Email' onChangeText={(text) => setEmail(text)}/>
            <TextInput secureTextEntry style={styles.input} placeholder='Password' onChangeText={(text) => setPassword(text)}/>
            <TouchableOpacity style={styles.redButton} onPress={() => {login(email, password)}}>
                <Text style={styles.whiteText}>Login</Text>
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
        fontSize: 20,
        fontWeight: 'bold',
        margin: 10
    },
    redButton: {
        backgroundColor: primaryScarlet,
        width: 225,
        height: 60,
        borderRadius: 10,
        margin: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    whiteText: {
        color: primaryWhite,
        fontSize: 18,
    },
    input: {
        backgroundColor: primaryWhite,
        width: 225,
        height: 50,
        borderRadius: 10,
        margin: 10,
        padding: 10
    },
    error: {
        color: primaryScarlet,
        fontSize: 15,
        margin: 5
    }
})