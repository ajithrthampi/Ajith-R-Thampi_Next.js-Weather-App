'use client'

import Navbar from "@/components/Navbar";
import Weathericons from "@/components/Weathericons";
import { convertKelvinToCelsius } from "@/utils/convertKelvinToCelsius";
import { getDayOrNightIcon } from "@/utils/getDayOrNightIcon";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { format, parseISO, fromUnixTime } from "date-fns";
import { useAtom } from "jotai";
import Image from "next/image";
import { BiWind } from "react-icons/bi";
import { FiSunrise, FiSunset } from "react-icons/fi";
import { IoIosSunny } from "react-icons/io";
import { LiaSoundcloud } from "react-icons/lia";
import { SlSpeedometer } from "react-icons/sl";
import { WiHumidity } from "react-icons/wi";
import { loadingCityAtom, placeAtom } from "./atom";
import { useEffect } from "react";
import { HiCalendarDays } from "react-icons/hi2";
import { TbTemperaturePlus } from "react-icons/tb";
import { CiCloudOn } from "react-icons/ci";

// https://api.openweathermap.org/data/2.5/forecast?q=pune&appid=f74a6dd704ed65057841a1f10c6edeb4&cnt=56

interface WeatherData {
  cod: string;
  message: number;
  cnt: number;
  list: WeatherListItem[];
  city: City;
}

interface WeatherListItem {
  dt: number;
  main: Main;
  weather: Weather[];
  clouds: Clouds;
  wind: Wind;
  visibility: number;
  pop: number;
  sys: Sys;
  dt_txt: string;
}

interface Main {
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  sea_level: number;
  grnd_level: number;
  humidity: number;
  temp_kf: number;
}

interface Weather {
  id: number;
  main: string;
  description: string;
  icon: string;
}

interface Clouds {
  all: number;
}

interface Wind {
  speed: number;
  deg: number;
  gust: number;
}

interface Sys {
  pod: string;
}

interface City {
  id: number;
  name: string;
  coord: Coord;
  country: string;
  population: number;
  timezone: number;
  sunrise: number;
  sunset: number;
}

interface Coord {
  lat: number;
  lon: number;
}

