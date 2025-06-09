import {Text, TextInput, TouchableOpacity, View} from "react-native";
import {useState} from "react";
import {InputFieldProps} from "@/util/interfaces";
import Ionicons from '@expo/vector-icons/Ionicons';
export const InputField = ({title, value, placeholder, handleChangeText, styling, ...props}: InputFieldProps) => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
    return(
      <View className={`space-y-2 mx-10 ${styling}`}>
          <Text className="text-base font-medium">
              {title}
          </Text>
          <View className="h-16 px-4 border-[1px] border-black rounded-2xl flex-row items-center">
              <TextInput
                  className="flex-1 font-semibold"
                  value={value}
                  placeholder={placeholder}
                  onChangeText={handleChangeText}
                  secureTextEntry={title === 'Password' && !showPassword}
                  {...props}
              />
              {
                  title === 'Password' && (
                      <TouchableOpacity  onPress={() => setShowPassword(!showPassword)}>
                          {showPassword ?
                              <Ionicons name="eye-outline" size={24} color="black" />
                          :
                              <Ionicons name="eye-off-outline" size={24} color="black" />
                          }
                      </TouchableOpacity>
                  )
              }
          </View>
      </View>
  )
}