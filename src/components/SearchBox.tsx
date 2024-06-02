import path from 'path'
import React from 'react'

type Props = {
    className? : string
    value: string
    onChange: React.ChangeEventHandler<HTMLInputElement> | undefined
    onSubmit: React.FormEventHandler<HTMLFormElement> | undefined
}

export default function Searchbox(props: Props) {
    return (
        <form className="max-w-md mx-auto " onSubmit={props.onSubmit}>
            <label htmlFor="default-search" className="mb-2 text-sm font-medium  sr-only ">Search</label>
            <div className="relative flex items-center">

                <input 
                // type="search" 
                id="default-search"
                    type="text"
                    // value={props.value}
                    onChange={props.onChange}
                    className="block outline-none p-3 sm:min-w-80 ps-3 md:min-w-96 w-full text-sm text-white borde border-gray300 shadow-md rounded-full bg-transparent border"
                    placeholder="Search for your preffered city..." required />

                <button className=' rounded-full h-10 w-10 border absolute right-1 flex justify-center items-center hover:scale-110'>
                    <div className=" inset-y-0 flex items-center ps-1 pointer-events-none">
                        <svg className="w-6 h-6 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                        </svg>
                    </div>
                </button>
            </div>
        </form>
    )
}