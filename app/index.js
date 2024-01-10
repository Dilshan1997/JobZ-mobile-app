import { useEffect, useState } from 'react';
import { View, ScrollView, SafeAreaView, Text, Alert, Button } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { COLORS, icons, images, SIZES } from '../constants'
import { Popularjobs, ScreenHeaderBtn, Welcome, Nearbyjobs } from '../components'
import * as LocalAuthentication from 'expo-local-authentication';

const Home = () => {
    const router = useRouter();

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
            handleBiometricAuthentication()

    })

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
        if (biometricAuth) { TwoButtonAlert() };
        console.log({ isBiometricAvailable });
        console.log({ supportedBiometrics });
        console.log({ savedBiometrics });
        console.log({ biometricAuth });
        setIsBiometricAuthenticated(true);
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
                            <Button
                                title='Login with Biometrics'
                                color='black'
                                onPress={handleBiometricAuthentication}
                            />
                            <Welcome

                            />
                            <Popularjobs />
                            <Nearbyjobs />
                        </View>
                    </ScrollView></View> : <View>
                    <Text>
                        {
                            'Oops.... Sorry We can not further process... Your device is compatible with biometrics authentication'
                        }
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