export default function Home() {

  const [place, setPlace] = useAtom(placeAtom);
  const [loadingCity] = useAtom(loadingCityAtom);



  const { isPending, error, data, refetch } = useQuery<WeatherData>({
    queryKey: ['repoData'],
    queryFn: async () => {
      const { data } = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=${place}&appid=${process.env.NEXT_PUBLIC_WEATHER_KEY}&cnt=56`)
      return data;
    }
  })

  useEffect(() => {
    refetch()
  }, [place, refetch])

  console.log("data", data);
  const firstData = data?.list[0]
  const city_name = data?.city?.name
  const sunriseTime = data?.city.sunrise ? fromUnixTime(data.city.sunrise) : null;
  const sunsetTime = data?.city.sunset ? fromUnixTime(data.city.sunset) : null;

  //5 DAY FORCAST
  const uniqueDates = [
    ...new Set(
      data?.list.map(
        (entry) => new Date(entry.dt * 1000).toISOString().split("T")[0]
      )
    )
  ]

  //filtering data to get the first entry after 6 AM for each unique date
  const firstDataForEachDate = uniqueDates.map((date) => {
    return data?.list.find((entry) => {
      const entryDate = new Date(entry.dt * 1000).toISOString().split("T")[0];
      const entryTime = new Date(entry.dt * 1000).getHours();
      return entryDate === date && entryTime >= 6;
    });
  });

  console.log("firstDataForEachDate", firstDataForEachDate);

  if (isPending) return 'Loading...'

  return (
    <main className="min-h-screen  bg-gradient-to-r from-[#355D8E] to-[#355D8E] md:pb-0 pb-10 md:pt-0 pt- ">
      <Navbar />

      <div className="px-3 max-w-7xl mx-auto md:flex hidden flex-col gap-9 w-full pb-10 pt-10  ">
        <div className="flex slg:flex-row flex-col gap-10 ">
          {/* First section */}
          <section className="flex flex-col items-center justify-center p-7 rounded-[30px] bg-[#8D93A6]/30 slg:w-[35%] w-full inset-20 shadow-[rgba(0,0,15,0.5)_10px_5px_4px_0px]">
            <p className="text-white xl:text-4xl md:text-2xl font-bold">{city_name}</p>
            <div>
              <p className="xl:text-7xl md:text-5xl text-white pt-5 text-center">{format(parseISO(firstData?.dt_txt ?? ''), 'hh:mm a')}</p>
              <p className="xl:text-xl md:text-lg text-white text-center">{format(parseISO(firstData?.dt_txt ?? ''), 'EEEE, d MMM')}</p>
            </div>
          </section>

          {/* Second section */}
          <section className="flex p-7 rounded-[30px] bg-[#8D93A6]/30 slg:w-[65%] w-full inset-20 shadow-[rgba(0,0,15,0.5)_10px_5px_4px_0px]">
            <div className="flex md:flex-row flex-col justify-between text-white pl-3 w-full">
              <div className="flex justify-between flex-col">
                <div className="flex  flex-col">
                  <p className="xl:text-6xl md:text-4xl font-bold">{convertKelvinToCelsius(firstData?.main.temp ?? 0)}°C</p>
                  <p className="xl:text-base text-sm font-medium">Feels like: <span className="xl:text-2xl text-xl">{convertKelvinToCelsius(firstData?.main.feels_like ?? 0)}°C</span></p>
                </div>
                <div className="px-5 flex flex-col gap-3">
                  <div className="flex gap-2 items-end ">
                    <FiSunrise size={27} />
                    <div className="">
                      <p className="text-base">Sunrise</p>
                      {/* <p className="text-xs">{format(parseISO(firstData?.city.sunrise ?? ''), 'hh:mm a')}</p> */}
                      <p className="text-xs">{sunriseTime ? format(sunriseTime, 'hh:mm a') : 'N/A'}</p>
                    </div>
                  </div>

                  <div className="flex gap-2 items-end">
                    <FiSunset size={27} />
                    <div className="">
                      <p className="text-base">Sunset</p>
                      <p className="text-xs">{sunsetTime ? format(sunsetTime, 'hh:mm a') : 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col justify-between">
                {/* <IoIosSunny className="xl:text-[170px] text-[150px] text text-yellow-400" /> */}
                <Weathericons
                  width={100} height={100}
                  iconName={getDayOrNightIcon(firstData?.weather[0]?.icon ?? '', firstData?.dt_txt ?? '')}
                />
                <p className="text-center text-2xl font-semibold capitalize">{firstData?.weather[0]?.description}</p>
              </div>

              {/* third */}
              <div className="flex gap-7 ">
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col items-center">
                    <WiHumidity className="xl:text-6xl text-5xl" />
                    <p>{firstData?.main?.humidity}</p>
                    <p className="text-sm pt-2">Humidity</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <SlSpeedometer className="xl:text-4xl text-3xl" />
                    <p> {firstData?.main?.pressure}</p>
                    <p className="text-sm pt-2">Pressure</p>
                  </div>
                </div>
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col items-center">
                    <CiCloudOn className="xl:text-6xl text-5xl" />
                    <p>{firstData?.weather[0]?.description}</p>
                    <p className="text-sm pt-2">Cloud</p>
                  </div>
                  {/* <div className="flex flex-col items-center">
                    <SlSpeedometer className="xl:text-4xl text-3xl" />
                    <p>8</p>
                    <p className="text-sm pt-2">UV</p>
                  </div> */}
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* second Section */}
        <div className="flex lg:flex-row flex-col gap-10 pt-5 ">
          <section className="flex flex-col items-center justify-between pt-4 pb-2 px-4 rounded-[30px] bg-[#8D93A6]/30 lg:w-[30%] inset-20 shadow-[rgba(0,0,15,0.5)_10px_5px_4px_0px]">
            <h1 className="xl:text-3xl lg:text-2xl font-semibold text-white whitespace-nowrap">5 Days Forecast:</h1>
            <div className="text-white w-full mt-2 bg-red500 overflow-y-scroll h-[266px] scrollbar-thin scrollbar-thumb scrollbar-track  bg-red500">
              <div className="w-full xl:px-5 ">
                {
                  firstDataForEachDate.map((item, index) => (
                    <ul className="pt-3 flex lg:justify-between  justify-around w-full bg-green500 items-center bg-[#444444 " key={index}>
                      <div>
                        <li className="text-3xl">
                          <Weathericons
                            width={50}
                            height={50}
                            iconName={item?.weather[0].icon ?? "123"} />
                        </li>
                        <li className="flex flexcol items-center text-xs  justify-end gap-3 -mt-4">
                        <div className="">
                          <p>min</p>
                          <p>{convertKelvinToCelsius(item?.main.temp_min ?? 0)}°C</p>
                        </div>

                        <div className="">
                          <p>max</p>
                          <p>{convertKelvinToCelsius(item?.main.temp_max ?? 0)}°C</p>
                        </div>
                      </li>

                      </div>
                      <li className="text-sm font-semibold">{convertKelvinToCelsius(item?.main.temp ?? 0)}°C</li>

                      {/* <li className="flex flexcol items-center  justify-end gap-3">
                        <div className="">
                          <p>min</p>
                          <p>{convertKelvinToCelsius(item?.main.temp_min ?? 0)}°C</p>
                        </div>

                        <div className="">
                          <p>max</p>
                          <p>{convertKelvinToCelsius(item?.main.temp_max ?? 0)}°C</p>
                        </div>
                      </li> */}
                      <li className="text-sm font-semibold">{format(parseISO(item?.dt_txt ?? ''), 'EEEE, d MMM')}</li>
                    </ul>
                  ))
                }
              </div>
            </div>
          </section>

          {/* hourly forecast */}
          <section className="flex flex-col items-center  pt-4 px-7 rounded-[30px] bg-[#8D93A6]/30 lg:w-[70%] w-full inset-20 shadow-[rgba(0,0,15,0.5)_10px_5px_4px_0px]">
            <h1 className="text-3xl text-white font-semibold text-center">Hourly Forecast:</h1>
            <div className="text-white w-full  h-full pb-2">
              <ul className="h-full flex  overflow-hidde overflow-x-scroll w-full  gap-4 pt-4 scrollbar-thin scrollbar-thumb scrollbar-track ">
                {
                  data?.list.map((item, index) => (
                    <li className="bg-[#373636 h-full w-[200px] rounded-[30px] flex flex-col gap-2 p-5 items-center " key={index}>
                      <p className="whitespace-nowrap">{format(parseISO(item.dt_txt), 'h:mm a')}</p>
                      <p className="text-3xl text-yellow-400">
                        <Weathericons
                          width={80} height={80}
                          iconName={getDayOrNightIcon(item.weather[0].icon, item.dt_txt)} />
                      </p>
                      <p>{convertKelvinToCelsius(item?.main.temp ?? 0)}°C</p>
                      {/* <p className="text-3xl text-yellow-400"><IoIosSunny /></p> */}
                      <p className="whitespace-nowrap text-sm font-semibold pt-3">{item?.wind?.speed} km/h</p>
                    </li>
                  ))
                }
              </ul>
            </div>
          </section>
        </div>
      </div>


      {/*  */}
      {/* mobile responsive */}
      <div className="md:hidden mx-3 pt-20">
        <div className="fle gap-10 ">
          {/* First section */}
          <div>
            <section className=" p-7">
              <p className="text-white xl:text-4xl md:text-2xl font-bold tracking-wider">{city_name}</p>
              <div>
                <p className="text-8xl whitespace-nowrap text-[#ffffff] pt-5 t">{convertKelvinToCelsius(firstData?.main.temp ?? 0)}°C</p>
                <p className="xl:text-xl md:text-lg text-white ">{firstData?.weather[0]?.description}</p>
              </div>
            </section>
          </div>

          {/* second sectoin */}
          <section className=" bg-[#8D93A6]/30 p-3  rounded-2xl ">
            <div className="flex gap-3 items-center text-[#FFFFFF]">
              <HiCalendarDays size={29} />
              <h1 className="text-base font-semibold text-[#FFFFFF] whitespace-nowrap">5 Days Forecast:</h1>
            </div>
            <div className="text-[#FFFFFF] w-full pt-2 overflow-y-scroll h-[366px] scrollbar-thin scrollbar-thumb scrollbar-track bg-red500">
              <div className="w-full xl:px-5">
                {
                  firstDataForEachDate.map((item, index) => (
                    <ul className="pt-3 flex  items-center justify-evenly border-b border-[#1E1E5A]  w-full   bg-[#444444 " key={index}>
                      <li className="text-3xl">
                        <Weathericons
                          width={50}
                          height={50}
                          iconName={item?.weather[0].icon ?? "123"} />
                      </li>
                      <li className="text-sm font-semibold">{convertKelvinToCelsius(item?.main.temp ?? 0)}°C</li>
                      <li className="text-sm font-semibold">{format(parseISO(item?.dt_txt ?? ''), 'EEEE, d MMM')}</li>
                    </ul>
                  ))
                }
              </div>
            </div>
          </section>

          {/* third sectoin */}
          <section className=" bg-[#8D93A6]/30 p-3  rounded-2xl  mt-6">
            <h1 className="text-base font-semibold text-[#FFFFFF] whitespace-nowrap">Hourly Forecast:</h1>
            <div className="text-white w-full  h-full pb-2">
              <ul className="h-full flex  overflow-hidde overflow-x-scroll w-full  gap-3 pt-4 scrollbar-thin scrollbar-thumb scrollbar-track ">
                {
                  data?.list.map((item, index) => (
                    <li className="bg-[#8D93A6] text-[#ffffff] h-full w-[200px] pb-7 rounded-[50px] flex flex-col gap-2 p-3 pt-7 items-center " key={index}>
                      <p className="whitespace-nowrap text-[15px]">{format(parseISO(item.dt_txt), 'h:mm a')}</p>
                      <p className="text-3xl text-yellow-400">
                        <Weathericons
                          width={80} height={80}
                          iconName={getDayOrNightIcon(item.weather[0].icon, item.dt_txt)} />
                      </p>
                      <p>{convertKelvinToCelsius(item?.main.temp ?? 0)}°C</p>
                      {/* <p className="text-3xl text-yellow-400"><IoIosSunny /></p> */}
                      <p className="whitespace-nowrap text-sm font-semibold pt-3">{item?.wind?.speed} km/h</p>
                    </li>
                  ))
                }
              </ul>
            </div>
          </section>

          {/* forth */}
          <section className="mt-6">
            <div className="flex gap-3">
              <div className="rounded-2xl bg-white p-3 h-44 w-full">
                <div className="text-[#1E1E5A]">
                  <div className="flex flex-col items-center">
                    <WiHumidity className=" text-6xl" />
                    <p className="text-sm ">Humidity</p>
                  </div>
                  <div className="flex items-end justify-between">
                    <p className="text-4xl pt-5"> {firstData?.main?.humidity}</p>
                    <p className="text-base font-semibold">
                      {
                        firstData?.main?.humidity !== undefined
                          ? (firstData.main.humidity < 30
                            ? "Dry"
                            : (firstData.main.humidity > 60
                              ? "High"
                              : "Moderate"))
                          : ""
                      }
                    </p>
                  </div>
                </div>
              </div>
              <div className="rounded-2xl bg-white p-3 h-44 w-full">
                <div className="text-[#1E1E5A]">
                  <div className="flex flex-col items-center">
                    <SlSpeedometer className=" text-6xl" />
                    <p className="text-sm ">Pressure</p>
                  </div>
                  <div className="flex items-end justify-between">
                    <p className="text-4xl pt-5"> {firstData?.main?.pressure}</p>
                    <p className="text-base font-semibold">
                      {
                        firstData?.main?.pressure !== undefined
                          ? (firstData.main.humidity < 1010 ? "Low" : "High") : ""
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-3">
              <div className="rounded-2xl bg-white p-3 h-44 w-full">
                <div className="text-[#1E1E5A]">
                  <div className="flex flex-col items-center">
                    <TbTemperaturePlus className=" text-6xl" />
                    <p className="text-sm ">Feels LIke</p>
                  </div>
                  <div className="flex items-end justify-between">
                    <p className="text-4xl pt-5"> {convertKelvinToCelsius(firstData?.main.temp ?? 0)}°C</p>
                    <p className="text-base font-semibold">
                      {
                        firstData?.main?.temp !== undefined
                          ? (firstData.main.temp < 288
                            ? "Low"
                            : (firstData.main.temp <= 298
                              ? "Moderate"
                              : "High"))
                          : ""
                      }
                    </p>
                  </div>
                </div>
              </div>
              {/* second */}
              <div className="rounded-2xl bg-white p-3 h-44 w-full">
                <div className="text-[#1E1E5A]">
                  <div className="flex flex-col items-center">
                    <CiCloudOn className=" text-6xl" />
                    <p className="text-sm ">Cloud</p>
                  </div>
                  <div className="">
                    <p className="text-2xl text-center pt-5"> {firstData?.weather[0]?.description}</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

        </div>
      </div>
    </main>
  );
}


// Skeleton component
const Skeleton = ({ className }: any) => (
  <div className={`animate-pulse bg-gray-700 ${className}`}></div>
);