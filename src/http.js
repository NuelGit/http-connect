export async function fetchAvailableMeals() {
    const res = await fetch('http://localhost:3000/places')
      const resData = await res.json()
  
      if(!res.ok){
        throw new Error("Could't fetch places data from the server ")
      }

      return resData.places
}

export async function fetchUserPlaces() {
  const res = await fetch('http://localhost:3000/user-places')
    const resData = await res.json()

    if(!res.ok){
      throw new Error("Could't fetctch user places from the server")
    }

    return resData.places
}

export async function updatingPlaces(placeUpdate) {
  const res = await fetch('http://localhost:3000/user-places', {
        method: 'PUT',
        body: JSON.stringify({places: placeUpdate}),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    
    const resData = await res.json()

    if(! res.ok){
        throw new Error('Failed to update the Places')
    }

    return resData.message
}
