import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Text, Input, Button } from '@planity/ui';
import { colors, spacing, radius } from '@planity/ui';
import { APP_DISPLAY_NAME } from './AppLogo';

type AuthMode = 'login' | 'signup';

interface AuthFormProps {
  initialMode?: AuthMode;
  onSubmit: (mode: AuthMode, data: any) => void;
}

export const AuthForm = React.memo<AuthFormProps>(function AuthForm({
  initialMode = 'login',
  onSubmit,
}) {
  const [mode, setMode] = useState<AuthMode>(initialMode);
  
  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [acceptedCGU, setAcceptedCGU] = useState(false);

  const handleSubmit = () => {
    onSubmit(mode, { email, password, phone, acceptedCGU });
  };

  const toggleMode = () => {
    setMode(prev => prev === 'login' ? 'signup' : 'login');
  };

  return (
    <View>
      {mode === 'login' ? (
        <>
          <Text variant="title3" style={styles.sectionTitle}>Already have an account?</Text>

          <Input
            label="Email *"
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Input
            label="Password *"
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity style={styles.forgotPassword}>
            <Text variant="footnote" style={styles.forgotPasswordText}>Forgot password?</Text>
          </TouchableOpacity>

          <Button 
            title="Sign in" 
            onPress={handleSubmit} 
            variant="primary" 
            style={styles.mainButton} 
          />

          {/* Divider */}
          <View style={styles.orContainer}>
            <View style={styles.orLine} />
            <Text variant="footnote" weight="600" color={colors.light.textSecondary} style={styles.orText}>OU</Text>
            <View style={styles.orLine} />
          </View>

          {/* Signup Link Section */}
          <Text variant="title3" style={styles.sectionTitleCenter}>New to {APP_DISPLAY_NAME}?</Text>

          <Button 
            title="Create account" 
            onPress={toggleMode} 
            variant="outline" 
            style={styles.secondaryButton} 
          />

          <Button 
            title="Cookie settings" 
            variant="ghost" 
            size="sm"
            style={{ alignSelf: 'center' }}
          />
        </>
      ) : (
        <>
          <Text variant="title3" style={styles.sectionTitleCenter}>New to {APP_DISPLAY_NAME}?</Text>

          <Input
            label="Phone *"
            placeholder="Enter your number..."
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            leftIcon={
               <View style={styles.flagContainer}>
                  <View style={styles.flagIcon}>
                    <View style={{flex:1, backgroundColor:'#0055A4'}} />
                    <View style={{flex:1, backgroundColor:'#FFFFFF'}} />
                    <View style={{flex:1, backgroundColor:'#EF4135'}} />
                  </View>
                  <Ionicons name="caret-down" size={10} color={colors.light.text} style={{marginLeft: 6}} />
               </View>
            }
          />

          <Input
            label="Email *"
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Input
            label="Password *"
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity 
            style={styles.checkboxContainer} 
            onPress={() => setAcceptedCGU(!acceptedCGU)}
            activeOpacity={0.8}
          >
            <View style={[styles.checkbox, acceptedCGU && styles.checkboxChecked]}>
              {acceptedCGU && <Ionicons name="checkmark" size={14} color={colors.light.surface} />}
            </View>
            <Text variant="body" style={styles.checkboxLabel}>I accept the <Text style={styles.linkText}>terms of service</Text>.</Text>
          </TouchableOpacity>

          <Button 
            title="Create account" 
            onPress={handleSubmit} 
            variant="primary" 
            style={styles.mainButton} 
          />

          <Text variant="caption" color={colors.light.textSecondary} style={styles.legalText}>
            Your data is processed by {APP_DISPLAY_NAME}. See our <Text style={styles.linkText}>privacy policy</Text>. This site is protected by reCAPTCHA and subject to Google's privacy policy and terms.
          </Text>

          <View style={styles.orContainer}>
            <View style={styles.orLine} />
            <Text variant="footnote" weight="600" color={colors.light.textSecondary} style={styles.orText}>OR</Text>
            <View style={styles.orLine} />
          </View>

          <Text variant="title3" style={styles.sectionTitleCenter}>Already have an account?</Text>

          <Button 
            title="Sign in" 
            onPress={toggleMode} 
            variant="outline" 
            style={styles.secondaryButton} 
          />
        </>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  sectionTitle: {
    marginBottom: spacing.xl,
    textAlign: 'center',
  },
  sectionTitleCenter: {
    marginBottom: spacing.xl,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  flagContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  flagIcon: {
    width: 24,
    height: 16,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#EEE',
  },
  forgotPassword: {
    alignSelf: 'flex-start',
    marginBottom: spacing.xl,
  },
  forgotPasswordText: {
    textDecorationLine: 'underline',
  },
  mainButton: {
    marginBottom: spacing.lg,
  },
  secondaryButton: {
    marginBottom: spacing.lg,
  },
  orContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing['2xl'],
    marginTop: spacing.lg,
  },
  orLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.light.border,
  },
  orText: {
    marginHorizontal: spacing.lg,
    textTransform: 'uppercase',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: colors.light.border,
    borderRadius: radius.sm,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: colors.light.text,
    borderColor: colors.light.text,
  },
  checkboxLabel: {
    fontSize: 14,
  },
  linkText: {
    textDecorationLine: 'underline',
  },
  legalText: {
    marginTop: 0,
    lineHeight: 18,
    textAlign: 'left',
  },
});
