import { View, Text, TextInput, TouchableOpacity, Image, Alert } from 'react-native'
import React, { useState } from 'react'
import { icons } from "../constants"
import { router, usePathname } from 'expo-router'

const SearchInput = ({ intialQuery }) => {
  const pathname = usePathname();

  const [query, setQuery] = useState(intialQuery || '');
  return (
      <View className='border-2 border-black-200 w-full h-16 px-4 bg-black-100 rounded-2xl focus:border-secondary items-center flex-row space-x-4'>
        <TextInput 
          placeholder='Search for a video topic'
          value={query}
          onChangeText={(e) => setQuery(e)}
          placeholderTextColor='#CDCDE0'
          className='flex-1 text-white font-pregular text-bas mt-0.5'
        />
        <TouchableOpacity
          onPress={() => {
            if (!query) {
              return Alert.alert('Please enter a search query');
            }

            if (pathname.startsWith('/search')) router.setParams({ query });
            else router.push(`/search/${query}`);
          }}
        >
            <Image 
                source={icons.search}
                className='w-5 h-5'
                resizeMode='contain'
            />
        </TouchableOpacity>
      </View>
  )
}

export default SearchInput;