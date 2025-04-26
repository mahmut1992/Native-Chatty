import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import {
  List,
  Avatar,
  Divider,
  FAB,
  Dialog,
  Portal,
  Button,
  TextInput,
} from "react-native-paper";
import { collection, addDoc } from "firebase/firestore";
import db, { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";
import { onSnapshot } from "firebase/firestore";
import { query, where } from "firebase/firestore";

const ChatList = () => {
  const navigation = useNavigation();
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [chats, setChats] = useState([]);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setEmail(user?.email);
    });
  }, []);

  const createChat = async () => {
    if (!email || !userEmail) return;
    setIsLoading(true);
    const docRef = await addDoc(collection(db, "chats"), {
      users: [email, userEmail],
    });
    setIsLoading(false);
    setIsDialogVisible(false);
    navigation.navigate("Chat", { chatId: docRef.id });
  };

  useEffect(() => {
    if (!email) return;

    const chatsQuery = query(
      collection(db, "chats"),
      where("users", "array-contains", email)
    );

    const unsubscribe = onSnapshot(chatsQuery, (querySnapshot) => {
      setChats(querySnapshot.docs);
    });

    return () => unsubscribe();
  }, [email]);

  return (
    <View style={{ flex: 1 }}>
      {chats.map((chat, key) => (
        <>
          <List.Item
            style={{ paddingLeft: 10 }}
            onPress={() => navigation.navigate("Chat", { chatId: chat.id })}
            key={key}
            title={chat.data().users.find((x) => x !== email)}
            description={(chat.data().messages ?? [])[0]?.text ?? "Hi I'm Hear"}
            left={() => (
              <Avatar.Text
                label={chat
                  .data()
                  .users.find((x) => x !== email)
                  .split(" ")
                  .reduce((prev, current) => prev + current[0], "")}
                size={56}
              />
            )}
          />
          <Divider style={{ marginLeft: 72 }} />
        </>
      ))}

      <Portal>
        <Dialog
          onDismiss={() => setIsDialogVisible(false)}
          visible={isDialogVisible}
        >
          <Dialog.Title>New Chat</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Enter user email"
              value={userEmail}
              onChangeText={(text) => setUserEmail(text)}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setIsDialogVisible(false)}>Cancel</Button>
            <Button onPress={createChat} loading={isLoading}>
              Save
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      <FAB
        style={{ position: "absolute", bottom: 16, right: 16 }}
        icon="plus"
        onPress={() => setIsDialogVisible(true)}
      />
    </View>
  );
};

export default ChatList;

const styles = StyleSheet.create({});
