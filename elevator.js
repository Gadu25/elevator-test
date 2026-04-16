export default class Elevator {
  constructor() {
    this.currentFloor = 0
    this.stops = 0
    this.floorsTraversed = 0
    this.requests = []
    this.riders= []
  }

  dispatch() {
    // I adjust dispatch to comply with FiFo requirement; I use .shift() so forEach will cause problems
    while (this.requests.length > 0) {
      this.goToFloor(this.requests[0]);
    }
  }

  goToFloor(person){  
    // pickup the person requesting the elevator
    while(person.currentFloor !== this.currentFloor){
      this.currentFloor < person.currentFloor ? this.moveUp() :this.moveDown()
    }
    this.hasPickup()

    // drop the person to dropOffFloor
    while(person.dropOffFloor !== this.currentFloor){
      this.currentFloor < person.dropOffFloor ? this.moveUp() : this.moveDown()
    }
    this.hasDropoff()

    // check if return to lobby
    if(!this.requests && !this.riders){
      if(this.checkReturnToLoby()){
        this.returnToLoby()
      }
    }
  } 

  moveUp(){
    this.currentFloor++
    this.floorsTraversed++
    if(this.hasStop()){
      this.stops++
    }    
  }

  moveDown(){
    if(this.currentFloor > 0){      
      this.currentFloor--
      this.floorsTraversed++
      if(this.hasStop()){
        this.stops++
      }
    }
  }

  hasStop(){
    const currentRequest = this.requests[0]
    const currentRider = this.riders[0]

    const canPickup = currentRequest && currentRequest.currentFloor === this.currentFloor && !currentRider
    const canDrop = currentRider && currentRider.dropOffFloor === this.currentFloor
    
    return canPickup || canDrop
  }

  hasPickup(){
    const currentRequest = this.requests[0]

    const canPickup = currentRequest.currentFloor === this.currentFloor

    if(canPickup){
      this.riders.push(currentRequest)
      this.requests.shift()
    }
  }

  hasDropoff(){
    const currentRider = this.riders[0]

    const canDrop = currentRider.dropOffFloor === this.currentFloor

    if(canDrop){
      this.riders.shift()
    }
  }

  checkReturnToLoby(){
    const beforeNoon = new Date().getHours() < 12
    return beforeNoon && this.riders.length === 0
  }

  returnToLoby(){
    while(this.currentFloor > 0){
      this.moveDown()
    }
  }

  reset(){
    this.currentFloor = 0
    this.stops = 0
    this.floorsTraversed = 0
    this.riders = []
  }
}
