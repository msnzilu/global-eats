import { Colors } from '@/utils/constants';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, Switch, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function DataPrivacy() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const [analytics, setAnalytics] = useState(true);
    const [personalization, setPersonalization] = useState(true);
    const [marketing, setMarketing] = useState(false);

    return (
        <View style={{ flex: 1, backgroundColor: Colors.light.background }}>
            {/* Header */}
            <View style={{
                backgroundColor: Colors.primary.main,
                paddingTop: insets.top + 16,
                paddingBottom: 20,
                paddingHorizontal: 24,
                flexDirection: 'row',
                alignItems: 'center'
            }}>
                <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 16 }}>
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white' }}>
                    Data Privacy
                </Text>
            </View>

            <ScrollView
                contentContainerStyle={{
                    padding: 24,
                    paddingBottom: insets.bottom + 24
                }}
            >
                <Text style={{
                    fontSize: 14,
                    color: Colors.light.text.secondary,
                    marginBottom: 20,
                    lineHeight: 20
                }}>
                    Control how your data is collected and used. You can change these settings at any time.
                </Text>

                {/* Analytics */}
                <View style={{
                    backgroundColor: 'white',
                    borderRadius: 12,
                    padding: 16,
                    marginBottom: 12
                }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <View style={{ flex: 1 }}>
                            <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 4 }}>
                                Analytics Data
                            </Text>
                            <Text style={{ fontSize: 13, color: Colors.light.text.secondary }}>
                                Help us improve by sharing usage data
                            </Text>
                        </View>
                        <Switch
                            value={analytics}
                            onValueChange={setAnalytics}
                            trackColor={{ false: '#D1D5DB', true: Colors.primary.main }}
                        />
                    </View>
                </View>

                {/* Personalization */}
                <View style={{
                    backgroundColor: 'white',
                    borderRadius: 12,
                    padding: 16,
                    marginBottom: 12
                }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <View style={{ flex: 1 }}>
                            <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 4 }}>
                                Personalization
                            </Text>
                            <Text style={{ fontSize: 13, color: Colors.light.text.secondary }}>
                                Customize your experience based on preferences
                            </Text>
                        </View>
                        <Switch
                            value={personalization}
                            onValueChange={setPersonalization}
                            trackColor={{ false: '#D1D5DB', true: Colors.primary.main }}
                        />
                    </View>
                </View>

                {/* Marketing */}
                <View style={{
                    backgroundColor: 'white',
                    borderRadius: 12,
                    padding: 16,
                    marginBottom: 24
                }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <View style={{ flex: 1 }}>
                            <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 4 }}>
                                Marketing Communications
                            </Text>
                            <Text style={{ fontSize: 13, color: Colors.light.text.secondary }}>
                                Receive promotional emails and offers
                            </Text>
                        </View>
                        <Switch
                            value={marketing}
                            onValueChange={setMarketing}
                            trackColor={{ false: '#D1D5DB', true: Colors.primary.main }}
                        />
                    </View>
                </View>

                {/* Data Collection Info */}
                <Text style={{
                    fontSize: 16,
                    fontWeight: '600',
                    marginBottom: 12
                }}>
                    What Data We Collect
                </Text>

                <View style={{
                    backgroundColor: 'white',
                    borderRadius: 12,
                    padding: 16,
                    marginBottom: 12
                }}>
                    <Text style={{ fontSize: 14, fontWeight: '600', marginBottom: 8 }}>
                        Account Information
                    </Text>
                    <Text style={{ fontSize: 13, color: Colors.light.text.secondary, lineHeight: 18 }}>
                        Email, name, profile picture, and dietary preferences
                    </Text>
                </View>

                <View style={{
                    backgroundColor: 'white',
                    borderRadius: 12,
                    padding: 16,
                    marginBottom: 12
                }}>
                    <Text style={{ fontSize: 14, fontWeight: '600', marginBottom: 8 }}>
                        Usage Data
                    </Text>
                    <Text style={{ fontSize: 13, color: Colors.light.text.secondary, lineHeight: 18 }}>
                        Recipes viewed, meal plans created, and app interactions
                    </Text>
                </View>

                <View style={{
                    backgroundColor: 'white',
                    borderRadius: 12,
                    padding: 16,
                    marginBottom: 20
                }}>
                    <Text style={{ fontSize: 14, fontWeight: '600', marginBottom: 8 }}>
                        Device Information
                    </Text>
                    <Text style={{ fontSize: 13, color: Colors.light.text.secondary, lineHeight: 18 }}>
                        Device type, operating system, and app version
                    </Text>
                </View>

                {/* Privacy Policy Link */}
                <TouchableOpacity
                    style={{
                        backgroundColor: `${Colors.primary.main}10`,
                        borderRadius: 12,
                        padding: 16,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                    }}
                >
                    <Text style={{
                        fontSize: 14,
                        fontWeight: '600',
                        color: Colors.primary.main
                    }}>
                        Read Full Privacy Policy
                    </Text>
                    <Ionicons name="open-outline" size={20} color={Colors.primary.main} />
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}
