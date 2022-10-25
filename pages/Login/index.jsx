import React, { useState, useEffect } from "react";
import { View, Text, Button, TouchableOpacity } from "react-native";
import { AuthLayout, FormInput } from "../../component";

import colors from "../../constants";
import { CrossIcon, CorrectIcon, EyeIcon, EyeCloseIcon } from "../../assets";

import { login } from "../../utils/redux/actions";
import { useDispatch } from "react-redux";
import { toFormData } from "../../utils/helper";

const Login = ({ navigation }) => {
  const dispatch = useDispatch();
  const [isFocus, setIsFocus] = useState({
    password: false,
    email: false,
  });

  const [passwordMessage, setPasswordMessage] = useState("");
  const [emailMessage, setEmailMessage] = useState("");
  const [input, setInput] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (name, value) => {
    setInput({
      ...input,
      [name]: value,
    });
  };

  function isValidEmail(value) {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(value).toLowerCase());
  }

  const handleLogin = async () => {
    dispatch(
      login(
        toFormData({
          email: input.email,
          password: input.password,
        })
      )
    )
      .then((res) => {
        alert("login berhasil");
      })
      .catch((err) => {
        setPasswordMessage(err.response.data.message);
      });
  };

  const onFocus = (name, value) => {
    setIsFocus({
      ...isFocus,
      [name]: value,
    });
  };

  const onBlur = (name, value) => {
    setIsFocus({
      ...isFocus,
      [name]: value,
    });
  };

  useEffect(() => {
    if (isFocus.password) {
      if (input.password.length >= 9) {
        setPasswordMessage("");
      } else {
        setPasswordMessage("password must be 9 characters");
      }
    } else {
      setPasswordMessage("");
    }

    if (isFocus.email) {
      const cek = isValidEmail(input.email);
      if (cek) {
        setEmailMessage("");
      } else {
        setEmailMessage("Invalid Email");
      }
    } else {
      const cek = isValidEmail(input.email);
      if (cek) {
        setEmailMessage("");
      } else {
        setEmailMessage("Invalid Email");
      }
    }
  }, [isFocus, input]);

  return (
    <AuthLayout
      navigation={navigation}
    >
      <View>
        <FormInput
          value={input.email}
          onChange={(value) => handleChange("email", value)}
          onFocus={() => onFocus("email", true)}
          onBlur={() => onBlur("email", false)}
          label="Email"
          errorMessage={emailMessage.length > 0 ? emailMessage : ""}
          icon={emailMessage.length > 0 ? CrossIcon : CorrectIcon}
          placeholder="Email Address"
        ></FormInput>
        <FormInput
          value={input.password}
          onChange={(value) => handleChange("password", value)}
          errorMessage={passwordMessage.length > 0 ? passwordMessage : ""}
          onFocus={() => onFocus("password", true)}
          onBlur={() => onBlur("password", false)}
          label="Password"
          icon={showPassword ? EyeCloseIcon : EyeIcon}
          onPressIcon={() => setShowPassword(!showPassword)}
          showPasswordState={showPassword}
          passwordInput
          placeholder="Password"
        ></FormInput>
      </View>

      <View style={{ marginVertical: 10 }}>
        <Button
          onPress={handleLogin}
          color={colors.greenPrimary}
          disabled={
            emailMessage.length > 0 ||
            passwordMessage.length > 0 ||
            input.email.length < 1 ||
            input.password.length < 1
          }
          title="Sign In"
        ></Button>
      </View>
      <TouchableOpacity
        onPress={() => navigation.replace("Register")}
        style={{
          marginVertical: 5,
          justifyContent: "center",
          flexDirection: "row",
        }}
      >
        <Text
          style={{
            fontSize: 15,
            color: colors.border,
            marginRight: 5,
          }}
        >
          Don't have an account?
        </Text>
        <Text
          style={{
            fontSize: 15,
            color: colors.greenPrimary,
          }}
        >
          Sign Up
        </Text>
      </TouchableOpacity>
    </AuthLayout>
  );
};

export default Login;
