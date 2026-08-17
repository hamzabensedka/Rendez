import React, { useState } from 'react';
import { Image, TextInput } from 'react-native';

const EditProfileScreen = () => {
  const [avatar, setAvatar] = useState('');

  return (
    <TextInput
      placeholder="https://via.placeholder.com/150"
      value={avatar}
      onChangeText={(text) => setAvatar(text)}
    />
  );
};

export default EditProfileScreen;