import { useEffect, useState } from 'react';
import { View, ScrollView, SafeAreaView, Text, Alert, Button } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { COLORS, icons, images, SIZES } from '../constants'
import { Popularjobs, ScreenHeaderBtn, Welcome, Nearbyjobs } from '../components'
import * as LocalAuthentication from 'expo-local-authentication';
import axios from 'axios';

const Home = () => {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState("")

    const [isBiometricSupported, setIsBiometricSupported] = useState(false);
    const [isBiometricAuthenticated, setIsBiometricAuthenticated] = useState(false);

    useEffect(() => {
        (async () => {
            const compatible = await LocalAuthentication.hasHardwareAsync();
            setIsBiometricSupported(compatible);
        })();
    });

    useEffect(() => {
        if (isBiometricSupported)
        console.log("test hook......................................")
            handleBiometricAuthentication()

    },[])

    const handleClickSearchButtonWelcome = async (keyword)=>{
        console.log("test search......................................")
        console.log('handle click pressed', keyword)
        

        const options = {
        method: 'GET',
        url: 'https://jsearch.p.rapidapi.com/search',
        params: {
            query: '',
            page: '1',
            num_pages: '1'
        },
        headers: {
            'X-RapidAPI-Key': '5eb5f312a5msh1228171d2954756p190ad6jsnaa1d2c8331f1',
            'X-RapidAPI-Host': 'jsearch.p.rapidapi.com'
        }
        };

        try {
            const response = await axios.request(options);
            console.log(response.data);
        } catch (error) {
            console.error(error);
        }
    }

    const fallBackToDefaultAuth = () => {
        // TODO
        console.log('fall back to password authentication')
    }

    const alertComponent = (title, mess, btnTxt, btnFunc) => {
        return Alert.alert(title, mess, [
            {
                text: btnTxt,
                onPress: btnFunc,
            }
        ])
    };

    const TwoButtonAlert = () =>
        Alert.alert('Welcome To App', 'Find your Job Now', [
            {
                text: 'Back',
                onPress: () => console.log('Cancel Pressed')
            },
            {
                text: 'Ok', onPress: () => console.log('ok pressed')
            }]);


    const handleBiometricAuthentication = async () => {
        // check if hardware supports
        const isBiometricAvailable = await LocalAuthentication.hasHardwareAsync();

        // fail back to default authentication method (pw) if biomatric is not available
        if (!isBiometricAvailable)
            return alertComponent(
                'Please enter your password',
                'Biometric Auth not Supported',
                'Ok',
                () => fallBackToDefaultAuth()
            );

        let supportedBiometrics;
        if (isBiometricAvailable)
            supportedBiometics = await LocalAuthentication.supportedAuthenticationTypesAsync;

        // check biometcs are saved locally in user's device
        const savedBiometrics = await LocalAuthentication.isEnrolledAsync();
        if (!savedBiometrics)
            return alertComponent(
                'Biometric record not found',
                'Please login with password',
                'Ok',
                () => fallBackToDefaultAuth()
            );
        // authentication with biometricAuth
        const biometricAuth = await LocalAuthentication.authenticateAsync({
            promptMessage: "Login with Biometrics",
            cancelLabel: "cancel",
            disableDeviceFallback: true,
        });

        // Log the user in on success
        if (biometricAuth.success) { // TwoButtonAlert();
            console.log("setting auth true............")
            setIsBiometricAuthenticated(true); };
        console.log({ isBiometricAvailable });
        console.log({ supportedBiometrics });
        console.log({ savedBiometrics });
        console.log({ biometricAuth });
        
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.lightWhite }}>

            {
                isBiometricAuthenticated ? <View>

                    <Stack.Screen
                        options={{
                            headerStyle: { backgroundColor: COLORS.lightWhite },
                            headerShadowVisible: false,
                            headerLeft: () => (
                                <ScreenHeaderBtn iconUrl={icons.menu} dimension="60%" />
                            ),
                            headerRight: () => (
                                <ScreenHeaderBtn iconUrl={images.profile} dimension="100%" />
                            ),
                            headerTitle: ""
                        }}
                    />

                    <ScrollView showsVerticalScrollIndicator={false}>

                        <View
                            style={{
                                flex: 1,
                                padding: SIZES.medium
                            }}
                        >
                            <Welcome
                                searchTerm={searchTerm}
                                setSearchTerm={setSearchTerm}
                                handleClick={()=>{
                                    if(searchTerm){
                                        router.push(`/search/${searchTerm}`)
                                    }
                                }}
                            />
                            <Popularjobs />
                            <Nearbyjobs />
                        </View>
                    </ScrollView></View> : <View>
                    <Text>
                        {isBiometricSupported?'Please login with biometric authentication':'Oops.... Sorry We can not further process... Your device is compatible with biometrics authentication'}

                    </Text>
                    <Button
                        title='Try again... Login with Biometrics'
                        color='black'
                        onPress={handleBiometricAuthentication}
                    /></View>
            }


        </SafeAreaView>
    )
}
export default Home;