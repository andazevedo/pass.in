import { View, Image, StatusBar, Alert } from "react-native";
import { useState } from "react";
import { Input } from "@/components/input";
import { Button } from "@/components/button";

import { useBadgeStore } from "@/store/badge-store";

import { colors } from "@/styles/colors";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { Link, router } from "expo-router";

import { api } from "@/server/api";
import axios from "axios";

const EVENT_ID = "cc1dfe8b-265f-4d15-84e9-434c98051390";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const badgeStore = useBadgeStore();

  async function handleRegister() {
    try {
      if (!name.trim() || !email.trim()) {
        return Alert.alert("Error", "Please fill in all fields");
      }
      setIsLoading(true);

      const registerResponse = await api.post(`/events/${EVENT_ID}/attendees`, {
        name,
        email,
      });
      //console.log(registerResponse.data.attendeeId);
      //console.log(registerResponse.data);

      if (registerResponse.data.attendeeId) {
        const badgeResponse = await api.get(
          `/attendees/${registerResponse.data.attendeeId}/badge`
        );

        badgeStore.save(badgeResponse.data.badge);

        Alert.alert("Register", "User registered successfully!", [
          {
            text: "OK",
            onPress: () => router.push("/ticket"),
          },
        ]);
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);

      if (axios.isAxiosError(error)) {
        console.log("API Error Response:", error.response?.data);
        if (
          String(error.response?.data.errors.name).includes(
            "at least 4 character"
          )
        ) {
          return Alert.alert("Register", "Name must be at least 4 characters");
        }
        if (
          String(error.response?.data.message).includes("already registered")
        ) {
          return Alert.alert("Register", "Email already registered");
        }
      }
      // console.log(name, email);
      Alert.alert("Error", "It was not possible to register the user");
    }
  }

  return (
    <View className="flex-1 bg-green-500 items-center justify-center p-8">
      <StatusBar barStyle="light-content" />

      <Image
        source={require("@/assets/logo.png")}
        className="h-16"
        resizeMode="contain"
      />
      <View className="w-full mt-12 gap-3">
        <Input>
          <FontAwesome name="user-circle" size={20} color={colors.green[200]} />
          <Input.Field placeholder="Full Name" onChangeText={setName} />
        </Input>

        <Input>
          <MaterialIcons
            name="alternate-email"
            size={20}
            color={colors.green[200]}
          />
          <Input.Field
            placeholder="E-mail"
            keyboardType="email-address"
            onChangeText={setEmail}
          />
        </Input>

        <Button
          title="Register"
          onPress={handleRegister}
          isLoading={isLoading}
        />

        <Link
          href="/"
          className="text-gray-100 text-base font-bold text-center mt-8"
        >
          {" "}
          Already have a ticket?{" "}
        </Link>
      </View>
    </View>
  );
}
