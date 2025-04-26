import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { TextInput, Button, Subheading } from "react-native-paper";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useNavigation } from "@react-navigation/native";
import { auth } from "../firebase";

const SignIn = () => {
  const navigation = useNavigation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const userSignIn = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;

        navigation.navigate("ChatList");
        setEmail("");
        setPassword("");
      })

      .catch((e) => {
        setIsLoading(false);
        setError(e.message);
      });
  };

  return (
    <View style={{ margin: 16 }}>
      {error && (
        <Subheading
          style={{ color: "red", textAlign: "center", marginBottom: 16 }}
        >
          {error}
        </Subheading>
      )}

      <TextInput
        label="Email"
        style={{ marginTop: 12 }}
        value={email}
        onChangeText={(text) => setEmail(text)}
        keyboardType="email-address"
      />
      <TextInput
        label="Password"
        style={{ marginTop: 12 }}
        value={password}
        onChangeText={(text) => setPassword(text)}
        secureTextEntry
      />
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: 16,
        }}
      >
        <Button onPress={() => navigation.navigate("SignUp")} compact>
          Sign Up
        </Button>
        <Button onPress={userSignIn} mode="contained" loading={isLoading}>
          Sign In
        </Button>
      </View>
    </View>
  );
};

export default SignIn;

const styles = StyleSheet.create({});
