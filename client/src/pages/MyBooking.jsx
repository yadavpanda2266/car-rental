import React, { useEffect, useState } from 'react'
import { assets } from "../assets/assets"
import Title from '../components/owner/Title'
import {toast} from 'react-hot-toast'
import { useAppContext } from '../context/AppContext'
import {motion} from 'framer-motion'

const MyBooking = () => {
  const {axios, user, currency } = useAppContext()

  const [bookings, setBookings] = useState([]);
  
  const fetchMyBooking = async()=>{
    try {
      const {data} = await axios.get('/api/bookings/user')
      if(data.success){
        setBookings(data.bookings)
      }else{
        toast.error(data.message)
      }
    } catch (error) {
     toast.error(error.message) 
    }
  }
  
  useEffect(() => {
    user && fetchMyBooking();
  }, [user]);

  // Function to calculate rental duration
  const calculateDuration = (pickupDate, returnDate) => {
    const pickup = new Date(pickupDate);
    const returnD = new Date(returnDate);
    const diffTime = Math.abs(returnD - pickup);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Function to format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <motion.div
      initial={{opacity: 0, y: 30}}
      animate={{ opacity: 1, y:0}}
      transition={{ duration: 0.6}}
      className='px-6 md:px-16 lg:px-24 xl:px-32 2xl:px-48 mt-16 text-sm max-w-7xl'>
      <Title title='My Bookings' subTitle='Your recent and upcoming bookings' />

      <div>
        {bookings.length > 0 ? (
          bookings.map((booking, index) => (
            <div key={booking._id} className='grid grid-cols-1 md:grid-cols-4 gap-6
            p-6 border border-borderColor rounded-lg mt-5 first:mt-12'>

              {/* car image + info */}
              <div className='md:col-span-1'>
                <div className='rounded-md overflow-hidden mb-3'>
                  <img src={booking.car.image} alt="" className='w-full h-auto aspect-video object-cover'/>
                </div>
                <p className='text-lg font-medium mt-2'>{booking.car.brand} {booking.car.model}</p>
                <p className='text-gray-500'>{booking.car.year} • {booking.car.location}</p>
              </div>
                
              {/* booking info */}
              <div className='md:col-span-2'>
                <div className='flex items-center gap-2 mb-3'>
                  <p className='px-3 py-1.5 bg-light rounded'>Booking #{index + 1}</p>
                  <p className={`px-3 py-1 text-xs rounded-full ${booking.status === 'confirmed'
                   ? 'bg-green-400/15 text-green-600': booking.status === 'pending' 
                   ? 'bg-yellow-400/15 text-yellow-600' : 'bg-red-400/15  text-red-600'}`}>
                    {booking.status}
                  </p>
                </div>

                {/* Pickup Location */}
                <div className='flex items-center gap-2 mb-2'>
                  <img src={assets.location_icon_colored} alt="" className='w-4 h-4' />
                  <span className='text-gray-600'>Pickup Location: <span className='font-medium'>{booking.car.location}</span></span>
                </div>

                {/* Rental Period */}
                <div className='flex items-center gap-2 mb-2'>
                  <img src={assets.calendar_icon_colored} alt="" className='w-4 h-4' />
                  <span className='text-gray-600'>
                    {formatDate(booking.pickupDate)} - {formatDate(booking.returnDate)}
                  </span>
                </div>

                {/* Duration */}
                <div className='flex items-center gap-2 mb-2'>
                  <img src={assets.car_icon} alt="" className='w-4 h-4' />
                  <span className='text-gray-600'>
                    Duration: <span className='font-medium'>{calculateDuration(booking.pickupDate, booking.returnDate)} days</span>
                  </span>
                </div>

                {/* Total Price */}
                <div className='flex items-center gap-2'>
                  <span className='text-gray-600'>
                    Total: <span className='font-medium text-lg'>{currency}{booking.price}</span>
                  </span>
                </div>
              </div>
              
              {/* Status and Actions */}
              <div className="flex flex-col justify-between">
                <div className="pt-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : 
                    booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {booking.status}
                  </span>
                </div>
                
                {/* Booking Date */}
                <div className='text-xs text-gray-500 mt-2'>
                  Booked on: {formatDate(booking.createdAt)}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className='text-center py-12'>
            <p className='text-gray-500 text-lg'>No bookings found.</p>
            <p className='text-gray-400 text-sm mt-2'>Start by booking your first car!</p>
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default MyBooking
