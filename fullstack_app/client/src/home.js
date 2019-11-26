<<<<<<< HEAD
import React, { Component, useState, useContext } from 'react';
=======
// /client/App.js
import React, { Component, useState } from 'react';
>>>>>>> 1b27b4156d015e63b2a4348a9281c1552dca2956
import axios from 'axios';


class App extends Component {
<<<<<<< HEAD
    // initialize our state
    state = {
        data: [],
        id: 0,
        picture: null,
        address: null,
        raw_address: null,
        accuracy: null,
        date: null,
        intervalIsSet: false,
        idToDelete: null,
        idToUpdate: null,
        objectToUpdate: null,
        dateContent : null,
    };

    getDataFromDb = () => {
        fetch('http://localhost:3001/api/getData')
        .then((data) => data.json())
        .then((res) => this.setState({ data: res.data }));
    };

    getDataFromDbDate = (fromDate, toDate) => {
        axios.post('http://localhost:3001/api/getData_bydate', {
            fromDate: fromDate,
            toDate: toDate,
        }).then((res) => {
            this.setState({ data: res.data.data })
        });
    };
=======
  // initialize our state
  state = {
    data: [],
    id: 0,
    picture: null,
    address: null,
    raw_address: null,
    accuracy: null,
    date: null,
    intervalIsSet: false,
    idToDelete: null,
    idToUpdate: null,
    objectToUpdate: null,
  };

  // when component mounts, first thing it does is fetch all existing data in our db
  // then we incorporate a polling logic so that we can easily see if our db has
  // changed and implement those changes into our UI
  componentDidMount() {
    this.getDataFromDb();
    if (!this.state.intervalIsSet) {
      let interval = setInterval(this.getDataFromDb, 5000);  // was 1000
      this.setState({ intervalIsSet: interval });
    }
  }

  // never let a process live forever
  // always kill a process everytime we are done using it
  componentWillUnmount() {
    if (this.state.intervalIsSet) {
      clearInterval(this.state.intervalIsSet);
      this.setState({ intervalIsSet: null });
    }
  }

  // just a note, here, in the front end, we use the id key of our data object
  // in order to identify which we want to Update or delete.
  // for our back end, we use the object id assigned by MongoDB to modify
  // data base entries

  // our first get method that uses our backend api to
  // fetch data from our data base
  getDataFromDb = () => {
    fetch('http://localhost:3001/api/getData')
      .then((data) => data.json())
      .then((res) => this.setState({ data: res.data }));
  };

  // our put method that uses our backend api
  // to create new query into our data base
  
  putDataToDB = (picture, address, raw_address, accuracy, date) => {
    let currentIds = this.state.data.map((data) => data.id);
    let idToBeAdded = 0;
    while (currentIds.includes(idToBeAdded)) {
      ++idToBeAdded;
    }

    axios.post('http://localhost:3001/api/putData', {
      id: idToBeAdded,
      picture: picture,
      address: address,
      raw_address: raw_address,
      accuracy: accuracy,
      date: date,
    });
  };
  
>>>>>>> 1b27b4156d015e63b2a4348a9281c1552dca2956

  // our delete method that uses our backend api
  // to remove existing database information
  deleteFromDB = (idTodelete) => {
    parseInt(idTodelete);
    let objIdToDelete = null;
    this.state.data.forEach((dat) => {
      if (dat.id == idTodelete) {
        objIdToDelete = dat._id;
      }
    });

    axios.delete('http://localhost:3001/api/deleteData', {
      data: {
        id: objIdToDelete,
      },
    });
  };

  // our update method that uses our backend api
  // to overwrite existing data base information
  updateDB = (idToUpdate, updateToApply) => {
    let objIdToUpdate = null;
    parseInt(idToUpdate);
    this.state.data.forEach((dat) => {
      if (dat.id == idToUpdate) {
        objIdToUpdate = dat._id;
      }
    });

    axios.post('http://localhost:3001/api/updateData', {
      id: objIdToUpdate,
      update: { address: updateToApply },
    });
  };

  // here is our UI
  // it is easy to understand their functions when you
  // see them render into our screen
  render() {
    const { data } = this.state;
    return (
      <div>
<<<<<<< HEAD
        <Date func={this.getDataFromDbDate}/>
=======
        
>>>>>>> 1b27b4156d015e63b2a4348a9281c1552dca2956
        <ul>
          {data.length <= 0
            ? 'NO DB ENTRIES YET'
            : data.map((dat) => (
                <li style={{ padding: '10px' }} key={data.picture}>
                  <span style={{ color: 'gray' }}> id: </span> {dat.id} <br />
                  <span style={{ color: 'gray' }}> picture: </span> <br />
                  <img src={"/uploads" + dat.picture} alt = {dat.id} width = "300"/> <br />
                  <span style={{ color: 'gray' }}> address: </span> {dat.address} <br />
                  <input
                    type="text"
                    style={{ width: '400px' }}
                    defaultValue = {dat.address}
                    onChange={(e) => this.setState({ updateToApply: e.target.value })}
                    placeholder={dat.address}
                  />
                  <button
                    onClick={() =>
                      this.updateDB(dat.id, this.state.updateToApply)
                    }
                  >
                    UPDATE
                  </button>  <br />
                  <span style={{ color: 'gray' }}> raw_address: </span> {dat.raw_address} <br />
                  <span style={{ color: 'gray' }}> accuracy: </span> {dat.accuracy} <br />
                  <span style={{ color: 'gray' }}> date: </span> {dat.date} <br />
                </li>
              ))}
        </ul>
        <div style={{ padding: '10px' }}>
          <input
            type="text"
            onChange={(e) => this.setState({ picture: e.target.value })}
            placeholder="add something in the database"
            style={{ width: '200px' }}
          />
          <input
            type="text"
            onChange={(e) => this.setState({ address: e.target.value })}
            placeholder="add something in the database"
            style={{ width: '200px' }}
          />
          <input
            type="text"
            onChange={(e) => this.setState({ raw_address: e.target.value })}
            placeholder="add something in the database"
            style={{ width: '200px' }}
          />
          <input
            type="text"
            onChange={(e) => this.setState({ accuracy: e.target.value })}
            placeholder="add something in the database"
            style={{ width: '200px' }}
          />
          <input
            type="text"
            onChange={(e) => this.setState({ date: e.target.value })}
            placeholder="add something in the database"
            style={{ width: '200px' }}
          />
          <button onClick={() => this.putDataToDB(this.state.picture, this.state.address, this.state.raw_address, this.state.accuracy, this.state.date)}>
            ADD
          </button>
        </div>
        <div style={{ padding: '10px' }}>
          <input
            type="text"
            style={{ width: '200px' }}
            onChange={(e) => this.setState({ idToDelete: e.target.value })}
            placeholder="put id of item to delete here"
          />
          <button onClick={() => this.deleteFromDB(this.state.idToDelete)}>
            DELETE
          </button>
        </div>
        <div style={{ padding: '10px' }}>
          <input
            type="text"
            style={{ width: '200px' }}
            onChange={(e) => this.setState({ idToUpdate: e.target.value })}
            placeholder="id of item to update here"
          />
          <input
            type="text"
            style={{ width: '200px' }}
            onChange={(e) => this.setState({ updateToApply: e.target.value })}
            placeholder="put new value of the item here"
          />
          <button
            onClick={() =>
              this.updateDB(this.state.idToUpdate, this.state.updateToApply)
            }
          >
            UPDATE
          </button>
        </div>
      </div>
    );
  }
}

export default App;