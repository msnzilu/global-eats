import { Colors } from '@/utils/constants';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function GeneratePlan() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const [duration, setDuration] = useState<7 | 30>(7);
    const [selectedCuisines, setSelectedCuisines] = useState<string[]>([]);
    const [includeCustomRecipes, setIncludeCustomRecipes] = useState(true);
    const [isGenerating, setIsGenerating] = useState(false);

    const cuisines = [
        'Indian', 'Mexican', 'Italian', 'Chinese', 'Japanese',
        'Thai', 'Mediterranean', 'American', 'French', 'Korean'
    ];

    const toggleCuisine = (cuisine: string) => {
        setSelectedCuisines(prev =>
            prev.includes(cuisine)
                ? prev.filter(c => c !== cuisine)
                : [...prev, cuisine]
        );
    };

    const handleGenerate = async () => {
        setIsGenerating(true);
        // TODO: Implement actual plan generation
        setTimeout(() => {
            setIsGenerating(false);
            router.back();
        }, 2000);
    };

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
                <TouchableOpacity
                    onPress={() => router.back()}
                    style={{ marginRight: 16 }}
                >
                    <Ionicons name="close" size={28} color="white" />
                </TouchableOpacity>
                <Text style={{
                    fontSize: 24,
                    fontWeight: 'bold',
                    color: 'white'
                }}>
                    Generate Meal Plan
                </Text>
            </View>

            <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{
                    paddingHorizontal: 24,
                    paddingTop: 24,
                    paddingBottom: 100 + insets.bottom
                }}
            >
                {/* Duration Selector */}
                <Text style={{
                    fontSize: 16,
                    fontWeight: '600',
                    color: Colors.light.text.primary,
                    marginBottom: 12
                }}>
                    Plan Duration
                </Text>
                <View style={{
                    flexDirection: 'row',
                    gap: 12,
                    marginBottom: 24
                }}>
                    {([7, 30] as const).map((days) => (
                        <TouchableOpacity
                            key={days}
                            style={{
                                flex: 1,
                                paddingVertical: 16,
                                borderRadius: 12,
                                backgroundColor: duration === days ? Colors.primary.main : 'white',
                                borderWidth: 2,
                                borderColor: duration === days ? Colors.primary.main : Colors.light.border,
                                alignItems: 'center'
                            }}
                            onPress={() => setDuration(days)}
                        >
                            <Text style={{
                                fontSize: 24,
                                fontWeight: 'bold',
                                color: duration === days ? 'white' : Colors.light.text.primary
                            }}>
                                {days}
                            </Text>
                            <Text style={{
                                fontSize: 14,
                                color: duration === days ? 'rgba(255,255,255,0.9)' : Colors.light.text.secondary
                            }}>
                                days
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Cuisine Focus */}
                <Text style={{
                    fontSize: 16,
                    fontWeight: '600',
                    color: Colors.light.text.primary,
                    marginBottom: 12
                }}>
                    Cuisine Focus (Optional)
                </Text>
                <View style={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    gap: 8,
                    marginBottom: 24
                }}>
                    {cuisines.map((cuisine) => (
                        <TouchableOpacity
                            key={cuisine}
                            style={{
                                paddingHorizontal: 16,
                                paddingVertical: 10,
                                borderRadius: 20,
                                backgroundColor: selectedCuisines.includes(cuisine)
                                    ? Colors.primary.main
                                    : 'white',
                                borderWidth: 1,
                                borderColor: selectedCuisines.includes(cuisine)
                                    ? Colors.primary.main
                                    : Colors.light.border
                            }}
                            onPress={() => toggleCuisine(cuisine)}
                        >
                            <Text style={{
                                fontSize: 14,
                                fontWeight: '500',
                                color: selectedCuisines.includes(cuisine)
                                    ? 'white'
                                    : Colors.light.text.primary
                            }}>
                                {cuisine}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Include Custom Recipes */}
                <TouchableOpacity
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        backgroundColor: 'white',
                        padding: 16,
                        borderRadius: 12,
                        marginBottom: 24
                    }}
                    onPress={() => setIncludeCustomRecipes(!includeCustomRecipes)}
                >
                    <View>
                        <Text style={{
                            fontSize: 16,
                            fontWeight: '600',
                            color: Colors.light.text.primary,
                            marginBottom: 4
                        }}>
                            Include My Recipes
                        </Text>
                        <Text style={{
                            fontSize: 14,
                            color: Colors.light.text.secondary
                        }}>
                            Use your custom recipes in the plan
                        </Text>
                    </View>
                    <View style={{
                        width: 24,
                        height: 24,
                        borderRadius: 12,
                        backgroundColor: includeCustomRecipes ? Colors.primary.main : Colors.light.border,
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        {includeCustomRecipes && (
                            <Ionicons name="checkmark" size={16} color="white" />
                        )}
                    </View>
                </TouchableOpacity>

                {/* Info Box */}
                <View style={{
                    backgroundColor: `${Colors.primary.main}15`,
                    padding: 16,
                    borderRadius: 12,
                    flexDirection: 'row',
                    marginBottom: 24
                }}>
                    <Ionicons name="information-circle" size={24} color={Colors.primary.main} style={{ marginRight: 12 }} />
                    <Text style={{
                        flex: 1,
                        fontSize: 14,
                        color: Colors.light.text.secondary,
                        lineHeight: 20
                    }}>
                        Your plan will be optimized based on your inventory, dietary preferences, and calorie goals.
                    </Text>
                </View>
            </ScrollView>

            {/* Generate Button */}
            <View style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                backgroundColor: 'white',
                paddingHorizontal: 24,
                paddingTop: 16,
                paddingBottom: 16 + insets.bottom,
                borderTopWidth: 1,
                borderTopColor: Colors.light.border
            }}>
                <TouchableOpacity
                    style={{
                        backgroundColor: Colors.primary.main,
                        paddingVertical: 16,
                        borderRadius: 12,
                        alignItems: 'center',
                        opacity: isGenerating ? 0.6 : 1
                    }}
                    onPress={handleGenerate}
                    disabled={isGenerating}
                >
                    <Text style={{
                        fontSize: 18,
                        fontWeight: 'bold',
                        color: 'white'
                    }}>
                        {isGenerating ? 'Generating Plan...' : `Generate ${duration}-Day Plan`}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
