import { Colors } from '@/utils/constants';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function PersonalInformation() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const [name, setName] = useState('John Doe');
    const [email, setEmail] = useState('john.doe@email.com');
    const [phone, setPhone] = useState('+1 234 567 8900');
    const [age, setAge] = useState('28');
    const [gender, setGender] = useState('Male');

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
                    Personal Information
                </Text>
            </View>

            <ScrollView
                contentContainerStyle={{
                    padding: 24,
                    paddingBottom: insets.bottom + 24
                }}
            >
                {/* Full Name */}
                <View style={{ marginBottom: 20 }}>
                    <Text style={{
                        fontSize: 14,
                        fontWeight: '600',
                        color: Colors.light.text.secondary,
                        marginBottom: 8
                    }}>
                        Full Name
                    </Text>
                    <TextInput
                        style={{
                            backgroundColor: 'white',
                            borderRadius: 12,
                            padding: 16,
                            fontSize: 16,
                            borderWidth: 1,
                            borderColor: Colors.light.border
                        }}
                        value={name}
                        onChangeText={setName}
                    />
                </View>

                {/* Email */}
                <View style={{ marginBottom: 20 }}>
                    <Text style={{
                        fontSize: 14,
                        fontWeight: '600',
                        color: Colors.light.text.secondary,
                        marginBottom: 8
                    }}>
                        Email
                    </Text>
                    <TextInput
                        style={{
                            backgroundColor: 'white',
                            borderRadius: 12,
                            padding: 16,
                            fontSize: 16,
                            borderWidth: 1,
                            borderColor: Colors.light.border
                        }}
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                    />
                </View>

                {/* Phone */}
                <View style={{ marginBottom: 20 }}>
                    <Text style={{
                        fontSize: 14,
                        fontWeight: '600',
                        color: Colors.light.text.secondary,
                        marginBottom: 8
                    }}>
                        Phone Number
                    </Text>
                    <TextInput
                        style={{
                            backgroundColor: 'white',
                            borderRadius: 12,
                            padding: 16,
                            fontSize: 16,
                            borderWidth: 1,
                            borderColor: Colors.light.border
                        }}
                        value={phone}
                        onChangeText={setPhone}
                        keyboardType="phone-pad"
                    />
                </View>

                {/* Age */}
                <View style={{ marginBottom: 20 }}>
                    <Text style={{
                        fontSize: 14,
                        fontWeight: '600',
                        color: Colors.light.text.secondary,
                        marginBottom: 8
                    }}>
                        Age
                    </Text>
                    <TextInput
                        style={{
                            backgroundColor: 'white',
                            borderRadius: 12,
                            padding: 16,
                            fontSize: 16,
                            borderWidth: 1,
                            borderColor: Colors.light.border
                        }}
                        value={age}
                        onChangeText={setAge}
                        keyboardType="number-pad"
                    />
                </View>

                {/* Gender */}
                <View style={{ marginBottom: 32 }}>
                    <Text style={{
                        fontSize: 14,
                        fontWeight: '600',
                        color: Colors.light.text.secondary,
                        marginBottom: 8
                    }}>
                        Gender
                    </Text>
                    <View style={{ flexDirection: 'row', gap: 12 }}>
                        {['Male', 'Female', 'Other'].map((g) => (
                            <TouchableOpacity
                                key={g}
                                onPress={() => setGender(g)}
                                style={{
                                    flex: 1,
                                    padding: 12,
                                    borderRadius: 12,
                                    borderWidth: 2,
                                    borderColor: gender === g ? Colors.primary.main : Colors.light.border,
                                    backgroundColor: gender === g ? `${Colors.primary.main}10` : 'white'
                                }}
                            >
                                <Text style={{
                                    textAlign: 'center',
                                    fontWeight: '600',
                                    color: gender === g ? Colors.primary.main : Colors.light.text.secondary
                                }}>
                                    {g}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Save Button */}
                <TouchableOpacity
                    style={{
                        backgroundColor: Colors.primary.main,
                        padding: 16,
                        borderRadius: 12,
                        alignItems: 'center'
                    }}
                    onPress={() => {/* TODO: Save */ }}
                >
                    <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>
                        Save Changes
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}
