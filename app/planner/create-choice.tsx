import { Colors } from '@/utils/constants';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function CreateMealPlanChoice() {
    const router = useRouter();
    const insets = useSafeAreaInsets();

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
                    Create Meal Plan
                </Text>
            </View>

            <View style={{ flex: 1, padding: 24, justifyContent: 'center' }}>
                <Text style={{
                    fontSize: 24,
                    fontWeight: 'bold',
                    color: Colors.light.text.primary,
                    textAlign: 'center',
                    marginBottom: 32
                }}>
                    How would you like to plan?
                </Text>

                {/* Manual Option */}
                <TouchableOpacity
                    style={{
                        backgroundColor: 'white',
                        borderRadius: 16,
                        padding: 24,
                        marginBottom: 24,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.1,
                        shadowRadius: 8,
                        elevation: 3,
                        borderWidth: 1,
                        borderColor: Colors.light.border
                    }}
                    onPress={() => router.push('/planner/create-manual')}
                    activeOpacity={0.7}
                >
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                        <View style={{
                            width: 48,
                            height: 48,
                            borderRadius: 24,
                            backgroundColor: Colors.primary.main + '20',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginRight: 16
                        }}>
                            <Text style={{ fontSize: 24 }}>📅</Text>
                        </View>
                        <Text style={{ fontSize: 20, fontWeight: 'bold', color: Colors.light.text.primary }}>
                            Manual Planning
                        </Text>
                    </View>
                    <Text style={{ fontSize: 16, color: Colors.light.text.secondary, lineHeight: 24 }}>
                        Build your meal plan day by day. Choose recipes for each meal and customize every detail.
                    </Text>
                </TouchableOpacity>

                {/* AI Option */}
                <TouchableOpacity
                    style={{
                        backgroundColor: 'white',
                        borderRadius: 16,
                        padding: 24,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.1,
                        shadowRadius: 8,
                        elevation: 3,
                        borderWidth: 1,
                        borderColor: Colors.secondary.main
                    }}
                    onPress={() => router.push('/planner/create-ai')}
                    activeOpacity={0.7}
                >
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                        <View style={{
                            width: 48,
                            height: 48,
                            borderRadius: 24,
                            backgroundColor: Colors.secondary.main + '20',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginRight: 16
                        }}>
                            <Text style={{ fontSize: 24 }}>🤖</Text>
                        </View>
                        <Text style={{ fontSize: 20, fontWeight: 'bold', color: Colors.light.text.primary }}>
                            Auto Generate
                        </Text>
                    </View>
                    <Text style={{ fontSize: 16, color: Colors.light.text.secondary, lineHeight: 24 }}>
                        Tell us your goals and preferences, and let us create a complete meal plan for you in seconds.
                    </Text>
                </TouchableOpacity>

            </View>
        </View>
    );
}
