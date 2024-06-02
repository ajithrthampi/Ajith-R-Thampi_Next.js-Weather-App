'use client'
import React, { useState } from 'react'
import { MdMyLocation, MdOutlineLocationOn, MdWbSunny } from 'react-icons/md'
import Searchbox from './SearchBox'
import axios from 'axios'
import { useAtom } from 'jotai'
import { loadingCityAtom, placeAtom } from '@/app/atom'
import { GiHamburgerMenu } from 'react-icons/gi'
import { IoClose } from 'react-icons/io5'
import { motion } from 'framer-motion';

type Props = {

}

export default function Navbar({ }: Props) {
  const [city, setCity] = useState('')
  const [error, setError] = useState('')
  const [show, setShow] = useState(false)

  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [place, setPlace] = useAtom(placeAtom);
  const [_, setLoadingCity] = useAtom(loadingCityAtom);


  const API_KEY = process.env.NEXT_PUBLIC_WEATHER_KEY;

  const handleInputChang = async (value: string) => {
    setCity(value)
    if (value.length >= 3) {
      try {
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/find?q=${value}&appid=${API_KEY}`)
        const suggestions = response.data.list.map((item: any) => item.name)
        setSuggestions(suggestions)
        setError('')
        setShowSuggestions(true)
      } catch (error) {
        setSuggestions([])
        setShowSuggestions(false)
      }
    } else {
      setSuggestions([])
      setShowSuggestions(false)
    }
  }


  function handleSuggestionClick(value: string) {
    setCity(value);
    setShowSuggestions(false);
  }

  function handleSubmitSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoadingCity(true);
    e.preventDefault();
    if (suggestions.length == 0) {
      setError("Location not found");
      setLoadingCity(false);
    } else {
      setError("");
      setTimeout(() => {
        setLoadingCity(false);
        setPlace(city);
        setShowSuggestions(false);
        setShow(false)
      }, 500);
    }
  }

  return (
    <nav className="bg-gradient-to-r  sticky top-0 left-0 z-50 bg-">
      <div className="h-[80px] w-full flex  justify-between items-center  max-w-7xl px-3 mx-auto">
        <div className="flex items-center justify-center gap-2  ">
          <h2 className="text-white md:text-3xl text-2xl font-semibold">Weather App</h2>
          <MdWbSunny className="text-3xl mt-1 text-yellow-300" />
        </div>
        {/*  */}
        <section className="flex gap-2 items-center">
          <div className='md:hidden text-white cursor-pointer' onClick={() => setShow(true)}>
            <GiHamburgerMenu size={26} />
          </div>
          <div className="relative md:flex hidden">
            {/* SearchBox */}

            <Searchbox value={city}
              onSubmit={handleSubmitSearch}
              onChange={(e) => handleInputChang(e.target.value)}
            />
            <SuggetionBox
              {...{
                showSuggestions,
                suggestions,
                handleSuggestionClick,
                error
              }}
            />
          </div>
        </section>
      </div>


      {
        show ?
          <>
            <motion.div
              initial={{ opacity: 0, y: -100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -200 }}
              className='fixed bg-[#2e4a7e] top-0 right-0 w-full h-[400px]'>
              <div className='w-full'>
                <div className='flex items-center justify-end text-white text-3xl  w-full px-6 pt-3' onClick={() => setShow(false)}>
                  <IoClose />
                </div>
                <div className='pt-5 relative'>
                  <Searchbox value={city}
                    onSubmit={handleSubmitSearch}
                    onChange={(e) => handleInputChang(e.target.value)}
                  />
                  <div className='absolute bottom-10 left-4'>
                  <SuggetionBox
                    {...{
                      showSuggestions,
                      suggestions,
                      handleSuggestionClick,
                      error
                    }}
                  />
                  </div>
                </div>
              </div>
            </motion.div>

          </>
          :
          <>

          </>
      }
    </nav>
  )
}

function SuggetionBox({
  showSuggestions,
  suggestions,
  handleSuggestionClick,
  error
}: {
  showSuggestions: boolean;
  suggestions: string[];
  handleSuggestionClick: (item: string) => void;
  error: string;
}) {
  return (
    <>
      {((showSuggestions && suggestions.length > 1) || error) && (
        <ul className="mb-4 bg-white absolute border top-[44px] left-0 border-gray-300 rounded-md min-w-[200px]  flex flex-col gap-1 py-2 px-2">
          {error && suggestions.length < 1 && (
            <li className="text-red-500 p-1 "> {error}</li>
          )}
          {suggestions.map((item, i) => (
            <li
              key={i}
              onClick={() => handleSuggestionClick(item)}
              className="cursor-pointer p-1 rounded   hover:bg-gray-200"
            >
              {item}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}