import React ,{useState, useContext} from 'react';
import './PlacesItem.css';
import Button from'../../Shared/components/UI/Button'
import Card from '../../Shared/components/UI/Card';
import ErrorModal from '../../Shared/components/UI/ErrorModal';
import Spinner from '../../Shared/components/UI/LoadingSpinner';
import Modal from '../../Shared/components/UI/Modal';
// import ReactMapGL from "react-map-gl";
import Map from '../../Shared/components/UI/Map';
import {AuthContext} from '../../Shared/Context/auth-context';
import {useHttpClient} from '../../Shared/hooks/http-hook';

const Placesitem =(props)=>{

  const {isLoading , error ,sendRequest ,clearerror}= useHttpClient();
  const [showMap, setShowMap] = useState(false);
  const [ConfirmModal, setConfirmModal] = useState(false);

const ShowWarningHandler=()=>{setConfirmModal(true)};

const   CancelWarningHandler=()=>{
 console.log("asad")
 setConfirmModal(false)
}
const ConfirmDeleteHandler= async ()=>{
  setConfirmModal(false)
  try{
    await sendRequest(  `${process.env.REACT_APP_URL}/places/${props.id}`
    ,'DELETE',null,
    {
      Authorization: 'Bearer '+auth.token
    }
    )
    props.onDelete(props.id);
  }
  catch(err)
  {}




}

const OpenMap=()=>console.log("Sorry Can not be viewed as the credit card was not valid ")

const CloseMap=()=>this.setState({showMap:false})

const  auth= useContext(AuthContext)

    return (
        <React.Fragment>
          <ErrorModal error={error} onClear={clearerror}/>
         
            <Modal
            show={showMap}
            onCancel={CloseMap}
            header={props.address}
            contentClass="place-item__modal-content"
            footerClass="place-item__modal-actions"
            footer={<Button onClick={CloseMap}> CLOSE  </Button>}
            
            >
              <div className="map-container">
         <Map center={props.coordinates} 
          zoom={16}/>
        </div>
                </Modal>



                <Modal
        show={ConfirmModal}
        onCancel={CancelWarningHandler}
        header="Are you sure?"
        footerClass="place-item__modal-actions"
        footer={
          <React.Fragment>
            <Button inverse onClick={CancelWarningHandler}>
              CANCEL
            </Button>
            <Button danger onClick={ConfirmDeleteHandler}>
              DELETE
            </Button>
          </React.Fragment>
        }
      >
        <p>
          Do you want to proceed and delete this place? Please note that it
          can't be undone thereafter.
        </p>
      </Modal>



        <li className="place-item">
          <Card className="place-item__content">
          {isLoading && <Spinner asOverlay/>}
            <div className="place-item__image">
              <img src={`${process.env.REACT_APP_ASSET}/${props.image}`} alt={props.title} />
            </div>
            <div className="place-item__info">
              <h2>{props.title}</h2>
              <h3>{props.address}</h3>
              <p>{props.description}</p>
            </div>
            <div className="place-item__actions">
              <Button inverse onClick={OpenMap}>VIEW ON MAP</Button>
              {auth.userId === props.creatorId &&(
              <Button to ={`/places/${props.id}`}>EDIT</Button>
              )}
              {auth.userId === props.creatorId &&(
              <Button danger onClick={ShowWarningHandler}>DELETE</Button>
              )}
            </div>
          </Card>
        </li>
        </React.Fragment>
      );
    }


export default Placesitem;