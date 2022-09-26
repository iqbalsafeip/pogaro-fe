import React, { useState, useEffect } from "react";
import { View, Text, Button, TouchableOpacity } from "react-native";
import { AuthLayout, FormInput } from "../../component";

import colors from "../../constants";
import { CrossIcon, CorrectIcon, EyeIcon, EyeCloseIcon } from "../../assets";
import { useDispatch } from "react-redux";
import { register } from "../../utils/redux/actions";
import { toFormData } from "../../utils/helper";

const Register = ({ navigation }) => {
  const dispatch = useDispatch();
  const [isFocus, setIsFocus] = useState({
    password: false,
    email: false,
    username: false,
    nama_barber: false
  });

  const [passwordMessage, setPasswordMessage] = useState("");
  const [emailMessage, setEmailMessage] = useState("");
  const [usernameMessage, setUsernameMessage] = useState("");
  const [names, setnames] = useState("");
  const [input, setInput] = useState({
    email: "",
    username: "",
    password: "",
    nama_barber: ""
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

    if (isFocus.username) {
      if (input.username.length >= 9) {
        setUsernameMessage("");
      } else {
        setUsernameMessage("Username must be 9 characters");
      }
    } else {
      setUsernameMessage("");
    }
  }, [isFocus, input]);

  const handleRegister = () => {
    dispatch(
      register(
        toFormData({
          email: input.email,
          name: input.username,
          password: input.password,
          nama_barber: input.nama_barber,
          role: "barber",
        })
      )
    ).then((res) => {
      alert("register berhasil");
    });
  };

  return (
    <AuthLayout
      navigation={navigation}
      title="Getting Started"
      subTitle="Create an account to continue"
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
          value={input.username}
          onChange={(value) => handleChange("username", value)}
          onFocus={() => onFocus("username", true)}
          onBlur={() => onBlur("username", false)}
          errorMessage={usernameMessage.length > 0 ? usernameMessage : ""}
          icon={usernameMessage.length > 0 ? CrossIcon : CorrectIcon}
          label="Nama"
          placeholder="Nama"
        ></FormInput>
        <FormInput
          value={input.nama_barber}
          onChange={(value) => handleChange("nama_barber", value)}
          onFocus={() => onFocus("nama_barber", true)}
          onBlur={() => onBlur("nama_barber", false)}
          errorMessage={names.length > 0 ? names : ""}
          icon={names.length > 0 ? CrossIcon : CorrectIcon}
          label="Nama Barber"
          placeholder="Nama Barber"
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
          onPress={handleRegister}
          color={colors.greenPrimary}
          disabled={
            emailMessage.length > 0 ||
            passwordMessage.length > 0 ||
            usernameMessage.length > 0 ||
            input.email.length < 1 ||
            input.password.length < 1 ||
            input.username.length < 1
          }
          title="Sign Up"
        ></Button>
      </View>
      <TouchableOpacity
        onPress={() => navigation.replace("Login")}
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
          Already have an account?
        </Text>
        <Text
          style={{
            fontSize: 15,
            color: colors.greenPrimary,
          }}
        >
          Sign In
        </Text>
      </TouchableOpacity>
    </AuthLayout>
  );
};

export default Register;
