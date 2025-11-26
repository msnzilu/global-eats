import { Colors } from '@/utils/constants';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function DownloadData() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const [loading, setLoading] = useState(false);

    const handleRequestDownload = () => {
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            Alert.alert(
                'Request Received',
                'We have received your request. You will receive an email with your data within 48 hours.',
                [{ text: 'OK', onPress: () => router.back() }]
            );
        }, 1500);
    };

    const dataCategories = [
        {
            icon: 'person',
            title: 'Profile Information',
            description: 'Your account details and preferences',
            size: '2.4 MB'
        },
        {
            icon: 'restaurant',
            title: 'Recipes',
            description: 'All your saved and custom recipes',
            size: '8.1 MB'
        },
        {
            icon: 'calendar',
            title: 'Meal Plans',
            description: 'Your meal planning history',
            size: '1.2 MB'
        },
        {
            icon: 'basket',
            title: 'Inventory',
            description: 'Your ingredient inventory data',
            size: '0.8 MB'
        },
        {
            icon: 'stats-chart',
            title: 'Analytics',
            description: 'Your usage statistics and insights',
            size: '0.5 MB'
        }
    ];

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
                    Download My Data
                </Text>
            </View>

            <ScrollView
                contentContainerStyle={{
                    padding: 24,
                    paddingBottom: insets.bottom + 100
                }}
            >
                <Text style={{
                    fontSize: 14,
                    color: Colors.light.text.secondary,
                    marginBottom: 20,
                    lineHeight: 20
                }}>
                    Request a copy of all your data stored in GlobalEats. We'll send you a download link via email within 48 hours.
                </Text>

                {/* Data Categories */}
                <Text style={{
                    fontSize: 16,
                    fontWeight: '600',
                    marginBottom: 12
                }}>
                    What's Included
                </Text>

                {dataCategories.map((category, index) => (
                    <View
                        key={index}
                        style={{
                            backgroundColor: 'white',
                            borderRadius: 12,
                            padding: 16,
                            marginBottom: 12,
                            flexDirection: 'row',
                            alignItems: 'center'
                        }}
                    >
                        <View style={{
                            width: 48,
                            height: 48,
                            borderRadius: 24,
                            backgroundColor: `${Colors.primary.main}15`,
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginRight: 16
                        }}>
                            <Ionicons name={category.icon as any} size={24} color={Colors.primary.main} />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={{
                                fontSize: 16,
                                fontWeight: '600',
                                color: Colors.light.text.primary,
                                marginBottom: 4
                            }}>
                                {category.title}
                            </Text>
                            <Text style={{
                                fontSize: 13,
                                color: Colors.light.text.secondary
                            }}>
                                {category.description}
                            </Text>
                        </View>
                        <Text style={{
                            fontSize: 13,
                            fontWeight: '600',
                            color: Colors.light.text.tertiary
                        }}>
                            {category.size}
                        </Text>
                    </View>
                ))}

                {/* Info */}
                <View style={{
                    backgroundColor: `${Colors.primary.main}10`,
                    borderRadius: 12,
                    padding: 16,
                    marginTop: 12,
                    borderLeftWidth: 4,
                    borderLeftColor: Colors.primary.main
                }}>
                    <Text style={{
                        fontSize: 14,
                        fontWeight: '600',
                        marginBottom: 8
                    }}>
                        Data Format
                    </Text>
                    <Text style={{
                        fontSize: 13,
                        color: Colors.light.text.secondary,
                        lineHeight: 18
                    }}>
                        Your data will be provided in JSON format, which can be easily imported into other applications or viewed in any text editor.
                    </Text>
                </View>
            </ScrollView>

            {/* Request Button */}
            <View style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                backgroundColor: 'white',
                padding: 24,
                paddingBottom: 24 + insets.bottom,
                borderTopWidth: 1,
                borderTopColor: Colors.light.border
            }}>
                <TouchableOpacity
                    style={{
                        backgroundColor: loading ? Colors.light.border : Colors.primary.main,
                        padding: 16,
                        borderRadius: 12,
                        alignItems: 'center'
                    }}
                    onPress={handleRequestDownload}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>
                            Request Data Download
                        </Text>
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );
}
