import { Colors } from '@/utils/constants';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function Help() {
    const router = useRouter();
    const insets = useSafeAreaInsets();

    const helpTopics = [
        {
            icon: 'help-circle',
            title: 'Getting Started',
            description: 'Learn the basics of GlobalEats'
        },
        {
            icon: 'restaurant',
            title: 'Meal Planning',
            description: 'How to create and customize meal plans'
        },
        {
            icon: 'basket',
            title: 'Managing Inventory',
            description: 'Track your ingredients and groceries'
        },
        {
            icon: 'book',
            title: 'Using Recipes',
            description: 'Find, save, and create recipes'
        },
        {
            icon: 'cart',
            title: 'Shopping Lists',
            description: 'Generate and manage shopping lists'
        },
        {
            icon: 'settings',
            title: 'Account Settings',
            description: 'Manage your profile and preferences'
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
                    Help Center
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
                    Find answers to common questions and learn how to make the most of GlobalEats.
                </Text>

                {helpTopics.map((topic, index) => (
                    <TouchableOpacity
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
                            <Ionicons name={topic.icon as any} size={24} color={Colors.primary.main} />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={{
                                fontSize: 16,
                                fontWeight: '600',
                                color: Colors.light.text.primary,
                                marginBottom: 4
                            }}>
                                {topic.title}
                            </Text>
                            <Text style={{
                                fontSize: 13,
                                color: Colors.light.text.secondary
                            }}>
                                {topic.description}
                            </Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color={Colors.light.text.tertiary} />
                    </TouchableOpacity>
                ))}

                {/* FAQ Section */}
                <View style={{
                    backgroundColor: `${Colors.secondary.main}15`,
                    borderRadius: 12,
                    padding: 20,
                    marginTop: 12
                }}>
                    <Text style={{
                        fontSize: 16,
                        fontWeight: '600',
                        marginBottom: 8
                    }}>
                        Still need help?
                    </Text>
                    <Text style={{
                        fontSize: 14,
                        color: Colors.light.text.secondary,
                        marginBottom: 16,
                        lineHeight: 20
                    }}>
                        Can't find what you're looking for? Our support team is here to help.
                    </Text>
                    <TouchableOpacity
                        style={{
                            backgroundColor: Colors.secondary.main,
                            padding: 12,
                            borderRadius: 8,
                            alignItems: 'center'
                        }}
                        onPress={() => router.push('/profile/contact')}
                    >
                        <Text style={{ color: 'white', fontSize: 14, fontWeight: '600' }}>
                            Contact Support
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
}
