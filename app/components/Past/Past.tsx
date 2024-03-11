import { Text, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { PastTabProps, crimeZone, primaryGray, primaryScarlet, primaryWhite } from "../types";
import MapView, { Circle, Marker } from "react-native-maps";
import { useEffect, useState } from "react";
import * as Location from 'expo-location';


export default function Past({route, navigation}: PastTabProps){

    const zones = require('./zones.json')

    const [location, setLocation] = useState<Location.LocationObject>();
    const [risk, setRisk] = useState<number>(-1);

    const colorMapping = {
        0: 'green',
        1: 'yellow',
        2: 'red'
    }

    useEffect(() => {
        console.log(risk)
    }, [risk])

    useEffect(() => {
        (async () => {
      
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
              return;
            }
            
            let location = await Location.getCurrentPositionAsync({});
            setLocation(location)

            const lat = String(location.coords.latitude);
            const long = String(location.coords.longitude);
            const time = String(new Date().getHours());

            fetch("https://0b50-2603-6010-4b02-1dff-188b-9e7e-7c7e-d6d2.ngrok.io/" + lat + "/" + long + "/" + time).then((response) => response.json()).then((json) => {
                console.log(json)
                if (json < 10){
                    setRisk(0)
                }else if(json < 20){
                    setRisk(1)
                }else{
                    setRisk(2)
                }
            }).catch((error) => {
                console.log(error)
            
            })     

          })();     
    
    }, [])
    
    return (
        <View style={styles.container}>

            {risk == 0 ? (
                <View style={styles.riskContainer}>
                    <Text style={styles.h1}>Low Risk</Text>
                    <Text style={styles.h2}>You are at low risk. You are safe to go outside.</Text>
                </View>
            ):null}

            {risk === 1 ? (
                <View style={styles.riskContainer}>
                    <Text style={styles.h1}>Medium Risk</Text>
                    <Text style={styles.h2}>You are at medium risk. You are safe to go outside, but be careful.</Text>
                </View>
            ):null}

            {risk === 2 ? (
                <View style={styles.riskContainer}>
                    <Text style={styles.h1}>High Risk</Text>
                    <Text style={styles.h2}>You are at high risk. You should stay inside.</Text>
                </View>
            ):null}

            <MapView showsUserLocation showsPointsOfInterest rotateEnabled={false} style={styles.map} onRegionChangeComplete={(region) => {console.log(region)}}  initialRegion={
                {"latitude": 39.99706236315766, "latitudeDelta": 0.04715821594454894, "longitude": -83.01356221441546, "longitudeDelta": 0.033436813553080924}}
                >

                    {zones.map((zone: crimeZone, index: number) => {
                        return (
                            <Circle key={index} fillColor="rgba(255, 150, 185, 0.4)" strokeColor="rgba(255, 174, 185, 0.1)" center={{
                                latitude: zone.lat,
                                longitude: zone.lng
                            }} radius={zone.radius * 8000}>
                            </Circle>
                        )
                    })}

            </MapView>
        </View>

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
        fontSize: 20,
        fontWeight: 'bold',
        margin: 10,
        color: 'green'
    },
    h2: {
        fontSize: 14,
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
    map: {
        width: '100%',
        height: '100%'
    },
    riskContainer: {
        position: 'absolute',
        top: '10%',
        width: '90%',
        backgroundColor: primaryWhite,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        zIndex: 10,
        borderRadius: 10,
        borderColor: 'green',
        borderWidth: 2,
        shadowColor: 'green',
    }
})