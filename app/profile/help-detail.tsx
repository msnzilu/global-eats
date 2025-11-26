import { Colors } from '@/utils/constants';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Help content data
const helpContent: Record<string, { title: string; content: string[] }> = {
    'getting-started': {
        title: 'Getting Started',
        content: [
            'Welcome to GlobalEats! Here is how to get started:',
            '1. Set up your profile: Go to "My Profile" to add your details and preferences.',
            '2. Create a Meal Plan: Use the "Meal Planner" to generate a plan based on your goals.',
            '3. Generate a Shopping List: Once you have a plan, a shopping list is automatically created for you.',
            '4. Start Cooking: View recipes and follow step-by-step instructions.'
        ]
    },
    'meal-planning': {
        title: 'Meal Planning',
        content: [
            'Creating a meal plan is easy:',
            '• Go to the "Meal Planner" tab.',
            '• Choose "Create New Plan".',
            '• Select your duration (e.g., 7 days) and preferences.',
            '• Let our AI generate a plan or build one manually.',
            '• You can swap meals or regenerate days if needed.'
        ]
    },
    'managing-inventory': {
        title: 'Managing Inventory',
        content: [
            'Keep track of what you have at home:',
            '• Go to the "Inventory" tab.',
            '• Add items manually or scan barcodes (coming soon).',
            '• Mark items as "low stock" to add them to your shopping list.',
            '• The app will suggest recipes based on what you have.'
        ]
    },
    'using-recipes': {
        title: 'Using Recipes',
        content: [
            'Discover and use recipes:',
            '• Browse the "Recipes" tab for inspiration.',
            '• Filter by cuisine, diet, or ingredients.',
            '• Save your favorites for later.',
            '• When cooking, use the "Start Cooking" mode for a step-by-step view.'
        ]
    },
    'shopping-lists': {
        title: 'Shopping Lists',
        content: [
            'Smart shopping lists:',
            '• Your shopping list is automatically generated from your active meal plan.',
            '• You can also add items manually.',
            '• Check off items as you shop.',
            '• Items are categorized by aisle for easier shopping.'
        ]
    },
    'account-settings': {
        title: 'Account Settings',
        content: [
            'Manage your account:',
            '• Go to "My Profile" > "Settings".',
            '• Update your email, password, or notification preferences.',
            '• Manage your subscription and billing details.',
            '• Adjust your dietary preferences and health goals anytime.'
        ]
    }
};

export default function HelpDetail() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { id } = useLocalSearchParams();

    const topicId = typeof id === 'string' ? id : 'getting-started';
    const data = helpContent[topicId] || helpContent['getting-started'];

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
                    {data.title}
                </Text>
            </View>

            <ScrollView
                contentContainerStyle={{
                    padding: 24,
                    paddingBottom: insets.bottom + 24
                }}
            >
                <View style={{
                    backgroundColor: 'white',
                    borderRadius: 16,
                    padding: 24,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.05,
                    shadowRadius: 8,
                    elevation: 2
                }}>
                    {data.content.map((paragraph, index) => (
                        <Text
                            key={index}
                            style={{
                                fontSize: 16,
                                color: Colors.light.text.primary,
                                lineHeight: 24,
                                marginBottom: 16
                            }}
                        >
                            {paragraph}
                        </Text>
                    ))}
                </View>

                {/* Contact Support Section */}
                <View style={{
                    marginTop: 32,
                    alignItems: 'center'
                }}>
                    <Text style={{
                        fontSize: 16,
                        fontWeight: '600',
                        color: Colors.light.text.secondary,
                        marginBottom: 16
                    }}>
                        Still have questions?
                    </Text>
                    <TouchableOpacity
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            backgroundColor: `${Colors.primary.main}15`,
                            paddingVertical: 12,
                            paddingHorizontal: 24,
                            borderRadius: 24
                        }}
                        onPress={() => router.push('/profile/contact')}
                    >
                        <Ionicons name="mail-outline" size={20} color={Colors.primary.main} style={{ marginRight: 8 }} />
                        <Text style={{
                            fontSize: 16,
                            fontWeight: '600',
                            color: Colors.primary.main
                        }}>
                            Contact Support
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
}
