import React, { useState } from "react";
import { View, Button, Text } from "react-native";

const TestConnection = () => {
  const [response, setResponse] = useState("");

  const testConnection = async () => {
    try {
      const res = await fetch("https://anatomy-two.vercel.app");
      const text = await res.text();
      setResponse(text);
    } catch (error) {
      setResponse("Error: " + error.message);
    }
  };

  return (
    <View>
      <Button title="Test Connection" onPress={testConnection} />
      <Text>{response}</Text>
    </View>
  );
};

export default TestConnection;
