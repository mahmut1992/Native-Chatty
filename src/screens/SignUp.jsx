import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { TextInput, Button, Subheading } from "react-native-paper";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";
import { auth } from "../firebase";

const SignUp = () => {
  const navigation = useNavigation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const createAccount = () => {
    setIsLoading(true);
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;

        navigation.navigate("ChatList");
      })

      .catch((e) => {
        setIsLoading(false);
        setError(e.message);
      });
  };

  const goTosıgnIn = () => {
    setName("");
    setEmail("");
    setPassword("");
    navigation.navigate("SignIn");
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
        label="Name"
        value={name}
        onChangeText={(text) => setName(text)}
      />
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
        <Button onPress={goTosıgnIn} compact>
          Sign In
        </Button>
        <Button onPress={createAccount} mode="contained" loading={isLoading}>
          Sign Up
        </Button>
      </View>
    </View>
  );
};

export default SignUp;

const styles = StyleSheet.create({});
