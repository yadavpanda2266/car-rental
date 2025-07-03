import React, { useEffect, useState } from 'react'
import { assets } from "../assets/assets"
import Title from '../components/owner/Title'
import { useAppContext } from '../context/AppContext'
import {toast} from 'react-hot-toast'
import axios from 'axios'

const MyBooking = () => {
  const { bookings, setBookings } = useAppContext();
  const [booking, setBooking] = useState([]);
  const currency = import.meta.env.VITE_CURRENCY 

  const fetchMyBooking = async () => {
    try {
      const { data } = await axios.get("/api/bookings/user-bookings");
      if (data.success) {
        setBooking(data.bookings);     // update local state
        setBookings(data.bookings);    // update global context
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Failed to fetch bookings");
    }
    // Implement the logic to fetch bookings from the backend
  }

  // Calculate number of days between pickup and return dates
  const calculateDays = (pickupDate, returnDate) => {
    const pickup = new Date(pickupDate)
    const return_ = new Date(returnDate)
    const diffTime = Math.abs(return_ - pickup)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays === 0 ? 1 : diffDays // Minimum 1 day
  }

  // Calculate daily profit
  const calculateDailyProfit = (totalPrice, days) => {
    return (totalPrice / days).toFixed(2)
  }

  useEffect(() => {
    fetchMyBooking();
  }, []);

  console.log('Bookings:', bookings);

  return (
    <div className='px-6 md:px-16 lg:px-24 xl:px-32 2xl:px-48 mt-16 text-sm max-w-7xl mx-auto'>
      <Title title='My Bookings' subTitle='Your recent and upcoming bookings' />

      <div className="flex flex-col gap-8 mt-12">
        {bookings && bookings.length > 0 ? (
          bookings.map((item, index) => {
            const rentalDays = calculateDays(item.pickupDate, item.returnDate)
            const dailyProfit = calculateDailyProfit(item.price, rentalDays)
            
            return (
            <div key={index} className="p-6 border rounded-xl shadow bg-white space-y-4">
              <div className="w-full aspect-video bg-gray-50 rounded-lg flex items-center justify-center mb-2 overflow-hidden">
                <img
                  src={item.car.image}
                  alt={item.car.model}
                  className="object-contain h-full w-full"
                />
              </div>
              <div className='md:col-span-2'>
                  <div className='flex items-center gap-2 mb-1'>
                    <p className='px-3 py-1.5 bg-light rounded'>BOOKING #{index + 1}</p>
                    <p className={`px-3 py-1 text-xs rounded-full ${
                      item.status === 'confirmed'
                        ? 'bg-green-100 text-green-800'
                        : item.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                    }`}>{item.status}</p>
                  </div>
              <div className="space-y-3">
                <h3 className="font-bold text-lg">{item.car.brand} {item.car.model}</h3>
                <p className="text-gray-500 text-sm">{item.car.year} • {item.car.category} • {item.car.location}</p>
                <div className="flex items-start gap-2 mt-3">
                  <img src={assets.calendar_icon_colored} alt="" className='w-4 h-4 mt-1' />
                  <div>
                    <p className='text-gray-500'>Rental Period</p>
                    <p>{item.pickupDate.split('T')[0]} To {item.returnDate.split('T')[0]}</p>
                    <p className='text-sm text-gray-400'>Duration: {rentalDays} day{rentalDays > 1 ? 's' : ''}</p>
                  </div>
                </div>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mt-3">
                  <div className="flex items-start gap-2">
                    <img src={assets.calendar_icon_colored} alt="" className='w-4 h-4 mt-1' />
                    <div>
                      <p className='text-gray-500'>Pick-up Location</p>
                      <p>{item.car.location}</p>
                      <p className='text-gray-500 mt-2'>Booked on {item.createdAt.split('T')[0]}</p>
                    </div>
                  </div>
                  <div className='flex flex-col items-end'>
                    <p className='text-sm text-gray-500'>Total Price</p>
                    <h1 className='text-2xl font-semibold text-primary'>{currency}{item.price}</h1>
                    <p className='text-sm text-gray-500'>Daily Rate: {currency}{dailyProfit}</p>
                  </div>
                </div>
                <div className="pt-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    item.status === 'confirmed' ? 'bg-green-100 text-green-800' : 
                    item.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {item.status}
                  </span>
                </div>
                

                </div>
              </div>
            </div>
          )})
        ) : (
          <div>No bookings found.</div>
        )}
      </div>
    </div>
  )
}

export default MyBooking
