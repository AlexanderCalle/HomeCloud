import Axios from 'axios';
import React, { Component } from 'react';

class Profile extends Component {

    constructor(props) {
        super(props);
        this.state = {}
    }

    componentDidMount() {
        const token = JSON.parse(localStorage.getItem('tokens'));

        Axios({method: 'GET', url: `http://localhost:3030/myprofile/${token.id}`})
            .then(res => {
                if(res.status === 200) {
                    this.setState(res.data);
                    console.log(this.state)
                }
            }).catch(e => console.log(e));
    }

    render() {
        return (
            <>
                <div className='flex flex-col space-y-16 items-center p-6'>
                    <div className='flex rounded-full h-32 w-32 justify-center items-center bg-gray-300'>
                        <svg class="w-32 h-32 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    </div>
                    <div className="flex flex-col items-center space-y-8">
                        <div className="flex flex-col items-center space-y-2">
                            <div className='flex flex-row space-x-1'>
                                <p>name: </p>
                                <p>{this.state.firstname}</p>
                                <p>{this.state.lastname}</p>
                            </div>
                            <p>email: {this.state.email}</p>
                        </div>
                        <button type="button" className="w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-500 text-base font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm">
                            Update profile
                        </button> 
                    </div>
                </div>
            </>
        )
    }
}

export default Profile;