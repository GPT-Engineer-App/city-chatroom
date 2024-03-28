import React, { useState, useEffect } from "react";
import { Box, Heading, Input, Button, Text, VStack, HStack, Avatar, Divider, Tabs, TabList, Tab, TabPanels, TabPanel, useToast } from "@chakra-ui/react";
import { FaPlus, FaUsers, FaComments } from "react-icons/fa";

const censorBadWords = (text) => {
  const badWords = ["curse", "bad", "racist"]; // Add more bad words
  return text
    .split(" ")
    .map((word) => (badWords.includes(word.toLowerCase()) ? "****" : word))
    .join(" ");
};

const ChatMessage = ({ message, isCurrentUser }) => (
  <Box p={2} bg={isCurrentUser ? "blue.100" : "gray.100"} borderRadius="md" alignSelf={isCurrentUser ? "flex-end" : "flex-start"}>
    <Text>{message.text}</Text>
  </Box>
);

const ChatRoom = ({ chatRoom, currentUser, onSendMessage }) => {
  const [messageText, setMessageText] = useState("");

  const handleSendMessage = () => {
    if (messageText.trim() !== "") {
      onSendMessage(chatRoom.id, censorBadWords(messageText));
      setMessageText("");
    }
  };

  return (
    <VStack h="400px" spacing={4} align="stretch">
      <Box flex={1} overflowY="auto" px={4}>
        {chatRoom.messages.map((message, index) => (
          <ChatMessage key={index} message={message} isCurrentUser={message.userId === currentUser.id} />
        ))}
      </Box>
      <HStack px={4} pb={4}>
        <Input value={messageText} onChange={(e) => setMessageText(e.target.value)} placeholder="Type a message..." />
        <Button onClick={handleSendMessage}>Send</Button>
      </HStack>
    </VStack>
  );
};

const Index = () => {
  const [chatRooms, setChatRooms] = useState([
    {
      id: 1,
      name: "Global Chat",
      messages: [
        { userId: 1, text: "Hello world!" },
        { userId: 2, text: "Hi there!" },
      ],
    },
    {
      id: 2,
      name: "New York",
      messages: [
        { userId: 1, text: "Anyone from NY here?" },
        { userId: 3, text: "Yep, I'm from Manhattan!" },
      ],
    },
  ]);
  const [currentUser] = useState({ id: 1, name: "John" });
  const [selectedChatRoomId, setSelectedChatRoomId] = useState(1);
  const toast = useToast();

  const selectedChatRoom = chatRooms.find((room) => room.id === selectedChatRoomId);

  const handleSendMessage = (roomId, messageText) => {
    setChatRooms((prevChatRooms) =>
      prevChatRooms.map((room) =>
        room.id === roomId
          ? {
              ...room,
              messages: [...room.messages, { userId: currentUser.id, text: messageText }],
            }
          : room,
      ),
    );
  };

  const handleCreateChatRoom = () => {
    const roomName = prompt("Enter a name for the new chat room:");
    if (roomName) {
      const newChatRoom = {
        id: chatRooms.length + 1,
        name: roomName,
        messages: [],
      };
      setChatRooms([...chatRooms, newChatRoom]);
      setSelectedChatRoomId(newChatRoom.id);
      toast({
        title: "Chat room created.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box maxW="600px" mx="auto" p={4}>
      <Heading mb={4}>Chat App</Heading>
      <Tabs isFitted variant="enclosed">
        <TabList>
          <Tab>
            <HStack spacing={2}>
              <FaComments />
              <Text>Chat Rooms</Text>
            </HStack>
          </Tab>
          <Tab>
            <HStack spacing={2}>
              <FaUsers />
              <Text>Friends</Text>
            </HStack>
          </Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <HStack spacing={4} mb={4}>
              {chatRooms.map((room) => (
                <Button key={room.id} onClick={() => setSelectedChatRoomId(room.id)} variant={room.id === selectedChatRoomId ? "solid" : "ghost"}>
                  {room.name}
                </Button>
              ))}
              <Button leftIcon={<FaPlus />} onClick={handleCreateChatRoom}>
                New Room
              </Button>
            </HStack>
            <Divider mb={4} />
            {selectedChatRoom && <ChatRoom chatRoom={selectedChatRoom} currentUser={currentUser} onSendMessage={handleSendMessage} />}
          </TabPanel>
          <TabPanel>
            <Text>Friends list coming soon!</Text>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default Index;
