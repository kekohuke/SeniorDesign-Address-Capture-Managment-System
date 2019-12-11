import React, { Component } from 'react';
import Helmet from 'react-helmet';
import AlgoliaPlaces from 'algolia-places-react';
import {Bar, Line} from 'react-chartjs-2';
import MailCountChartContainer from './components/locMailCountContainer';
import AddressesTable from './components/addressesTable';
import axios from 'axios'

export class locStats extends Component {
    constructor(props){
        super(props);
        this.state = {
            location: "", // maybe have a default location
            data: [],
            state: "week",
            weeklabels:[],
            monthlabels:[],
            lifetimelables:[],
            week:[],
            month:[],
            year:[],
            lifetime:[]
        }

    }



    getDataFromDbDate =  (query) => {
        console.log(query)

        axios.post('http://localhost:3001/api/search', {
            query: query
        }).then((res) => {
            console.log(res.data)
           // console.log(var_name)
             if(res.data.success)
             {
                this.setState({data: res.data.data})
             }
            //this.setState({ [var_name]: res.data.data })
        });
    };
//---------------------laybels
    getLastWeekLabels (){
        let dateLabels = [];
        let today = new Date();
        let date = null;
        let dd = "";
        let mm = "";
        let yyyy = "";
        let dateString = "";
        
        for(let i = 0; i < 7; ++i) {
            date = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 6 + i);
            dd = String(date.getDate()).padStart(2, '0');
            mm = String(date.getMonth() + 1).padStart(2, '0');
            yyyy = date.getFullYear();
            dateString = mm + '/' + dd + '/' + yyyy;
            dateLabels.push(dateString);
        }
        
        this.state.weeklabels = dateLabels
        //return dateLabels;
    }

    getLast30DaysLabels = () => {
        let dateLabels = [];

        let today = new Date();
        let date = null;
        let mm = "";
        let dd = "";
        let yyyy = "";
        let dateString = "";
    
        for(let i = 0; i < 7; ++i) {
            date = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 30 + (5 * i));
            dd = String(date.getDate()).padStart(2, '0');
            mm = String(date.getMonth() + 1).padStart(2, '0');
            yyyy = date.getFullYear();
            dateString = mm + '/' + dd + '/' + yyyy;
            
            dateLabels.push(dateString);
        }
        this.state.monthlabels = dateLabels;
    }

    getLastYearLabels = () => {
        let dateLabels = [];
        let today = new Date();
        let date = null;
        let mm = "";
        let yyyy = "";
        let dateString = "";
    
        for(let i = 0; i < 12; ++i) {
            date = new Date(today.getFullYear(), today.getMonth() - 11 + i);
            mm = String(date.getMonth() + 1).padStart(2, '0');
            yyyy = date.getFullYear();
            dateString = mm + '/' + yyyy;
            dateLabels.push(dateString);
        }
       // this.state.year = datedata
        this.state.yearlabels =  dateLabels;
       
    }

    getCGLabels = (startDate, endDate) => {
        const oneDay = 1000 * 3600 * 24;
        const dayDifference = (endDate - startDate) / oneDay;
    
        if(dayDifference <= 7) {
            return this.cgLabelGenerator(dayDifference, startDate, endDate, dayDifference);
        }
        else {
            return this.cgLabelGenerator(10, startDate, endDate, dayDifference);
        }
    }
    
    cgLabelGenerator = (numLabels, startDate, endDate, dayDifference) => {
        let dateLabels = [];
        let date = null;
        let dd = "";
        let mm = "";
        let yyyy = "";
        let dateString = "";
    
        for(let i = 0; i < numLabels - 1; ++i) {
            date = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + 1 + (Math.ceil(dayDifference / numLabels - 1) * i));
            dd = String(date.getDate()).padStart(2, '0');
            mm = String(date.getMonth() + 1).padStart(2, '0');
            yyyy = date.getFullYear();
            dateString = mm + '/' + dd + '/' + yyyy;
            dateLabels.push(dateString);
        }
    
        // add endDate label. Got to guarentee the endDate is the last label
        date = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
        dd = String(date.getDate()).padStart(2, '0');
        mm = String(date.getMonth() + 1).padStart(2, '0');
        yyyy = date.getFullYear();
        dateString = mm + '/' + dd + '/' + yyyy;
        dateLabels.push(dateString);
        
        //this.state.lifetime = datedata
       this.state.lifetimelabels = dateLabels

    }
    //--------------------------------------------
    locationEntered = (location) => {
        if(location.type === "city") {
            this.setState({
                location: location.name + ", " + location.administrative // City, State
            })
            // query the database for the city
        }
        else if(location.type === "address") {
            this.setState({
                location: location.name + ", " + location.city + ", " + location.administrative // Address, City, State
            })
            this.getDataFromDbDate(location.query)
            // query the database for the address
        }
    }

    render() {
        this.getLastWeekLabels()
        this.getLast30DaysLabels()
        this.getLastYearLabels()
        return (
            <div>
                <Helmet>
                <meta charset="utf-8"/>
                <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no"/>
                <script src="https://cdn.jsdelivr.net/npm/chart.js@2.8.0"></script>
                <link href="https://fonts.googleapis.com/css?family=Roboto:300,400&display=swap" rel="stylesheet"/>
                <link rel="stylesheet" href="styles_loc_stats.css"/>
                <title>Location Stats</title>
                </Helmet>
                <div classNameName="main-container">
                    <div className="search-container">
                        <div id="search-form">
                            <AlgoliaPlaces
                                placeholder='Write an address or city here'
                            
                                options={{
                                    appId: 'plYR0C6D25C3',
                                    apiKey: 'cb7d79d87daed4f68068500409865fa1',
                                    language: 'en'
                                    // Other options from https://community.algolia.com/places/documentation.html#options
                                }}
                            
                                onChange={
                                    ({ query, rawAnswer, suggestion, suggestionIndex }) => {
                                        this.locationEntered(suggestion);
                                        console.log(suggestion); 
                                        // this is the object that is returned when the user enters a location
                                        // use it for the query of the database if needed
                                    }
                                }
                            />
                        </div>
                    </div>

                    <div className="stats-container">
                        <h1 id="location">{this.state.location}</h1>
                        <MailCountChartContainer data={this.state.data} state={this.state}/>
                        <AddressesTable data={this.state.data} />
                    </div>
                </div>
            </div>
        )
    }
}

export default locStats