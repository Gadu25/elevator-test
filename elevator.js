export default class Elevator {
  constructor() {
    this.currentFloor = 0
    this.stops = 0
    this.floorsTraversed = 0
    this.requests = []
    this.riders= []
  }

  dispatch(){
    this.requests.forEach(request => {
      if(this.riders.length || this.requests.length){
        this.goToFloor(request)
      }
    })
  }

  goToFloor(person){
    // early return
    if(this.requests.length === 0 && this.riders.length === 0) return

    // pickup the person requesting the elevator
    if(this.requests.length > 0){
      while(person.currentFloor !== this.currentFloor){
        this.currentFloor < person.currentFloor ? this.moveUp() : this.moveDown()
      }
      this.hasPickup()
    } 

    // drop the person to dropOffFloor
    if(this.riders.length > 0){
      while(person.dropOffFloor !== this.currentFloor){
        this.currentFloor < person.dropOffFloor ? this.moveUp() : this.moveDown()
      }
      this.hasDropoff()
    }

    if(this.requests.length === 0 && this.riders.length === 0){
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
    return this.hasPickup() || this.hasDropoff()
  }
  
  hasPickup(){
    const floorRequests = this.requests.filter(request => request.currentFloor === this.currentFloor)
    if(floorRequests.length === 0) return false

    this.riders.push(...floorRequests)
    this.requests = this.requests.filter(request => request.currentFloor !== this.currentFloor)
    return true
  }

  hasDropoff(){
    const floorDropOffs = this.riders.filter(rider => rider.dropOffFloor === this.currentFloor)
    if(floorDropOffs.length === 0) return false

    this.riders = this.riders.filter(rider => rider.dropOffFloor !== this.currentFloor)
    return true
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
