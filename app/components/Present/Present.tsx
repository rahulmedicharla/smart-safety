import { Text, StyleSheet, View, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { PresentTabProps, newMapMarker, primaryGray, primaryScarlet, primaryWhite } from "../types";
import MapView, { Callout, CalloutSubview, Marker } from "react-native-maps";
import { useState, useEffect } from "react";
import * as Location from 'expo-location';
import {FAB, Portal, PaperProvider, Icon} from 'react-native-paper';
import { TouchableOpacity } from "react-native";

import { getDatabase, onValue, ref, set } from "firebase/database";

export default function Present({route, navigation}: PresentTabProps){

    const [open, setOpen] = useState<boolean>(false);
    const onStateChange = ({open}:{open:boolean}) => setOpen(open);
    const d = new Date()
    d.setDate(28)
    d.setHours(21)

    const colorMapping = {
        'harassment': '#41b6e6',
        'break-in': '#830065',
        'assault': '#ff6a39',
        'theft': '#ffb600'
    }

    const [newCrimeMarker, setNewCrimeMarker] = useState<newMapMarker>({
        status: 'base'
    });

    const [alerts, setAlerts] = useState<newMapMarker[]>([]);

    const [description, setDescription] = useState("")

    useEffect(() => {
        setNewCrimeMarker({
            ...newCrimeMarker,
            description: description
        })
    }, [description])

    const setMarker = () => {

        const db = getDatabase();
        set(ref(db, 'alerts/' + newCrimeMarker.date!), newCrimeMarker).then(() => {
            setNewCrimeMarker({
                status: 'base'
            })
            setDescription("")
        });

    }

    useEffect(() => {
        const db = getDatabase();
        const alertsRef = ref(db, 'alerts/');

        const listener = onValue(alertsRef, (snapshot) => {
            const data = snapshot.val();

            if(data){
                setAlerts(Object.values(data));
            }
        });

        return listener
    }, [])

    const resetMarker = () => {
        setNewCrimeMarker({
            status: 'base'
        })
        setDescription("")
    }

    const selectMarker = (type: 'harassment' | 'break-in' | 'assault' | 'theft') => {
        setNewCrimeMarker({
            status: 'place',
            type: type
        })
    }

    const placeMarker = (region: any) => {
        setNewCrimeMarker({
            ...newCrimeMarker,
            status: 'confirm',
            location: region,
            date: d.toString()
        })
    }

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
              return;
            }
          })();     
    }, [])

    return (
        <View style={styles.container}> 
            {newCrimeMarker.status === 'place' ? (
                <View style={styles.floatingText}>
                    <Text style={styles.redText}>Tap to set the marker</Text>
                </View>
            ):null}

            {newCrimeMarker.status === 'confirm' ? (
                <View style={styles.floatingText}>
                    <Text style={styles.redText}>Tap on marker to confirm</Text>
                </View>
            ):null}

            {newCrimeMarker.status === 'confirm' ? (
                <TextInput style={styles.input} placeholder="Enter a short description" value={description} onChangeText={text => setDescription(text)}></TextInput>
            ):null}

            <MapView showsUserLocation showsPointsOfInterest rotateEnabled={false} style={styles.map}  initialRegion={
                {"latitude": 39.99706236315766, "latitudeDelta": 0.04715821594454894, "longitude": -83.01356221441546, "longitudeDelta": 0.033436813553080924}
                }
                
                onPress={(region) => {
                    if (newCrimeMarker.status === 'place'){
                        placeMarker({
                            latitude: region.nativeEvent.coordinate.latitude,
                            longitude: region.nativeEvent.coordinate.longitude
                        })
                    }
                }}
                >

                    {alerts !== null && alerts.map((alert, index) => {
                        return (
                            <Marker key={index} coordinate={{
                                latitude: alert.location?.latitude!,
                                longitude: alert.location?.longitude!
                            }} pinColor={colorMapping[alert.type!]}>
                                <Callout tooltip>
                                    <View style={styles.calloutDesign}>
                                        <Text style={styles.titleCalloutText}>New {alert.type} alert</Text>
                                        <Text style={styles.calloutText}>{alert.description}</Text>
                                        <Text style={styles.calloutText}>on {d.toLocaleDateString()}</Text>
                                        <Text style={styles.calloutText}>@ {alert.date?.split(" ")[4]}</Text>
                                    </View>
                                </Callout>
                            </Marker>
                        )
                    })}

                    <Marker coordinate={{
                        latitude: newCrimeMarker.location?.latitude!,
                        longitude: newCrimeMarker.location?.longitude!
                    }}>
                        <Callout tooltip>
                            <View style={styles.calloutDesign}>
                                <CalloutSubview onPress={() => {resetMarker()}}>
                                    <Icon source="close" size={30} />
                                </CalloutSubview>
                                <Text style={styles.titleCalloutText}>New {newCrimeMarker.type} alert</Text>
                                <Text style={styles.calloutText}>on {d.toLocaleDateString()}</Text>
                                <Text style={styles.calloutText}>@ {d.toLocaleTimeString()}</Text>
                                <CalloutSubview onPress={() => {setMarker()}}>
                                    <TouchableOpacity style={styles.redButton}>
                                        <Text style={styles.whiteText}>Confirm</Text>
                                    </TouchableOpacity>
                                </CalloutSubview>
                            </View>
                        </Callout>
                    </Marker>

                </MapView>

            {/* //create the fab.GROUP action floating button */}
            <Portal>
                <FAB.Group
                fabStyle={styles.fabBackground}
                style = {styles.actionButton}
                color={primaryScarlet}
                open={open}
                visible
                label="Crime alert"
                icon={open ? 'map-marker' : 'plus'}
                actions={[
                    {
                    icon: 'currency-usd',
                    label: 'Theft',
                    onPress: () => {selectMarker('theft')},
                    style: {backgroundColor: primaryWhite},
                    },
                    {
                    icon: 'boxing-glove',
                    label: 'Assault',
                    onPress: () => {selectMarker('assault')},
                    style: {backgroundColor: primaryWhite},
                    },
                    {
                    icon: 'lock-alert',
                    label: 'Break-in',
                    onPress: () => {selectMarker('break-in')},
                    style: {backgroundColor: primaryWhite},
                    },
                    {
                    icon: 'heart-broken',
                    label: 'Harassment',
                    onPress: () => {selectMarker('harassment')},
                    style: {backgroundColor: primaryWhite},
                    },
                ]}
                onStateChange={onStateChange}
                />
            </Portal>
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
        width: 150,
        height: 50,
        borderRadius: 10,
        margin: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    redText: {
        color: primaryScarlet,
        fontSize: 15,
        fontWeight: 'bold',
    },
    map: {
        width: '100%',
        height: '100%'
    },
    actionButton:{
        bottom: 40,
        right: 0,
    },
    fabBackground: {
        backgroundColor: primaryWhite,
    },
    floatingText: {
        position: 'absolute',
        top: '7%',
        left: '35%',
        backgroundColor: primaryWhite,
        padding: 10,
        borderRadius: 10,
        zIndex: 10,
    },
    calloutDesign: {
        backgroundColor: primaryWhite,
        padding: 10,
        borderRadius: 10,
        zIndex: 10,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
    },
    calloutText: {
        fontSize: 17,
    },
    titleCalloutText: {
        fontSize: 17,
        fontWeight: 'bold',
        color: primaryScarlet
    },
    whiteText: {
        color: primaryWhite,
        fontSize: 16,
    },
    input: {
        backgroundColor: primaryWhite,
        width: '90%',
        height: 50,
        borderRadius: 10,
        margin: 10,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        fontSize: 15,
        fontWeight: 'bold',
        position: 'absolute',
        top: '13%',
        left: '3%',
        zIndex: 10,
    }
})