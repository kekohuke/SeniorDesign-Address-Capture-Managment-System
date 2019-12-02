import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {Bar, Line} from 'react-chartjs-2';

export class Chart extends Component{
    constructor(props){
        super(props);
        this.state = {
            // Can't really do the charts with state props. Leaving this for now. 
        }
    }

    render() {
        let chart = null;

        if(this.props.chartTimeframe === "week") {
            chart = <Bar 
                data={this.getLastWeekData}
                options={this.getOptions()} />
        }
        else if(this.props.chartTimeframe === "month") {
            chart = <Line 
                data={this.getLast30DaysData}
                options={this.getOptions()} />
        }
        else if(this.props.chartTimeframe === "year") {
            chart = <Line 
                data={this.getLastYearData}
                options={this.getOptions()} />
        }
        else if(this.props.chartTimeframe === "lifetime") {
            chart = <Line 
                data={this.getLifetimeData}
                options={this.getOptions()} />
        }

        return (
            <div className="chart">
                {chart}
            </div>
        )
    }

    // ---Time frame helpers

    // add the database query to show the total.
    getOptions = () => {
        return {
            responsive: true,
            maintainAspectRatio: false,
            legend: {
                display: false
            },
            title: {
                display: true,
                text: "Total mail sent this past " + this.props.chartTimeframe + ". Total: " +this.props.state[this.props.chartTimeframe+"_num"],
                fontSize: 18
            },
            scales: {
                xAxes: [{
                gridLines: {
                    display:true
                },
                ticks: {
                    fontSize: 16
                }  
                }],
                yAxes: [{
                    gridLines: {
                        display:true
                    },
                    ticks: {
                        beginAtZero: true,
                        fontSize: 16
                    }   
                }]
            }
        };
    }
<<<<<<< HEAD
    
    getDataFromDbDate =  (fromDate, toDate, var_name, i) => {

        axios.post('http://localhost:3001/api/getData_bydate', {
            fromDate: fromDate,
            toDate: toDate,
        }).then((res) => {
           // console.log(var_name)
             var_name[i] = res.data.data.length;
            return res.data.data.length;
            //this.setState({ [var_name]: res.data.data })
        });
    };
=======
>>>>>>> 257706cce3da40629e76062bec403d1fdf5f0414

    getLastWeekData = () => {
        // we must query the database for 'data' in the datasets object
        return {
            labels: this.props.state.weeklables,
            datasets: [{
              data: this.props.state.week,
              backgroundColor: [
                "rgba(255, 99, 132, 0.5)",
                "rgba(54, 162, 235, 0.5)",
                "rgba(255, 206, 86, 0.5)",
                "rgba(75, 192, 192, 0.5)",
                "rgba(153, 102, 255, 0.5)",
                "rgba(255, 159, 64, 0.5)",
                "rgba(105, 205, 0, 0.5)"
          
              ],
              borderColor: [
                "rgba(255,99,132,1)",
                "rgba(54, 162, 235, 1)",
                "rgba(255, 206, 86, 1)",
                "rgba(75, 192, 192, 1)",
                "rgba(153, 102, 255, 1)",
                "rgba(255, 159, 64, 1)",
                "rgba(105, 205, 0, 1)"
              ],
              borderWidth: 1
            }]
        };
    }

    getLast30DaysData = () => {
        const monthdata = this.props.state.month
        return {
            labels: this.props.state.monthlables,
            datasets: [{
                backgroundColor: "rgb(255, 99, 132)",
                borderColor: "rgb(255, 99, 132)",
                data: monthdata
            }]
        };
    }

    getLastYearData = () => {
        return {
            labels: this.props.state.yearlables,
            datasets: [{
                backgroundColor: "rgb(255, 99, 132)",
                borderColor: "rgb(255, 99, 132)",
                data: this.props.state.year
            }]
        }
    }

    // getCGLabels are currently hard coded.
    // Need to get the database start date(the day it was created) and end date(today's date).
    getLifetimeData = () => {
        return {
            labels: this.props.state.lifetimelables,
            datasets: [{
                backgroundColor: "rgb(255, 99, 132)",
                borderColor: "rgb(255, 99, 132)",
                data: this.props.state.lifetime
            }]
        }
    }

    // ---Label functions for mail count chart

}

// Prop passed in through the dashboard component
Chart.propTypes = {
    chartTimeframe: PropTypes.string.isRequired
};

export default Chart;