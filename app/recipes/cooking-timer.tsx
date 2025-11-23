import { Colors } from '@/utils/constants';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, Vibration, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface TimerStep {
    id: string;
    name: string;
    duration: number; // in seconds
    completed: boolean;
}

export default function CookingTimer() {
    const router = useRouter();
    const insets = useSafeAreaInsets();

    // Mock cooking steps with timers
    const [steps, setSteps] = useState<TimerStep[]>([
        { id: '1', name: 'Cook quinoa', duration: 900, completed: false }, // 15 min
        { id: '2', name: 'Prepare vegetables', duration: 600, completed: false }, // 10 min
        { id: '3', name: 'Mix ingredients', duration: 300, completed: false }, // 5 min
    ]);

    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [timeRemaining, setTimeRemaining] = useState(steps[0]?.duration || 0);
    const [isRunning, setIsRunning] = useState(false);
    const [isPaused, setIsPaused] = useState(false);

    const currentStep = steps[currentStepIndex];
    const totalSteps = steps.length;
    const completedSteps = steps.filter(s => s.completed).length;

    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (isRunning && !isPaused && timeRemaining > 0) {
            interval = setInterval(() => {
                setTimeRemaining(prev => {
                    if (prev <= 1) {
                        // Timer finished
                        handleStepComplete();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }

        return () => clearInterval(interval);
    }, [isRunning, isPaused, timeRemaining]);

    const handleStepComplete = () => {
        // Vibrate to notify user
        Vibration.vibrate([0, 500, 200, 500]);

        // Mark current step as completed
        const updatedSteps = [...steps];
        updatedSteps[currentStepIndex].completed = true;
        setSteps(updatedSteps);

        // Move to next step or finish
        if (currentStepIndex < steps.length - 1) {
            const nextIndex = currentStepIndex + 1;
            setCurrentStepIndex(nextIndex);
            setTimeRemaining(steps[nextIndex].duration);
            setIsRunning(false);
            setIsPaused(false);
        } else {
            // All steps completed
            setIsRunning(false);
        }
    };

    const handleStartPause = () => {
        if (!isRunning) {
            setIsRunning(true);
            setIsPaused(false);
        } else {
            setIsPaused(!isPaused);
        }
    };

    const handleReset = () => {
        setTimeRemaining(currentStep.duration);
        setIsRunning(false);
        setIsPaused(false);
    };

    const handleSkip = () => {
        if (currentStepIndex < steps.length - 1) {
            const updatedSteps = [...steps];
            updatedSteps[currentStepIndex].completed = true;
            setSteps(updatedSteps);

            const nextIndex = currentStepIndex + 1;
            setCurrentStepIndex(nextIndex);
            setTimeRemaining(steps[nextIndex].duration);
            setIsRunning(false);
            setIsPaused(false);
        }
    };

    const formatTime = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const getProgress = (): number => {
        if (!currentStep) return 0;
        return ((currentStep.duration - timeRemaining) / currentStep.duration) * 100;
    };

    const allStepsCompleted = completedSteps === totalSteps;

    return (
        <View style={{ flex: 1, backgroundColor: Colors.light.background }}>
            {/* Header */}
            <View style={{
                backgroundColor: Colors.primary.main,
                paddingTop: insets.top + 16,
                paddingBottom: 20,
                paddingHorizontal: 24
            }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TouchableOpacity
                        onPress={() => router.back()}
                        style={{ marginRight: 16 }}
                    >
                        <Ionicons name="arrow-back" size={24} color="white" />
                    </TouchableOpacity>
                    <Text style={{
                        fontSize: 20,
                        fontWeight: 'bold',
                        color: 'white',
                        flex: 1
                    }}>
                        Cooking Timer
                    </Text>
                    <Text style={{
                        fontSize: 14,
                        color: 'rgba(255,255,255,0.8)'
                    }}>
                        {completedSteps}/{totalSteps} Steps
                    </Text>
                </View>
            </View>

            <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{ padding: 24, paddingBottom: insets.bottom + 24 }}
            >
                {!allStepsCompleted ? (
                    <>
                        {/* Current Step */}
                        <View style={{
                            backgroundColor: Colors.light.surface,
                            borderRadius: 24,
                            padding: 24,
                            marginBottom: 24,
                            alignItems: 'center'
                        }}>
                            <Text style={{
                                fontSize: 14,
                                fontWeight: '600',
                                color: Colors.light.text.secondary,
                                marginBottom: 8
                            }}>
                                STEP {currentStepIndex + 1} OF {totalSteps}
                            </Text>
                            <Text style={{
                                fontSize: 24,
                                fontWeight: 'bold',
                                color: Colors.light.text.primary,
                                marginBottom: 32,
                                textAlign: 'center'
                            }}>
                                {currentStep?.name}
                            </Text>

                            {/* Circular Timer */}
                            <View style={{
                                width: 200,
                                height: 200,
                                borderRadius: 100,
                                backgroundColor: Colors.primary.light,
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginBottom: 32,
                                position: 'relative'
                            }}>
                                {/* Progress Ring */}
                                <View style={{
                                    position: 'absolute',
                                    width: 200,
                                    height: 200,
                                    borderRadius: 100,
                                    borderWidth: 8,
                                    borderColor: Colors.primary.main,
                                    opacity: getProgress() / 100
                                }} />

                                {/* Time Display */}
                                <Text style={{
                                    fontSize: 48,
                                    fontWeight: 'bold',
                                    color: Colors.primary.dark
                                }}>
                                    {formatTime(timeRemaining)}
                                </Text>
                                <Text style={{
                                    fontSize: 14,
                                    color: Colors.light.text.secondary,
                                    marginTop: 4
                                }}>
                                    {isRunning && !isPaused ? 'Running' : isPaused ? 'Paused' : 'Ready'}
                                </Text>
                            </View>

                            {/* Control Buttons */}
                            <View style={{ flexDirection: 'row', gap: 16, width: '100%' }}>
                                <TouchableOpacity
                                    onPress={handleReset}
                                    style={{
                                        flex: 1,
                                        paddingVertical: 16,
                                        borderRadius: 12,
                                        backgroundColor: Colors.light.border,
                                        alignItems: 'center'
                                    }}
                                >
                                    <Ionicons name="refresh" size={24} color={Colors.light.text.primary} />
                                    <Text style={{
                                        fontSize: 12,
                                        color: Colors.light.text.secondary,
                                        marginTop: 4
                                    }}>
                                        Reset
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={handleStartPause}
                                    style={{
                                        flex: 2,
                                        paddingVertical: 16,
                                        borderRadius: 12,
                                        backgroundColor: Colors.primary.main,
                                        alignItems: 'center'
                                    }}
                                >
                                    <Ionicons
                                        name={!isRunning ? 'play' : isPaused ? 'play' : 'pause'}
                                        size={24}
                                        color="white"
                                    />
                                    <Text style={{
                                        fontSize: 12,
                                        color: 'white',
                                        marginTop: 4,
                                        fontWeight: '600'
                                    }}>
                                        {!isRunning ? 'Start' : isPaused ? 'Resume' : 'Pause'}
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={handleSkip}
                                    disabled={currentStepIndex >= steps.length - 1}
                                    style={{
                                        flex: 1,
                                        paddingVertical: 16,
                                        borderRadius: 12,
                                        backgroundColor: currentStepIndex >= steps.length - 1
                                            ? Colors.light.border
                                            : Colors.secondary.main,
                                        alignItems: 'center',
                                        opacity: currentStepIndex >= steps.length - 1 ? 0.5 : 1
                                    }}
                                >
                                    <Ionicons
                                        name="play-skip-forward"
                                        size={24}
                                        color={currentStepIndex >= steps.length - 1
                                            ? Colors.light.text.tertiary
                                            : 'white'}
                                    />
                                    <Text style={{
                                        fontSize: 12,
                                        color: currentStepIndex >= steps.length - 1
                                            ? Colors.light.text.tertiary
                                            : 'white',
                                        marginTop: 4
                                    }}>
                                        Skip
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* All Steps List */}
                        <Text style={{
                            fontSize: 14,
                            fontWeight: '600',
                            color: Colors.light.text.secondary,
                            marginBottom: 12
                        }}>
                            ALL STEPS
                        </Text>
                        {steps.map((step, index) => (
                            <View
                                key={step.id}
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    backgroundColor: index === currentStepIndex
                                        ? Colors.primary.light
                                        : Colors.light.surface,
                                    borderRadius: 12,
                                    padding: 16,
                                    marginBottom: 8,
                                    borderWidth: index === currentStepIndex ? 2 : 1,
                                    borderColor: index === currentStepIndex
                                        ? Colors.primary.main
                                        : Colors.light.border
                                }}
                            >
                                <View style={{
                                    width: 32,
                                    height: 32,
                                    borderRadius: 16,
                                    backgroundColor: step.completed
                                        ? Colors.secondary.main
                                        : index === currentStepIndex
                                            ? Colors.primary.main
                                            : Colors.light.border,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginRight: 12
                                }}>
                                    {step.completed ? (
                                        <Ionicons name="checkmark" size={20} color="white" />
                                    ) : (
                                        <Text style={{
                                            fontSize: 14,
                                            fontWeight: 'bold',
                                            color: index === currentStepIndex ? 'white' : Colors.light.text.tertiary
                                        }}>
                                            {index + 1}
                                        </Text>
                                    )}
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={{
                                        fontSize: 16,
                                        fontWeight: index === currentStepIndex ? 'bold' : '500',
                                        color: Colors.light.text.primary,
                                        marginBottom: 4
                                    }}>
                                        {step.name}
                                    </Text>
                                    <Text style={{
                                        fontSize: 12,
                                        color: Colors.light.text.tertiary
                                    }}>
                                        {formatTime(step.duration)}
                                    </Text>
                                </View>
                                {step.completed && (
                                    <Ionicons name="checkmark-circle" size={24} color={Colors.secondary.main} />
                                )}
                            </View>
                        ))}
                    </>
                ) : (
                    /* Completion Screen */
                    <View style={{
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: 40
                    }}>
                        <View style={{
                            width: 120,
                            height: 120,
                            borderRadius: 60,
                            backgroundColor: Colors.secondary.light,
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: 24
                        }}>
                            <Ionicons name="checkmark" size={64} color={Colors.secondary.main} />
                        </View>
                        <Text style={{
                            fontSize: 28,
                            fontWeight: 'bold',
                            color: Colors.light.text.primary,
                            marginBottom: 12,
                            textAlign: 'center'
                        }}>
                            Cooking Complete!
                        </Text>
                        <Text style={{
                            fontSize: 16,
                            color: Colors.light.text.secondary,
                            textAlign: 'center',
                            marginBottom: 32
                        }}>
                            All steps finished. Enjoy your meal!
                        </Text>
                        <TouchableOpacity
                            onPress={() => router.back()}
                            style={{
                                paddingHorizontal: 32,
                                paddingVertical: 16,
                                borderRadius: 12,
                                backgroundColor: Colors.primary.main
                            }}
                        >
                            <Text style={{
                                fontSize: 16,
                                fontWeight: '600',
                                color: 'white'
                            }}>
                                Done
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}
            </ScrollView>
        </View>
    );
}
