import { View, Image, StatusBar, Alert } from "react-native";
import { useState } from "react";

import { Input } from "@/components/input";
import { Button } from "@/components/button";

import { api } from "@/server/api";

import { colors } from "@/styles/colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Link, Redirect } from "expo-router";

import { useBadgeStore } from "@/store/badge-store";

export default function Home() {
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const badgeStore = useBadgeStore();
  //console.log("Dados => ", badgeStore.data);

  async function handleAccessCredential() {
    try {
      if (!code.trim()) {
        return Alert.alert("Error", "Please enter a ticket code!");
      }

      setIsLoading(true);

      const badgeResponse = await api.get(`/attendees/${code}/badge`);
      console.log(badgeResponse.data.badge);
      badgeStore.save(badgeResponse.data.badge);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      Alert.alert("Error", "Ticket not found!");
    }
  }

  if (badgeStore.data?.checkInURL) {
    return <Redirect href="/ticket" />;
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
          <MaterialCommunityIcons
            name="ticket-confirmation-outline"
            size={20}
            color={colors.green[200]}
          />
          <Input.Field
            placeholder="Ticket Code"
            //It can also be done in another way: onChangeText={setCode}
            onChangeText={(value) => setCode(value)}
          />
        </Input>

        <Button
          title="Credential"
          isLoading={isLoading}
          onPress={handleAccessCredential}
        />

        <Link
          href="/register"
          className="text-gray-100 text-base font-bold text-center mt-8"
        >
          Has no ticket yet?
        </Link>
      </View>
    </View>
  );
}
