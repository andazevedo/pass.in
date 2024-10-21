import { Credential } from "@/components/credential";
import { Header } from "@/components/header";
import {
  StatusBar,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  Share,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { Redirect } from "expo-router";
import { colors } from "@/styles/colors";
import { Button } from "@/components/button";

import { useBadgeStore } from "@/store/badge-store";

import { MotiView } from "moti";

import { useState } from "react";

import * as ImagePicker from "expo-image-picker";
import { QRCode } from "@/components/qrcode";

export default function Ticket() {
  // const [image, setImage] = useState("");
  const [showQRCode, setShowQRCode] = useState(false);

  const badgeStore = useBadgeStore();

  async function handleShare() {
    try {
      if (badgeStore.data?.checkInURL) {
        await Share.share({
          message: badgeStore.data.checkInURL,
        });
      }
    } catch (error) {
      console.log(error);
      console.log("It was not possible to share the credential");
    }
  }

  async function handleSelectImage() {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 4],
        //quality: 1,
      });

      if (result.assets != null) {
        badgeStore.updateAvatar(result.assets[0].uri);
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "It was not possible to select the image");
    }
  }

  if (!badgeStore.data?.checkInURL) {
    return <Redirect href="/" />;
  }
  return (
    <View className="flex-1 bg-green-500">
      <StatusBar barStyle="light-content" />

      <Header title="My credential" />
      <ScrollView
        className="-mt-28 -z-10"
        contentContainerClassName="px-8 pb-8"
        showsVerticalScrollIndicator={false}
      >
        <Credential
          data={badgeStore.data}
          onChangeAvatar={handleSelectImage}
          onshowQRCode={() => setShowQRCode(true)}
        />
        <MotiView
          from={{
            translateY: 0,
          }}
          animate={{
            translateY: 10,
          }}
          transition={{
            loop: true,
            type: "timing",
            duration: 700,
          }}
        >
          <FontAwesome
            name="angle-double-down"
            size={24}
            color={colors.gray[300]}
            className="self-center my-6"
          />
        </MotiView>

        <Text className="text-white font-bold text-2xl mt-4">
          Share credential
        </Text>
        <Text className="text-white font-regular text-base mt-1 mb-6">
          Show the world that you will participate in{" "}
          {badgeStore.data.eventTitle}!
        </Text>

        <Button title="Share" onPress={handleShare} />

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => badgeStore.remove()}
        >
          <Text className="mt-10 text-base text-white font-bold text-center">
            Remove Ticket
          </Text>
        </TouchableOpacity>
      </ScrollView>
      <Modal visible={showQRCode} statusBarTranslucent={true}>
        <View className="flex-1 items-center justify-center bg-green-500">
          <QRCode value="test" size={300} />
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setShowQRCode(false)}
          >
            <Text className="text-orange-500 font-body text-sm mt-10 text-center">
              Close QRCode
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}
