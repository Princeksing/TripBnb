import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { GiFamilyHouse } from 'react-icons/gi'
import { MdBedroomParent } from 'react-icons/md'
import { MdOutlinePool } from 'react-icons/md'
import { GiWoodCabin } from 'react-icons/gi'
import { SiHomeassistantcommunitystore } from 'react-icons/si'
import { IoBedOutline } from 'react-icons/io5'
import { FaTreeCity } from 'react-icons/fa6'
import { BiBuildingHouse } from 'react-icons/bi'
import { listingDataContext } from '../Context/ListingContext'
import BackButton from '../Component/ui/BackButton'
import Button from '../Component/ui/Button'

const categoryOptions = [
  { id: 'villa', label: 'Villa', icon: GiFamilyHouse },
  { id: 'farmHouse', label: 'Farm House', icon: FaTreeCity },
  { id: 'poolHouse', label: 'Pool House', icon: MdOutlinePool },
  { id: 'rooms', label: 'Rooms', icon: MdBedroomParent },
  { id: 'flat', label: 'Flat', icon: BiBuildingHouse },
  { id: 'pg', label: 'PG', icon: IoBedOutline },
  { id: 'cabin', label: 'Cabin', icon: GiWoodCabin },
  { id: 'shops', label: 'Shops', icon: SiHomeassistantcommunitystore },
]

function ListingPage2() {
  const navigate = useNavigate()
  const { category, setCategory } = useContext(listingDataContext)

  return (
    <div className="min-h-screen bg-brand-light">
      <div className="page-container py-8 md:py-12 max-w-3xl">
        <div className="flex items-center justify-between mb-8">
          <BackButton to="/listingpage1" />
          <span className="text-sm font-medium text-brand-pink bg-brand-pink/10 px-4 py-2 rounded-full">
            Step 2 of 3
          </span>
        </div>

        <h1 className="text-2xl md:text-3xl font-semibold text-brand-dark mb-2">
          Which best describes your place?
        </h1>
        <p className="text-brand-gray mb-8">
          Choose a category that fits your property
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-8">
          {categoryOptions.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              className={`flex flex-col items-center justify-center gap-2 p-5 rounded-xl border-2 transition-all duration-200 hover:border-brand-dark hover:shadow-card ${
                category === id
                  ? 'border-brand-dark bg-brand-light shadow-card'
                  : 'border-brand-border bg-white'
              }`}
              onClick={() => setCategory(id)}
            >
              <Icon className="w-8 h-8 text-brand-dark" />
              <span className="text-sm font-medium text-brand-dark">{label}</span>
            </button>
          ))}
        </div>

        <div className="flex justify-end">
          <Button
            size="lg"
            disabled={!category}
            onClick={() => navigate('/listingpage3')}
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ListingPage2
