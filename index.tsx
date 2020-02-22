import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  Dimensions,
  View,
  TouchableWithoutFeedback
} from "react-native";
import * as Animatable from "react-native-animatable";
import { BlurView } from "expo-blur";
import Ionicons from "@expo/vector-icons/Ionicons";

const { width } = Dimensions.get("screen");
const initialNotification = {
  visible: null,
  title: null,
  message: null,
  time: null,
  type: null
};

interface INotification {
  visible: boolean;
  title: string;
  message: string;
  time: number;
  type: string;
}

function FancyNotification() {
  const notificationContainer = useRef(null);
  const defaultSettings = {
    time: 8000
  };
  const [notification, setNotification] = useState(initialNotification);

  useEffect(() => {
    if (notification !== null && notification.visible) {
      const time =
        notification.time !== undefined
          ? notification.time
          : defaultSettings.time;

      notificationContainer.current.slideInDown(450);
      setTimeout(() => {
        if (notification.visible) {
          notificationContainer.current.slideOutUp(450).then(() => {
            setNotification(initialNotification);
          });
        }
      }, time);
    }
  }, [notification]);

  function showNotification(props: INotification) {
    setNotification(props);
  }

  const hideNotification = async () => {
    notificationContainer.current.slideOutUp(450).then(() => {
      setNotification(initialNotification);
    });
  };

  if (notification.visible) {
    return (
      <TouchableWithoutFeedback onPress={() => hideNotification()}>
        <Animatable.View
          ref={notificationContainer}
          style={[
            styles.mainContainer,
            !notification.visible && {
              width: 0,
              height: 0
            },
            notification.title.length >= 120 && {
              height: 82
            }
          ]}
        >
          <BlurView tint="dark" intensity={80} style={styles.notBlurred}>
            <View
              style={[
                styles.bodyContainer,
                notification.message !== undefined && {
                  justifyContent: "flex-start"
                }
              ]}
            >
              <Text style={styles.titleText}>{notification.title}</Text>
            </View>
          </BlurView>
          <BlurView tint="light" intensity={90} style={styles.iconContainer}>
            <Ionicons
              name={
                notification.type === "failure"
                  ? "ios-close-circle"
                  : notification.type === "success"
                  ? "ios-checkmark-circle"
                  : "ios-notifications"
              }
              style={styles.icon}
            />
          </BlurView>
        </Animatable.View>
      </TouchableWithoutFeedback>
    );
  } else {
    return null;
  }
}

export default FancyNotification;

const styles = StyleSheet.create({
  mainContainer: {
    position: "absolute",
    justifyContent: "center",
    alignSelf: "center",
    backgroundColor: "transparent",
    top: 22 + 10,
    width: width / 1.2,
    height: 70,
    zIndex: 999,
    borderRadius: 12,
    shadowOpacity: 0.13,
    shadowRadius: 8,
    shadowOffset: { height: 5, width: 0 },
    shadowColor: "#000",
    opacity: 0.98,
    elevation: 12,
    overflow: "visible"
  },
  iconContainer: {
    position: "absolute",
    alignSelf: "flex-start",
    width: 40,
    height: 40,
    // backgroundColor: 'transparent',
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    left: -17
    // borderWidth: 5,
    // borderColor: '#FFF',
    // elevation: 5
  },
  icon: {
    fontSize: 24,
    color: "#d63031",
    top: 1
  },
  bodyContainer: {
    width: width / 1.4,
    height: 50,
    marginLeft: 15,
    alignSelf: "center",
    justifyContent: "center"
  },
  titleText: {
    fontFamily: "ubuntu-light",
    fontSize: 15,
    color: "#FFF"
  },
  notBlurred: {
    width: "100%",
    height: "100%",
    position: "absolute",
    justifyContent: "center",
    alignSelf: "center",
    borderRadius: 12,
    overflow: "hidden"
  }
});
