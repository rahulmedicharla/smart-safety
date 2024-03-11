import { StackScreenProps } from "@react-navigation/stack";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { Float } from "react-native/Libraries/Types/CodegenTypes";

export type newMapMarker = {
    status: 'base' | 'place' | 'confirm',
    type?: 'harassment' | 'break-in' | 'assault' | 'theft',
    location?: {
        latitude: number,
        longitude: number,
    }
    date?: string,
    description?: string,
    radius?: number,
}

export type crimeZone = {
    lat: Float,
    lng: Float,
    radius: Float
}

export type Destination = {
    address?: string,
    latitude?: number,
    longitude?: number,
}

export type RootStackParamList = {
    Landing: undefined,
    Login: undefined,
    Register: undefined,
};

export type RootTabsParamList = {
    Past: undefined,
    Present: undefined,
    Future: undefined,
    Profile: undefined
}

export type LandingStackProps = StackScreenProps<RootStackParamList, 'Landing'>;
export type LoginStackProps = StackScreenProps<RootStackParamList, 'Login'>;
export type RegisterStackProps = StackScreenProps<RootStackParamList, 'Register'>;

export type PastTabProps = BottomTabScreenProps<RootTabsParamList, 'Past'>;
export type PresentTabProps = BottomTabScreenProps<RootTabsParamList, 'Present'>;
export type FutureTabProps = BottomTabScreenProps<RootTabsParamList, 'Future'>;
export type ProfileTabProps = BottomTabScreenProps<RootTabsParamList, 'Profile'>;

export const primaryGray = '#A7B1B7';
export const primaryScarlet = '#BA0C2F';
export const primaryWhite = '#FFFFFF';