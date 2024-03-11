import { Text, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Destination, FutureTabProps, crimeZone, newMapMarker, primaryGray, primaryScarlet, primaryWhite } from "../types";
import MapView, {Marker, Callout, Circle, Polyline as P, LatLng} from 'react-native-maps'
import { useEffect, useState } from "react";
import * as Location from 'expo-location';
import { onValue, getDatabase, ref, set } from "firebase/database";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import Polyline from '@mapbox/polyline'
import { zones } from "./zones";
import { api_key } from "./api_key";

export default function Future({route, navigation}: FutureTabProps){

    
    const [location, setLocation] = useState<Location.LocationObject>();
    const [crimeMarkers, setCrimeMarkers] = useState<newMapMarker[]>([]);
    const [destination, setDestination] = useState<string>()
    const [selectedRoute, setSelectedRoute] = useState<Array<LatLng>>()
    const [selectedMarker, setSelectedMarker] = useState<{
        latitude: number,
        longitude: number
    }>()
    
    const colorMapping = {
        'harassment': '#41b6e6',
        'break-in': '#830065',
        'assault': '#ff6a39',
        'theft': '#ffb600'
    }      

    useEffect(() => {
        if(destination !== undefined){
            fetch("https://maps.googleapis.com/maps/api/directions/json?destination=place_id:" + destination + "&origin=" + location?.coords.latitude + "," + location?.coords.longitude + "&key=" + api_key + "&mode=walking&alternatives=true").then((response) => {
                response.json().then((data) => {
                    const altroutes = data.routes

                    const markers = crimeMarkers

                    console.log("length",altroutes.length)
                    //choose the route that is furthest from the markers

                    altroutes.forEach((route:any, index:number) => {
                        const points = Polyline.decode(route.overview_polyline.points)
                        let coords = points.map((point, index) => {
                            return  {
                                latitude : point[0],
                                longitude : point[1]
                            }
                        })

                        let possibleRoute = true;
                        markers.forEach((marker) => {
                            coords.forEach((coord) => {
                                if(Math.sqrt(Math.pow(coord.latitude - marker.location?.latitude!, 2) + Math.pow(coord.longitude - marker.location?.longitude!, 2)) < 0.0005){
                                    possibleRoute = false;
                                }
                            })    
                        })
                        console.log("isPossibleroute", index, possibleRoute)
                        if(possibleRoute){
                            setSelectedRoute(coords)
                        }
                    })

                })
            })
        }
    }, [destination, location])

    useEffect(() => {
        console.log(location)
    }, [location])


    useEffect(() => {
        (async () => {
      
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
              return;
            }
            
            let location = await Location.getCurrentPositionAsync({});
            setLocation(location)

        })();     
        const db = getDatabase();
        const alertsRef = ref(db, 'alerts/');

        const listener = onValue(alertsRef, (snapshot) => {
            const data = snapshot.val();

            if(data){
                setCrimeMarkers(Object.values(data));
            }
        });

        return listener
    }, [])
    
    return (
        <View style={styles.container}>
            <View style={styles.routeContainer}>
                {/* <TextInput style={styles.input} value={destination} placeholder="Enter a location to route to"></TextInput> */}
                <GooglePlacesAutocomplete
                placeholder="Enter a location to route to"
                onPress={(data, details) => {
                    setDestination(undefined)
                    setDestination(data.place_id)
                    setSelectedMarker({
                        latitude: details!.geometry.location.lat,
                        longitude: details!.geometry.location.lng
                    })
                }}
                query={{key: api_key}}
                GooglePlacesSearchQuery={{
                    location: `${location?.coords.latitude!},${location?.coords.longitude!}`,
                }}
                onFail={error => console.log(error)}
                onNotFound={() => console.log('no results')}
                textInputProps={{
                    placeholderTextColor: primaryScarlet,
                    style: styles.input
                }}
                fetchDetails={true}
            />
            </View>

            <MapView showsUserLocation showsPointsOfInterest rotateEnabled={false} style={styles.map}  initialRegion={{"latitude": 39.99706236315766, "latitudeDelta": 0.04715821594454894, "longitude": -83.01356221441546, "longitudeDelta": 0.033436813553080924}}>
            {crimeMarkers !== null && crimeMarkers.map((alert, index) => {
                return (
                    <Marker key={index} coordinate={{
                        latitude: alert.location?.latitude!,
                        longitude: alert.location?.longitude!
                    }} pinColor={colorMapping[alert.type!]}>
                    </Marker>
                )
            })}

            {selectedMarker !== undefined && selectedRoute !== undefined && (
                <Marker coordinate={selectedMarker} pinColor={primaryScarlet}>
                </Marker>
            )}

            {zones.map((zone: newMapMarker, index: number) => {
                return (
                    <Circle key={index} fillColor="rgba(255, 150, 185, 0.4)" strokeColor="rgba(255, 174, 185, 0.1)" center={{
                        latitude: zone.location?.latitude!,
                        longitude: zone.location?.longitude!
                    }} radius={zone.radius! * 8000}>
                    </Circle>
                )
            })}

            <P coordinates={selectedRoute!} strokeColor={primaryScarlet} strokeWidth={6} ></P>

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
    map: {
        width: '100%',
        height: '100%'
    },
    routeContainer: {
        position: 'absolute',
        top: '10%',
        width: '90%',
        backgroundColor: primaryWhite,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 5,
        borderRadius: 10,
        zIndex: 10,
    },
    input: {
        width: '100%',
        height: 50,
        color: primaryScarlet,
        borderRadius: 10,
        padding: 10,
        fontSize: 15
    }
})