import React, { useMemo, useCallback, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar, ScrollView, TouchableOpacity, TextInput, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SalonDetailsHeader, StaffMember } from '../components';
import { MOCK_SALONS } from '../constants';
import { ServiceItem } from '../types';
import { useAuth } from '../../../application/providers';
import { validateEmail, validatePassword, validatePhone } from '../utils/validations';

// Mock staff data (duplicate from BookingScreen, ideally this comes from API/constants)
const MOCK_STAFF: StaffMember[] = [
  { id: '1', name: 'Emma' },
  { id: '2', name: 'Julie' },
  { id: '3', name: 'Sandrine' },
  { id: '4', name: 'Serjio' },
];

type AuthMode = 'selection' | 'login' | 'signup';

const PLACEHOLDER_COLOR = '#A0A0A0'; // Low opacity placeholder color

export default function BookingValidationScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ 
    salonId: string; 
    serviceIds: string; // Comma separated IDs
    staffId?: string;
    date: string;
    time: string;
  }>();
  
  const { user, login } = useAuth();
  
  // Parse params
  const { salonId, serviceIds, staffId, date, time } = params;

  // Local State
  const [authMode, setAuthMode] = useState<AuthMode>('selection');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [acceptedCGU, setAcceptedCGU] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Find salon
  const salon = useMemo(() => MOCK_SALONS.find((s) => s.id === salonId), [salonId]);

  // Find services
  const selectedServices = useMemo(() => {
    if (!salon || !serviceIds) return [];
    const ids = serviceIds.split(',');
    const services: ServiceItem[] = [];
    
    // Helper to find a service
    const findService = (id: string) => {
      for (const category of salon.services) {
        const found = category.items.find(item => item.id === id);
        if (found) return found;
      }
      return undefined;
    };

    ids.forEach(id => {
      const s = findService(id);
      if (s) services.push(s);
    });
    
    return services;
  }, [salon, serviceIds]);

  // Find staff
  const staffMember = useMemo(() => {
    if (!staffId) return null;
    return MOCK_STAFF.find(s => s.id === staffId);
  }, [staffId]);

  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  const handleEditTime = () => {
    router.back(); // Go back to booking screen to edit time
  };

  const handleDeleteService = (index: number) => {
    // In a real app, this would update the list and maybe go back if empty
    // For now, we'll just go back as "modifying" the selection
    router.back();
  };

  const handleLogin = () => {
    const newErrors: Record<string, string> = {};

    if (!email.trim()) {
        newErrors.email = "L'email est requis.";
    } else if (!validateEmail(email)) {
        newErrors.email = "Format d'email invalide.";
    }
    if (!validatePassword(password)) newErrors.password = 'Le mot de passe est requis.';

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
        // Mock login logic
        login({
            id: 'mock-user',
            email: email || 'user@example.com',
            name: 'Utilisateur Test',
            role: 'client'
        });
    }
  };

  const handleSignup = () => {
      const newErrors: Record<string, string> = {};

      if (!validatePhone(phone)) newErrors.phone = 'Le numéro de téléphone est requis.';
      if (!email.trim()) {
          newErrors.email = "L'email est requis.";
      } else if (!validateEmail(email)) {
          newErrors.email = "Format d'email invalide.";
      }
      if (!validatePassword(password)) newErrors.password = 'Le mot de passe est requis.';
      if (!acceptedCGU) newErrors.cgu = 'Vous devez accepter les CGU.';

      setErrors(newErrors);

      if (Object.keys(newErrors).length === 0) {
          // Mock signup logic
          login({
              id: 'mock-user',
              email: email || 'user@example.com',
              name: 'Utilisateur Test',
              role: 'client'
          });
      }
  };

  if (!salon) return null;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <SalonDetailsHeader onBack={handleBack} />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Salon Name Title */}
        <View style={styles.titleContainer}>
          <Text style={styles.salonName}>{salon.name}</Text>
        </View>

        {/* Step 1: Services Summary */}
        <View style={styles.section}>
          <Text style={styles.stepTitle}>1. Prestation sélectionnée</Text>
          
          <View style={styles.card}>
            {selectedServices.map((service, index) => (
              <View key={`${service.id}-${index}`}>
                <View style={styles.serviceRow}>
                  <View style={styles.serviceInfo}>
                    <Text style={styles.serviceName}>{service.name}</Text>
                    <Text style={styles.serviceMeta}>
                      {service.duration} • {service.price}
                    </Text>
                    {staffMember && (
                      <Text style={styles.staffName}>avec {staffMember.name}</Text>
                    )}
                  </View>
                  <TouchableOpacity onPress={() => handleDeleteService(index)}>
                    <Text style={styles.deleteLink}>Supprimer</Text>
                  </TouchableOpacity>
                </View>
                
                {index < selectedServices.length - 1 && <View style={styles.itemDivider} />}
              </View>
            ))}
          </View>
        </View>

        {/* Step 2: Date Summary */}
        <View style={styles.section}>
          <Text style={styles.stepTitle}>2. Date et heure sélectionnées</Text>
          
          <View style={styles.card}>
            <View style={styles.selectedTimeContainer}>
              <View>
                <Text style={styles.selectedDateText}>{date}</Text>
                <Text style={styles.selectedTimeText}>à {time}</Text>
              </View>
              <TouchableOpacity onPress={handleEditTime}>
                <Text style={styles.modifyLink}>Modifier</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Step 3: Identification */}
        <View style={styles.section}>
          <Text style={styles.stepTitle}>3. Identification</Text>
          
          {user ? (
            <View style={styles.card}>
               <Text style={styles.loggedInText}>Connecté en tant que {user.name}</Text>
               <TouchableOpacity style={styles.confirmButton}>
                 <Text style={styles.confirmButtonText}>Confirmer le rendez-vous</Text>
               </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.authContainer}>
              {authMode === 'selection' && (
                <>
                  <Text style={styles.authLabel}>Nouveau sur Rendez ?</Text>
                  
                  <TouchableOpacity 
                    style={styles.signupButton}
                    onPress={() => {
                        setAuthMode('signup');
                        setErrors({});
                    }}
                  >
                    <Text style={styles.signupButtonText}>Créer mon compte</Text>
                  </TouchableOpacity>

                  <View style={styles.orContainer}>
                    <View style={styles.orLine} />
                    <Text style={styles.orText}>OU</Text>
                    <View style={styles.orLine} />
                  </View>

                  <Text style={styles.authLabel}>Vous avez déjà utilisé Rendez ?</Text>
                  
                  <TouchableOpacity 
                    style={styles.loginButton}
                    onPress={() => {
                        setAuthMode('login');
                        setErrors({});
                    }}
                  >
                    <Text style={styles.loginButtonText}>Se connecter</Text>
                  </TouchableOpacity>
                </>
              )}

              {authMode === 'signup' && (
                <>
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Téléphone portable *</Text>
                    <View style={[styles.phoneInputContainer, errors.phone && styles.inputError]}>
                      <View style={styles.flagContainer}>
                        {/* CSS French Flag */}
                        <View style={styles.flagIcon}>
                          <View style={styles.flagStripeBlue} />
                          <View style={styles.flagStripeWhite} />
                          <View style={styles.flagStripeRed} />
                        </View>
                        <Ionicons name="caret-down" size={10} color="#000" style={{marginLeft: 4}} />
                      </View>
                      <TextInput 
                        style={styles.input}
                        placeholder="Entrer votre numéro..."
                        placeholderTextColor={PLACEHOLDER_COLOR}
                        value={phone}
                        onChangeText={(text) => {
                            setPhone(text);
                            if(errors.phone) setErrors({...errors, phone: ''});
                        }}
                        keyboardType="phone-pad"
                      />
                    </View>
                    {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Email *</Text>
                    <TextInput 
                      style={[styles.inputField, errors.email && styles.inputError]}
                      placeholder="Email"
                      placeholderTextColor={PLACEHOLDER_COLOR}
                      value={email}
                      onChangeText={(text) => {
                          setEmail(text);
                          if(errors.email) setErrors({...errors, email: ''});
                      }}
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />
                    {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Mot de passe *</Text>
                    <View style={[styles.passwordContainer, errors.password && styles.inputError]}>
                      <TextInput 
                        style={styles.passwordInput}
                        placeholder="Mot de passe"
                        placeholderTextColor={PLACEHOLDER_COLOR}
                        value={password}
                        onChangeText={(text) => {
                            setPassword(text);
                            if(errors.password) setErrors({...errors, password: ''});
                        }}
                        secureTextEntry={secureTextEntry}
                      />
                      <TouchableOpacity onPress={() => setSecureTextEntry(!secureTextEntry)}>
                        <Ionicons name={secureTextEntry ? "eye-off-outline" : "eye-outline"} size={20} color="#000" />
                      </TouchableOpacity>
                    </View>
                    {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
                  </View>

                  <TouchableOpacity 
                    style={styles.checkboxContainer} 
                    onPress={() => {
                        setAcceptedCGU(!acceptedCGU);
                        if(errors.cgu) setErrors({...errors, cgu: ''});
                    }}
                    activeOpacity={0.8}
                  >
                    <View style={[styles.checkbox, acceptedCGU && styles.checkboxChecked, errors.cgu && styles.inputError]}>
                       {acceptedCGU && <Ionicons name="checkmark" size={14} color="#FFF" />}
                    </View>
                    <Text style={styles.checkboxLabel}>J'accepte les <Text style={{textDecorationLine: 'underline'}}>CGU</Text> de Planity.</Text>
                  </TouchableOpacity>
                  {errors.cgu && <Text style={[styles.errorText, { marginTop: -16, marginBottom: 16 }]}>{errors.cgu}</Text>}

                  <TouchableOpacity 
                    style={styles.loginButton}
                    onPress={handleSignup}
                  >
                    <Text style={styles.loginButtonText}>Créer mon compte</Text>
                  </TouchableOpacity>

                  <Text style={styles.legalText}>
                    Vos informations sont traitées par Rendez, consultez notre <Text style={{textDecorationLine: 'underline'}}>politique de confidentialité</Text>. Ce site est protégé par reCAPTCHA et est soumis à la <Text style={{textDecorationLine: 'underline'}}>Politique de Confidentialité</Text> et aux <Text style={{textDecorationLine: 'underline'}}>Conditions d'Utilisations</Text> de Google.
                  </Text>

                  <View style={styles.orContainer}>
                    <View style={styles.orLine} />
                    <Text style={styles.orText}>OU</Text>
                    <View style={styles.orLine} />
                  </View>

                  <TouchableOpacity 
                    style={styles.signupButton}
                    onPress={() => {
                        setAuthMode('login');
                        setErrors({});
                    }}
                  >
                    <Text style={styles.signupButtonText}>Se connecter</Text>
                  </TouchableOpacity>
                </>
              )}

              {authMode === 'login' && (
                <>
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Email *</Text>
                    <TextInput 
                      style={[styles.inputField, errors.email && styles.inputError]}
                      placeholder="Email"
                      placeholderTextColor={PLACEHOLDER_COLOR}
                      value={email}
                      onChangeText={(text) => {
                          setEmail(text);
                          if(errors.email) setErrors({...errors, email: ''});
                      }}
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />
                    {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Mot de passe *</Text>
                    <View style={[styles.passwordContainer, errors.password && styles.inputError]}>
                      <TextInput 
                        style={styles.passwordInput}
                        placeholder="Mot de passe"
                        placeholderTextColor={PLACEHOLDER_COLOR}
                        value={password}
                        onChangeText={(text) => {
                            setPassword(text);
                            if(errors.password) setErrors({...errors, password: ''});
                        }}
                        secureTextEntry={secureTextEntry}
                      />
                      <TouchableOpacity onPress={() => setSecureTextEntry(!secureTextEntry)}>
                        <Ionicons name={secureTextEntry ? "eye-off-outline" : "eye-outline"} size={20} color="#000" />
                      </TouchableOpacity>
                    </View>
                    {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
                  </View>
                  
                  <TouchableOpacity style={{alignSelf: 'flex-start', marginBottom: 24}}>
                    <Text style={styles.forgotPasswordText}>Mot de passe oublié ?</Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    style={styles.loginButton}
                    onPress={handleLogin}
                  >
                    <Text style={styles.loginButtonText}>Se connecter</Text>
                  </TouchableOpacity>

                  <View style={styles.orContainer}>
                    <View style={styles.orLine} />
                    <Text style={styles.orText}>OU</Text>
                    <View style={styles.orLine} />
                  </View>

                  <TouchableOpacity 
                    style={styles.signupButton}
                    onPress={() => {
                        setAuthMode('signup');
                        setErrors({});
                    }}
                  >
                    <Text style={styles.signupButtonText}>Créer mon compte</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    flex: 1,
    paddingBottom: 40,
  },
  titleContainer: {
    padding: 16,
    paddingBottom: 8,
  },
  salonName: {
    fontSize: 22,
    color: '#000000',
    fontFamily: 'Inter-Regular',
    lineHeight: 32,
    fontWeight: '600',
  },
  section: {
    padding: 16,
    paddingTop: 8,
  },
  stepTitle: {
    fontSize: 18,
    color: '#5856D6', // Planity blue/purple
    fontFamily: 'Inter-Medium',
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    marginBottom: 16,
  },
  serviceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  itemDivider: {
    height: 1,
    backgroundColor: '#F2F2F7',
    marginVertical: 16,
  },
  serviceInfo: {
    flex: 1,
    marginRight: 16,
  },
  serviceName: {
    fontSize: 16,
    color: '#000000',
    fontFamily: 'Inter-Regular',
    marginBottom: 4,
  },
  serviceMeta: {
    fontSize: 14,
    color: '#666666',
    fontFamily: 'Inter-Regular',
  },
  staffName: {
    fontSize: 14,
    color: '#666666',
    fontFamily: 'Inter-Regular',
    marginTop: 4,
  },
  deleteLink: {
    fontSize: 14,
    color: '#5856D6',
    fontFamily: 'Inter-Regular',
    textDecorationLine: 'underline',
  },
  selectedTimeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  selectedDateText: {
    fontSize: 16,
    color: '#000000',
    fontFamily: 'Inter-Regular',
    marginBottom: 4,
  },
  selectedTimeText: {
    fontSize: 14,
    color: '#666666',
    fontFamily: 'Inter-Regular',
  },
  modifyLink: {
    fontSize: 14,
    color: '#5856D6',
    fontFamily: 'Inter-Regular',
    textDecorationLine: 'underline',
  },
  // Auth Section Styles
  authContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    paddingTop: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  authLabel: {
    fontSize: 16,
    color: '#000000',
    fontFamily: 'Inter-Medium',
    marginBottom: 16,
    textAlign: 'center',
  },
  signupButton: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#000000',
    alignItems: 'center',
    marginBottom: 0,
  },
  signupButtonText: {
    fontSize: 15,
    color: '#000000',
    fontFamily: 'Inter-Medium',
  },
  orContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginVertical: 24,
  },
  orLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E5EA',
  },
  orText: {
    marginHorizontal: 16,
    color: '#666666',
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    textTransform: 'uppercase',
  },
  loginButton: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 8,
    backgroundColor: '#1C1C1E',
    alignItems: 'center',
  },
  loginButtonText: {
    fontSize: 15,
    color: '#FFFFFF',
    fontFamily: 'Inter-Medium',
  },
  loggedInText: {
    fontSize: 16,
    color: '#000000',
    fontFamily: 'Inter-Regular',
    marginBottom: 16,
    textAlign: 'center',
  },
  confirmButton: {
    backgroundColor: '#1C1C1E',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-Medium',
  },
  // Input Styles
  inputGroup: {
    marginBottom: 16,
    width: '100%',
  },
  label: {
    fontSize: 14,
    color: '#000000',
    fontFamily: 'Inter-Medium',
    marginBottom: 8,
  },
  inputField: {
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    fontFamily: 'Inter-Regular',
  },
  phoneInputContainer: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 8,
    overflow: 'hidden',
  },
  flagContainer: {
    width: 60,
    backgroundColor: '#F9F9F9',
    borderRightWidth: 1,
    borderRightColor: '#E5E5EA',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  flagIcon: {
    width: 20,
    height: 14,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#EEE',
  },
  flagStripeBlue: {
    flex: 1,
    backgroundColor: '#0055A4',
  },
  flagStripeWhite: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  flagStripeRed: {
    flex: 1,
    backgroundColor: '#EF4135',
  },
  input: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    fontFamily: 'Inter-Regular',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 8,
    paddingHorizontal: 16,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 15,
    fontFamily: 'Inter-Regular',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#C7C7CC',
    borderRadius: 4,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#000',
    borderColor: '#000',
  },
  checkboxLabel: {
    fontSize: 14,
    color: '#000',
    fontFamily: 'Inter-Regular',
  },
  legalText: {
    fontSize: 12,
    color: '#8E8E93',
    fontFamily: 'Inter-Regular',
    marginTop: 16,
    lineHeight: 18,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: '#000',
    fontFamily: 'Inter-Medium',
    textDecorationLine: 'underline',
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    marginTop: 4,
    marginLeft: 4,
  },
  inputError: {
    borderColor: '#FF3B30',
  },
});
