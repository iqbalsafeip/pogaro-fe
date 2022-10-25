import React from 'react';
import {View, Text, Image, TouchableOpacity, ScrollView, StatusBar} from 'react-native';

import {Logo, FBIcon, GoogleIcon} from '../assets';
import colors from '../constants';

const AuthLayout = ({children, navigation, title, subTitle, otp}) => {
  const Header = () => {
    return (
        
      <View style={{marginTop: 20}}>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text
            style={{
              marginLeft: 10,
              fontSize: 30,
              color: colors.greenPrimary,
            }}>
            POGARO
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 25,
          }}>
          <Text
            style={{
              fontSize: 20,
              color: colors.blackPrimary,
            }}>
            {title}
          </Text>
          <Text
            style={{
              fontSize: 16,
              color: colors.border,
              textAlign: 'center',
            }}>
            {subTitle}
          </Text>
        </View>
      </View>
    );
  };
  return (
    <>
    <StatusBar />
    
    <View
      style={{
        display: 'flex',
        justifyContent: 'flex-start',
        // alignItems: 'center',
        flexDirection: 'column',
        backgroundColor: colors.whitePrimary,
        flex: 1,
      }}>
      <ScrollView
        contentContainerStyle={{flexGrow: 1}}
        showsVerticalScrollIndicator={false}>
        <Header></Header>
        <View
          style={{
            flex: 1,
            marginVertical: 20,
            paddingHorizontal: 20,
            width: '100%',
            flexDirection: 'column',
          }}>
          {children}
        </View>
        
      </ScrollView>
    </View>
    </>
  );
};

export default AuthLayout;