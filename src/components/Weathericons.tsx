import Image from 'next/image';
import React from 'react';
import { cn } from "@/utils/cn";

type Props = React.HTMLProps<HTMLDivElement> & {
  iconName: string,
  width: number,
  height: number
};

export default function Weathericons({ iconName, width, height, ...props }: Props) {
  return (
    <div title={iconName} {...props} className={cn("w-", "h-")}>
      <Image
        src={`https://openweathermap.org/img/wn/${iconName}@4x.png`}
        alt='weather-icon'
        width={width}
        height={height}
        className="h-full w-full"
      />
    </div>
  );
}
