import { Text, StyleSheet, Button } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ProfileTabProps, primaryGray, primaryScarlet, primaryWhite } from "../types";
import { getAuth, signOut } from "firebase/auth";


export default function Profile({route, navigation}: ProfileTabProps){
    const auth = getAuth();
    
    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.h1}>Profile</Text>
            <Button title="logout" onPress={() => {signOut(auth)}}></Button>
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
        height: 70,
        borderRadius: 10,
        margin: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    whiteText: {
        color: primaryWhite,
        fontSize: 18,
    },
})