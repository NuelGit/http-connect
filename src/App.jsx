import { useRef, useState, useCallback } from 'react';

import Places from './components/Places.jsx';
import Modal from './components/Modal.jsx';
import DeleteConfirmation from './components/DeleteConfirmation.jsx';
import logoImg from './assets/logo.png';
import AvailablePlaces from './components/AvailablePlaces.jsx';
import { fetchUserPlaces, updatingPlaces } from './http.js';
import ErrorComponent from './components/ErrorComponent.jsx';
import { useFetchData } from './hooks/useFetch.js';

function App() {
  const selectedPlace = useRef();

  // const [userPlaces, setUserPlaces] = useState([]);
  // const [ isFetching, setIsFetching] = useState(false)
  // const [error, setError] = useState()

  const [errorUpdatinPlaces, setErrorUpdatinPlaces] = useState()
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const { isFetching,
     error,
    fetchedData: userPlaces,
  setFetchedData: setUserPlaces} = useFetchData(fetchUserPlaces, [])

  function handleStartRemovePlace(place) {
    setModalIsOpen(true);
    selectedPlace.current = place;
  }

  function handleStopRemovePlace() {
    setModalIsOpen(false);
  }

 async function handleSelectPlace(selectedPlace) {
    setUserPlaces((prevPickedPlaces) => {
      if (!prevPickedPlaces) {
        prevPickedPlaces = [];
      }
      if (prevPickedPlaces.some((place) => place.id === selectedPlace.id)) {
        return prevPickedPlaces;
      }
      return [selectedPlace, ...prevPickedPlaces];
    });

    try {
      await updatingPlaces([selectedPlace, ...userPlaces])
      
    } catch (error) {
      setUserPlaces(userPlaces)
      setErrorUpdatinPlaces({message: error.message || 'Failed to update places'})
    }
  }


  const handleRemovePlace = useCallback(async function handleRemovePlace() {
    setUserPlaces((prevPickedPlaces) =>
      prevPickedPlaces.filter((place) => place.id !== selectedPlace.current.id)
    );

    try {
      
      await updatingPlaces(
        userPlaces.filter((place) =>place.id !== selectedPlace.current.id )
      )
    } catch (error) {
      setUserPlaces(userPlaces)
      setErrorUpdatinPlaces({message: error.message || 'Failed to Delete places'})
      
    }
    

    setModalIsOpen(false);
  }, [userPlaces]);

  function handleError (){
    setErrorUpdatinPlaces(null)
  }

  return (
    <>
    <Modal open={errorUpdatinPlaces} onClose={handleError}>
     { errorUpdatinPlaces && (
      <ErrorComponent title=" An error just Occured!"
       message={errorUpdatinPlaces.message}
       onConfirm={handleError} />
       )}
    </Modal>

      <Modal open={modalIsOpen} onClose={handleStopRemovePlace}>
        <DeleteConfirmation
          onCancel={handleStopRemovePlace}
          onConfirm={handleRemovePlace}
        />
      </Modal>

      <header>
        <img src={logoImg} alt="Stylized globe" />
        <h1>PlacePicker</h1>
        <p>
          Create your personal collection of places you would like to visit or
          you have visited.
        </p>
      </header>
      <main>
        {error && <ErrorComponent title='An error occured now!' message={error.message}/> }
       { !error &&(
         <Places
         title="I'd like to visit ..."
         fallbackText="Select the places you would like to visit below."
         isLoading={isFetching}
         loadingText='Fetching your user places...'
         places={userPlaces}
         onSelectPlace={handleStartRemovePlace}
       />

      )} 

        <AvailablePlaces onSelectPlace={handleSelectPlace} />
      </main>
    </>
  );
}

export default App;
