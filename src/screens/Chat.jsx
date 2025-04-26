import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import db, { auth } from "../firebase";
import { GiftedChat, InputToolbar } from "react-native-gifted-chat";
import { onAuthStateChanged } from "firebase/auth";

const Chat = ({ route }) => {
  const { chatId } = route.params;
  const [messages, setMessages] = useState([]);
  const [uid, setUid] = useState("");
  const [name, setName] = useState("");
  useEffect(() => {
    return onAuthStateChanged(auth, (user) => {
      setUid(user?.uid);
      setName(user?.displayName);
    });
  }, []);

  useEffect(() => {
    const docRef = doc(db, "chats", chatId);
    const unsubscribe = onSnapshot(docRef, (snapshot) => {
      const data = snapshot.data();
      setMessages(data?.messages ?? []);
    });

    return () => unsubscribe(); // Temizlik
  }, [chatId]);

  const onSend = async (newMessages = []) => {
    const docRef = doc(db, "chats", route.params.chatId);

    await setDoc(
      docRef,
      {
        messages: GiftedChat.append(messages, newMessages),
      },
      { merge: true }
    );
  };
  //  <GiftedChat
  // messages={messages.map((x) => ({
  //   ...x,
  //   createdAt: x?.createdAt?.toDate(),
  // }))}
  // onSend={onSend}
  // user={{ _id: uid, name }}
  // locale="tr"
  // renderDay={null}
  // renderTime={null}
  // isKeyboardInternallyHandled={false}
  // bottomOffset={20} // iPhone safe area için
  // textInputProps={{
  //   style: {
  //     paddingHorizontal: 12,
  //     paddingVertical: 8,
  //     borderRadius: 20,
  //     borderWidth: 1,
  //     borderColor: "#ccc",
  //     margin: 8,
  //     flex: 1,
  //   },
  // }}
  // renderInputToolbar={(props) => (
  //   <InputToolbar
  //     {...props}
  //     containerStyle={{
  //       borderTopWidth: 1,
  //       borderTopColor: "#ccc",
  //       padding: 4,
  //       marginBottom: 40,
  //     }}
  //   />

  ///>
  return (
    <View style={{ flex: 1 }}>
      <GiftedChat
        messages={messages.map((x) => ({
          ...x,
          createdAt: x.createdAt?.toDate(),
        }))}
        onSend={(messages) => onSend(messages)}
        user={{
          _id: uid,
          name: name,
        }}
      />
    </View>
  );
};

export default Chat;

const styles = StyleSheet.create({});
