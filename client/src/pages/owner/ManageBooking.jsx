import React, { useState, useEffect } from 'react'
import Title from '../../components/owner/Title'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast'

const ManageBooking = () => {

  const { currency, axios} = useAppContext()
   
  const [bookings, setBookings] = useState([])

  const fetchOwnerBookings = async ()=>{
   try {
    const { data } = await axios.get('/api/bookings/owner')
    data.success ? setBookings(data.bookings) : toast.error(data.message)
   } catch (error) {
     toast.error(error.message)
   }     
  }
  const changeBookingStatus = async (bookingId, status)=>{
    try {
     const { data } = await axios.put('/api/bookings/change-status',
      {bookingId,status})
      if (data.success) {
        toast.success(data.message)
        fetchOwnerBookings()
      }else{
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }     
   }
 

  useEffect(()=>{
    fetchOwnerBookings()
  },[])

  return (
    <div className='px-4 pt-10 md:px-10 w-full'>

    <Title title="Manage Bookings" subTitle="Track all customer bookings, 
    approve or cancel requests,and manage your status." />
    <div className='max-w-3xl w-full rounded-md overflow-hidden
     border border-borderColor mt-6'>

      <table className='w-full border-collapse text-left text-sm text-gray-600'>
        <thead className='text-gray-500'>
          <tr>
            <th className='p-3 font-medium'>Car</th>
            <th className='p-3 font-medium max-md:hidden'>Date Range</th> 
            <th className='p-3 font-medium'>Total </th>
            <th className='p-3 font-medium max-md:hidden'>Payment </th>
            <th className='p-3 font-medium'>Action</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking, index)=>(
            <tr key={index} className='border-t border-borderColor text-gray-500'>
              <td className='p-3 flex items-center gap-3'>
                <img src={booking.car.image} alt="" className='h-12 w-12 aspect-square rounded-md object-cover' />
                <div className='max-md:hidden'>
                  <p className='font-medium'>{booking.car.brand} {booking.car.model}</p>
                  <p className='text-xs text-gray-500'>{booking.car.category} • {booking.car.year}</p>
                </div>
              </td>
              <td className='p-3 max-md:hidden'>
                <p>{booking.pickupDate.split('T')[0]} - {booking.returnDate.split('T')[0]}</p>
                <p className='text-xs text-gray-500'>Booked: {booking.createdAt.split('T')[0]}</p>
              </td>
              <td className='p-3'>
                <p className='font-medium'>{currency}{booking.price}</p>
              </td>
              <td className='p-3 max-md:hidden'>
                <span className='bg-gray-100 px-3 py-1 rounded-full text-xs'>offline</span>
              </td>
              <td className='p-3'>
                {booking.status === 'pending' ? (
                  <select onChange={e=> changeBookingStatus(booking._id, e.target.value)}
                    value={booking.status} 
                    className='px-2 py-1.5 text-gray-500 border border-gray-300 rounded-md text-xs'
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                ) : (
                  <div className='flex flex-col gap-1'>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold
                      ${booking.status === 'confirmed' ? 'bg-green-100 text-green-600'
                         : 'bg-red-100 text-red-600'}`}>
                      {booking.status}
                    </span>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
    
  </div>
  )
}

export default ManageBooking
