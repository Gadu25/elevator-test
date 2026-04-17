import Elevator from '../elevator.js';
import Person from '../person.js';

const elevator = new Elevator();
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

// DOM Elements
const elevatorEl = document.getElementById('elevator');
const statusEl = document.getElementById('status');
const tableBody = document.querySelector('#request-table tbody');

function updateUI() {
  // (60px per floor)
  elevatorEl.style.bottom = `${elevator.currentFloor * 60}px`;

  statusEl.innerText = `Stop: ${elevator.stops} | Floor: ${elevator.currentFloor} | Traversed: ${elevator.floorsTraversed || 0}`;
  tableBody.innerHTML = elevator.requests.map(req => `
      <tr>
          <td>${req.name}</td>
          <td>${req.currentFloor}</td>
          <td>${req.dropOffFloor}</td>
      </tr>
  `).join('');
}

// Add Person
document.getElementById('btn-add').addEventListener('click', () => {
  const name = document.getElementById('input-name').value;
  const current = parseInt(document.getElementById('input-current').value);
  const drop = parseInt(document.getElementById('input-drop').value);

  if (name) {
    const newPerson = new Person(name, current, drop);
    elevator.requests.push(newPerson);
    updateUI();
  }
});

// Dispatch
document.getElementById('btn-dispatch').addEventListener('click', async () => {
  if (elevator.requests.length === 0) return alert("No requests in queue!");

  // replicate the 'dispatch' logic with 'await' to see movement
  while (elevator.requests.length > 0 || elevator.riders.length > 0) {
      
    // Determine where we need to go next
    const targetFloor = elevator.riders.length > 0 ? elevator.riders[0].dropOffFloor : elevator.requests[0].currentFloor;

    // Move one floor at a time
    while (elevator.currentFloor !== targetFloor) {
      if (elevator.currentFloor < targetFloor) {
        elevator.moveUp();
      } else {
        elevator.moveDown();
      }
      
      updateUI();
      await sleep(600);
    }

    if (elevator.requests.length > 0 && elevator.currentFloor === elevator.requests[0].currentFloor) {
      elevator.hasPickup();
    } else if (elevator.riders.length > 0 && elevator.currentFloor === elevator.riders[0].dropOffFloor) {
      elevator.hasDropoff();
    }
    
    updateUI();
    await sleep(500);
  }
  
  if (elevator.checkReturnToLoby()) {
    while (elevator.currentFloor > 0) {
      elevator.moveDown();
      updateUI();
      await sleep(600);
    }
  }
  
  alert("All requests completed!");
});

// Initial Render
updateUI();