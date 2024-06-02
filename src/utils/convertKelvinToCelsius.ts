export function convertKelvinToCelsius(kelvinTemp: number): number {
    const tempCelsius = kelvinTemp - 273.15;
    return Math.floor(tempCelsius);
}