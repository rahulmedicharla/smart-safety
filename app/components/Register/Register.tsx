import {View, Text, StyleSheet} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import { RegisterStackProps } from '../types';

import {TextInput, TouchableOpacity} from 'react-native-gesture-handler';

import { primaryGray, primaryScarlet, primaryWhite } from '../types';
import { useState } from 'react';
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';

export default function Register({route, navigation}: RegisterStackProps){

    const auth = getAuth();

    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [confirmPassword, setConfirmPassword] = useState<string>('')
    const [error, setError] = useState<null | String>(null)


    const register = (email: string, password: string, confirmPassword: string) => {
        if (email == '' || password == '' || confirmPassword == ''){
            setError('Please enter an email and password')
        }
        else if(password != confirmPassword){
            setError('Passwords do not match')
        }
        else if(!email.includes('osu.edu')){
            setError('Please enter an OSU email')
        }
        else{
            createUserWithEmailAndPassword(auth, email, password).catch((error) => {
                setError(error.message)
            })}
    }

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.h2}>Register  using your OSU email</Text>
            {styles.error ? (
                <Text style={styles.error}>{error}</Text>
            ):null}
            <TextInput style={styles.input} placeholder='Email' onChangeText={(text) => setEmail(text)}/>
            <TextInput style={styles.input} secureTextEntry placeholder='Password' onChangeText={(text) => setPassword(text)}/>
            <TextInput style={styles.input} secureTextEntry placeholder='Confirm Password' onChangeText={(text) => setConfirmPassword(text)}/>
            <TouchableOpacity style={styles.redButton} onPress={() => {register(email, password, confirmPassword)}}>
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